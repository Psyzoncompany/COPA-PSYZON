/**
 * COPA PSYZON — Offline-First Data Persistence System
 * 
 * Architecture: localStorage (PRIMARY) + Firebase Firestore (SECONDARY)
 * Single global object: appState { version, updatedAt, data }
 * 
 * Rules:
 * - SAVE: localStorage first, then Firebase
 * - LOAD: compare timestamps, use most recent
 * - NEVER depend only on Firebase
 * - NEVER lose data if offline
 */
(function () {
  'use strict';

  /* ==========================================================
     CONSTANTS
     ========================================================== */
  const LS_KEY = 'appState_backup';
  const LS_HISTORY_KEY = 'appState_history';
  const HISTORY_MAX = 10;
  const DEBOUNCE_MS = 800;
  const FIREBASE_COLLECTION = 'estado';
  const FIREBASE_DOC = 'principal';

  /* ==========================================================
     STATUS INDICATOR
     ========================================================== */
  const STATUS = {
    SAVING: 'saving',
    SAVED_LOCAL: 'saved_local',
    SYNCED: 'synced',
    OFFLINE: 'offline',
    RECOVERED: 'recovered'
  };

  const STATUS_LABELS = {
    [STATUS.SAVING]: 'Salvando...',
    [STATUS.SAVED_LOCAL]: 'Salvo localmente',
    [STATUS.SYNCED]: 'Sincronizado com servidor',
    [STATUS.OFFLINE]: 'Modo offline',
    [STATUS.RECOVERED]: 'Recuperado automaticamente'
  };

  const STATUS_ICONS = {
    [STATUS.SAVING]: '↻',
    [STATUS.SAVED_LOCAL]: '💾',
    [STATUS.SYNCED]: '☁',
    [STATUS.OFFLINE]: '⚡',
    [STATUS.RECOVERED]: '♻'
  };

  let currentStatus = STATUS.SAVED_LOCAL;
  let statusTimeout = null;

  function setStatus(status) {
    currentStatus = status;
    const el = document.getElementById('persistence-status');
    if (!el) return;

    el.className = 'persistence-status persistence-status--' + status;
    const iconEl = el.querySelector('.persistence-status-icon');
    const textEl = el.querySelector('.persistence-status-text');
    if (iconEl) iconEl.textContent = STATUS_ICONS[status] || '';
    if (textEl) textEl.textContent = STATUS_LABELS[status] || '';

    el.classList.add('persistence-status--visible');
    clearTimeout(statusTimeout);

    // Auto-hide after 3s for non-critical statuses
    if (status === STATUS.SYNCED || status === STATUS.SAVED_LOCAL) {
      statusTimeout = setTimeout(function () {
        el.classList.remove('persistence-status--visible');
      }, 3000);
    }
  }

  /* ==========================================================
     VALIDATION HELPERS
     ========================================================== */

  /**
   * Validate appState structure.
   * @param {*} obj
   * @returns {boolean}
   */
  function isValidAppState(obj) {
    if (!obj || typeof obj !== 'object') return false;
    if (typeof obj.version !== 'number' || obj.version < 0) return false;
    if (typeof obj.updatedAt !== 'string' || !obj.updatedAt) return false;
    if (!obj.data || typeof obj.data !== 'object') return false;
    return true;
  }

  /**
   * Safely parse JSON, returns null on failure.
   * @param {string} str
   * @returns {object|null}
   */
  function safeParse(str) {
    try {
      var parsed = JSON.parse(str);
      return (parsed && typeof parsed === 'object') ? parsed : null;
    } catch (_) {
      return null;
    }
  }

  /**
   * Clean object for safe serialization (replace undefined with null).
   * @param {object} obj
   * @returns {object}
   */
  function cleanForStorage(obj) {
    return JSON.parse(JSON.stringify(obj, function (_k, v) {
      return v === undefined ? null : v;
    }));
  }

  /* ==========================================================
     LOCAL STORAGE OPERATIONS
     ========================================================== */

  /**
   * Save appState to localStorage immediately.
   * @param {object} appState
   * @returns {boolean} success
   */
  function saveToLocal(appState) {
    try {
      if (!isValidAppState(appState)) {
        console.warn('[Persistence] Tentativa de salvar appState inválido no localStorage.');
        return false;
      }
      var serialized = JSON.stringify(cleanForStorage(appState));
      localStorage.setItem(LS_KEY, serialized);
      return true;
    } catch (err) {
      console.error('[Persistence] Erro ao salvar no localStorage:', err);
      return false;
    }
  }

  /**
   * Load appState from localStorage.
   * @returns {object|null}
   */
  function loadFromLocal() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (!raw) return null;
      var parsed = safeParse(raw);
      if (isValidAppState(parsed)) return parsed;
      console.warn('[Persistence] Dados corrompidos no localStorage.');
      return null;
    } catch (err) {
      console.error('[Persistence] Erro ao ler localStorage:', err);
      return null;
    }
  }

  /* ==========================================================
     HISTORY MANAGEMENT (FIFO, max 10)
     ========================================================== */

  /**
   * Push a version to history.
   * @param {object} appState
   */
  function pushToHistory(appState) {
    try {
      if (!isValidAppState(appState)) return;
      var history = loadHistory();
      history.push(cleanForStorage(appState));
      // Keep only last HISTORY_MAX
      if (history.length > HISTORY_MAX) {
        history = history.slice(history.length - HISTORY_MAX);
      }
      localStorage.setItem(LS_HISTORY_KEY, JSON.stringify(history));
    } catch (err) {
      console.error('[Persistence] Erro ao salvar histórico:', err);
    }
  }

  /**
   * Load history array from localStorage.
   * @returns {Array}
   */
  function loadHistory() {
    try {
      var raw = localStorage.getItem(LS_HISTORY_KEY);
      if (!raw) return [];
      var parsed = safeParse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter(isValidAppState);
      }
      return [];
    } catch (_) {
      return [];
    }
  }

  /**
   * Get the most recent valid entry from history.
   * @returns {object|null}
   */
  function getLatestFromHistory() {
    var history = loadHistory();
    if (history.length === 0) return null;
    // History is chronological, last entry is newest
    return history[history.length - 1];
  }

  /* ==========================================================
     FIREBASE OPERATIONS
     ========================================================== */

  /**
   * Get Firestore instance if available.
   * @returns {object|null}
   */
  function getFirestore() {
    try {
      if (typeof firebase !== 'undefined' && firebase.firestore) {
        return firebase.firestore();
      }
    } catch (_) { /* ignore */ }
    return null;
  }

  /**
   * Save appState to Firebase Firestore (background, non-blocking).
   * @param {object} appState
   * @param {function} [onSuccess]
   * @param {function} [onError]
   */
  function saveToFirebase(appState, onSuccess, onError) {
    var firestore = getFirestore();
    if (!firestore) {
      if (onError) onError(new Error('Firebase indisponível'));
      return;
    }
    try {
      if (!isValidAppState(appState)) {
        if (onError) onError(new Error('appState inválido'));
        return;
      }
      var cleanData = cleanForStorage(appState);
      firestore.collection(FIREBASE_COLLECTION).doc(FIREBASE_DOC)
        .set(cleanData)
        .then(function () {
          if (onSuccess) onSuccess();
        })
        .catch(function (err) {
          console.error('[Persistence] Erro ao salvar no Firebase:', err);
          if (onError) onError(err);
        });
    } catch (err) {
      console.error('[Persistence] Exceção ao salvar no Firebase:', err);
      if (onError) onError(err);
    }
  }

  /**
   * Load appState from Firebase Firestore.
   * @returns {Promise<object|null>}
   */
  function loadFromFirebase() {
    return new Promise(function (resolve) {
      var firestore = getFirestore();
      if (!firestore) {
        resolve(null);
        return;
      }
      try {
        firestore.collection(FIREBASE_COLLECTION).doc(FIREBASE_DOC)
          .get({ source: 'server' })
          .then(function (doc) {
            if (doc.exists) {
              var data = doc.data();
              if (isValidAppState(data)) {
                resolve(data);
              } else {
                console.warn('[Persistence] Dados do Firebase inválidos.');
                resolve(null);
              }
            } else {
              resolve(null);
            }
          })
          .catch(function (err) {
            console.warn('[Persistence] Erro ao carregar do Firebase:', err);
            resolve(null);
          });
      } catch (err) {
        console.warn('[Persistence] Exceção ao carregar do Firebase:', err);
        resolve(null);
      }
    });
  }

  /* ==========================================================
     DEBOUNCE
     ========================================================== */
  var _debounceTimer = null;

  function debounce(fn, delay) {
    return function () {
      var args = arguments;
      var ctx = this;
      clearTimeout(_debounceTimer);
      _debounceTimer = setTimeout(function () {
        fn.apply(ctx, args);
      }, delay);
    };
  }

  /* ==========================================================
     CORE PERSISTENCE API
     ========================================================== */

  /**
   * Current appState in memory.
   * @type {{ version: number, updatedAt: string, data: object }}
   */
  var _appState = {
    version: 0,
    updatedAt: new Date().toISOString(),
    data: {}
  };

  /**
   * Wrap raw state data into appState format.
   * @param {object} rawState - The application state data
   * @param {number} [version] - Optional version override
   * @returns {object} appState envelope
   */
  function wrapState(rawState, version) {
    var v = typeof version === 'number' ? version : (_appState.version + 1);
    return {
      version: v,
      updatedAt: new Date().toISOString(),
      data: rawState || {}
    };
  }

  /**
   * Internal: perform the actual save to localStorage + Firebase.
   * @param {object} appState
   */
  function _performSave(appState) {
    if (!isValidAppState(appState)) return;

    setStatus(STATUS.SAVING);

    // 1. Save to localStorage FIRST (priority)
    var localOk = saveToLocal(appState);
    if (localOk) {
      // Push to history
      pushToHistory(appState);
      setStatus(STATUS.SAVED_LOCAL);
    }

    // 2. Save to Firebase (secondary, background)
    saveToFirebase(appState, function () {
      setStatus(STATUS.SYNCED);
    }, function () {
      // Firebase failed, we're in offline mode but data is safe locally
      if (localOk) {
        setStatus(STATUS.OFFLINE);
      }
    });
  }

  /** Debounced save for Firebase (localStorage saves immediately) */
  var _debouncedFirebaseSave = debounce(function (appState) {
    saveToFirebase(appState, function () {
      setStatus(STATUS.SYNCED);
    }, function () {
      setStatus(STATUS.OFFLINE);
    });
  }, DEBOUNCE_MS);

  /**
   * MAIN SAVE FUNCTION — called by the app on every state change.
   * Saves to localStorage immediately, Firebase with debounce.
   * @param {object} rawState - The full application state (will be wrapped)
   */
  function persistState(rawState) {
    if (!rawState || typeof rawState !== 'object') return;

    // Increment version and update timestamp
    _appState = wrapState(rawState, _appState.version + 1);

    setStatus(STATUS.SAVING);

    // 1. Immediate localStorage save
    var localOk = saveToLocal(_appState);
    if (localOk) {
      pushToHistory(_appState);
      setStatus(STATUS.SAVED_LOCAL);
    }

    // 2. Debounced Firebase save
    _debouncedFirebaseSave(_appState);
  }

  /**
   * RECOVERY FUNCTION — called on app startup.
   * Compares Firebase and localStorage, uses most recent.
   * @returns {Promise<object|null>} The recovered raw state data, or null
   */
  function recoverState() {
    return new Promise(function (resolve) {
      var localState = loadFromLocal();

      loadFromFirebase().then(function (firebaseState) {
        var chosen = null;
        var source = 'none';

        // Compare timestamps to pick most recent
        if (localState && firebaseState) {
          var localTime = new Date(localState.updatedAt).getTime();
          var firebaseTime = new Date(firebaseState.updatedAt).getTime();
          if (firebaseTime > localTime) {
            chosen = firebaseState;
            source = 'firebase';
          } else {
            chosen = localState;
            source = 'local';
          }
        } else if (firebaseState) {
          chosen = firebaseState;
          source = 'firebase';
        } else if (localState) {
          chosen = localState;
          source = 'local';
        }

        // Failsafe: try history if nothing found
        if (!chosen) {
          chosen = getLatestFromHistory();
          if (chosen) source = 'history';
        }

        if (chosen && isValidAppState(chosen)) {
          _appState = chosen;

          // Cross-sync: save to wherever it was missing
          if (source === 'firebase') {
            saveToLocal(chosen);
          } else if (source === 'local' || source === 'history') {
            saveToFirebase(chosen);
          }

          if (source === 'firebase') {
            setStatus(STATUS.SYNCED);
          } else if (source === 'history') {
            setStatus(STATUS.RECOVERED);
          } else {
            setStatus(STATUS.SAVED_LOCAL);
          }

          console.log('[Persistence] Estado recuperado de: ' + source + ', versão: ' + chosen.version);
          resolve(chosen.data);
        } else {
          console.log('[Persistence] Nenhum estado salvo encontrado.');
          resolve(null);
        }
      }).catch(function () {
        // Firebase completely failed, fall back to local
        if (localState && isValidAppState(localState)) {
          _appState = localState;
          setStatus(STATUS.OFFLINE);
          console.log('[Persistence] Firebase falhou. Usando localStorage.');
          resolve(localState.data);
        } else {
          var historyState = getLatestFromHistory();
          if (historyState && isValidAppState(historyState)) {
            _appState = historyState;
            setStatus(STATUS.RECOVERED);
            console.log('[Persistence] Recuperado do histórico.');
            resolve(historyState.data);
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  /* ==========================================================
     EXPORT / IMPORT
     ========================================================== */

  /**
   * Export full appState as a downloadable JSON file.
   */
  function exportarBackup() {
    try {
      if (!isValidAppState(_appState)) {
        console.warn('[Persistence] Nada para exportar.');
        return;
      }
      var dataStr = JSON.stringify(cleanForStorage(_appState), null, 2);
      var blob = new Blob([dataStr], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      var date = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = 'appState_backup_' + date + '.json';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      console.error('[Persistence] Erro ao exportar:', err);
    }
  }

  /**
   * Import a JSON backup, validate, and replace current appState.
   * @param {string} jsonString - raw JSON string
   * @returns {{ success: boolean, error?: string }}
   */
  function importarBackup(jsonString) {
    try {
      var parsed = safeParse(jsonString);
      if (!parsed) {
        return { success: false, error: 'JSON inválido.' };
      }

      // Accept both wrapped appState and raw state
      var appState;
      if (isValidAppState(parsed)) {
        // Already wrapped — bump version
        appState = {
          version: Math.max(parsed.version, _appState.version) + 1,
          updatedAt: new Date().toISOString(),
          data: parsed.data
        };
      } else if (typeof parsed === 'object' && !Array.isArray(parsed)) {
        // Raw state data — wrap it
        appState = wrapState(parsed, _appState.version + 1);
      } else {
        return { success: false, error: 'Formato não reconhecido.' };
      }

      if (!isValidAppState(appState)) {
        return { success: false, error: 'Estrutura inválida após processamento.' };
      }

      _appState = appState;
      _performSave(appState);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  /* ==========================================================
     GETTERS
     ========================================================== */

  /** Get current appState (full envelope). */
  function getAppState() {
    return _appState;
  }

  /** Get current version number. */
  function getVersion() {
    return _appState.version;
  }

  /** Get current raw state data. */
  function getData() {
    return _appState.data;
  }

  /** Get local history array. */
  function getHistory() {
    return loadHistory();
  }

  /** Get current status string. */
  function getStatus() {
    return currentStatus;
  }

  /* ==========================================================
     PUBLIC API — exposed on window.Persistence
     ========================================================== */
  window.Persistence = {
    // Core
    persistState: persistState,
    recoverState: recoverState,

    // Getters
    getAppState: getAppState,
    getVersion: getVersion,
    getData: getData,
    getHistory: getHistory,
    getStatus: getStatus,

    // Export/Import
    exportarBackup: exportarBackup,
    importarBackup: importarBackup,

    // Direct access (for advanced use)
    saveToLocal: saveToLocal,
    loadFromLocal: loadFromLocal,
    saveToFirebase: saveToFirebase,
    loadFromFirebase: loadFromFirebase,
    isValidAppState: isValidAppState,
    setStatus: setStatus,

    // Constants
    STATUS: STATUS,
    STATUS_LABELS: STATUS_LABELS
  };

})();
