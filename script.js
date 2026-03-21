/**
 * COPA PSYZON — Tournament Management Platform
 * Complete IIFE-wrapped application for managing elimination-style tournaments.
 */
(function () {
  'use strict';

  /* ==========================================================
     1. FIREBASE INITIALIZATION
     ========================================================== */
  const firebaseConfig = {
    apiKey: "AIzaSyDPH-ltsHg4nYeoZpDPq_80sfvcMaS-oXs",
    authDomain: "copa-psyzon.firebaseapp.com",
    projectId: "copa-psyzon",
    storageBucket: "copa-psyzon.firebasestorage.app",
    messagingSenderId: "74729053927",
    appId: "1:74729053927:web:ec295dcc38c640256d8c42",
    measurementId: "G-KH01335LK1"
  };

  /** @type {boolean} Whether Firebase is available */
  let firebaseAvailable = false;
  /** @type {object|null} Firebase auth instance */
  let auth = null;

  // Fallback credentials for when Firebase is not available.
  // Password is stored as a SHA-256 hash to avoid exposing plaintext in source.
  const FALLBACK_EMAIL = 'copa-psyzon@email.com';
  const EXPECTED_HASH = '4c5c37fa864741cb705483c370095dbf5d14fa0ffa76de4b5f11a8f897160fb2';

  /**
   * Compute SHA-256 hash of a string using the Web Crypto API.
   * @param {string} str
   * @returns {Promise<string>} hex-encoded hash
   */
  async function sha256(str) {
    const buf = new TextEncoder().encode(str);
    const hashBuf = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  try {
    if (typeof firebase !== 'undefined' && firebase.initializeApp) {
      firebase.initializeApp(firebaseConfig);
      auth = firebase.auth();
      if (firebase.analytics) {
        firebase.analytics();
      }
      firebaseAvailable = true;
    }
  } catch (_) {
    firebaseAvailable = false;
  }

  /* ==========================================================
     2. STATE MANAGEMENT
     ========================================================== */
  const STORAGE_KEY = 'copaPsyzonState';
  const REMEMBER_KEY = 'copaPsyzonRemember';

  let isAdmin = false;
  let currentUser = null;

  /** @type {{ tournamentName: string, teamCount: number, teams: Array<{id:string, teamName:string, playerName:string}>, prize: string, bracket: null|{rounds: Array}, champion: null|{teamName:string, playerName:string} }} */
  let state = defaultState();

  /** Returns a fresh default state object */
  function defaultState() {
    return {
      tournamentName: '',
      teamCount: 8,
      teams: [],
      prize: '',
      bracket: null,
      champion: null,
      playerStats: {}
    };
  }

  /** Persist current state to localStorage */
  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) { /* quota exceeded – silently fail */ }
  }

  /** Load state from localStorage (or use defaults) */
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        state = Object.assign(defaultState(), parsed);
      }
    } catch (_) {
      state = defaultState();
    }
  }

  /* ==========================================================
     3. DOM REFERENCES (cached for performance)
     ========================================================== */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  /* ==========================================================
     4. UTILITY FUNCTIONS
     ========================================================== */

  /**
   * Fisher-Yates shuffle (in-place, returns same array).
   * @param {Array} arr
   * @returns {Array}
   */
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /** Generate a unique id string */
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  /**
   * Sanitize a string for safe HTML insertion (prevent XSS).
   * @param {string} str
   * @returns {string}
   */
  function sanitize(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /** Get initials (up to 2 chars) from a name for avatar placeholder */
  function initials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }


  /* ==========================================================
     4b. SVG ICON CONSTANTS
     ========================================================== */
  const SVG = {
    soccer: '<svg class="svg-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>',
    trophy: '<svg class="svg-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
    pencil: '<svg class="svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',
    checkCircle: '<svg class="svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>',
    success: '<svg class="svg-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>',
    error: '<svg class="svg-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>',
    info: '<svg class="svg-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-yellow, #ffcc00)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>'
  };


  /* ==========================================================
     4c. RANDOM TEAM NAME GENERATOR
     ========================================================== */
  const RANDOM_TEAM_NAMES = [
    'Trovões FC', 'Águias Douradas', 'Fúria Negra', 'Dragões de Fogo',
    'Lobos Selvagens', 'Falcões de Aço', 'Leões do Norte', 'Tubarões Azuis',
    'Panteras Negras', 'Fênix Renascida', 'Relâmpago FC', 'Guerreiros de Ferro',
    'Cobras Venenosas', 'Titãs do Sul', 'Cavaleiros da Lua', 'Vulcões FC',
    'Estrelas Cadentes', 'Tempestade FC', 'Raposas Douradas', 'Condores Reais',
    'Spartanos FC', 'Vikings do Gelo', 'Samurais FC', 'Gladiadores FC',
    'Cometas FC', 'Furacão Vermelho', 'Bravos de Elite', 'Supremos FC',
    'Raios de Sol', 'Predadores FC', 'Corsários FC', 'Piratas do Mar',
    'Tigres de Bengal', 'Escorpiões FC', 'Minotauros FC', 'Pegasus FC',
    'Netuno FC', 'Hércules FC', 'Atenas FC', 'Apolo FC',
    'Centauros FC', 'Avalanche FC'
  ];

  /** Generate a random team name not already in use */
  function generateRandomTeamName() {
    const usedNames = state.teams.map(t => t.teamName.toLowerCase());
    const available = RANDOM_TEAM_NAMES.filter(n => !usedNames.includes(n.toLowerCase()));
    if (available.length === 0) {
      showToast('Todos os nomes aleatórios já foram usados.', 'info');
      return '';
    }
    return available[Math.floor(Math.random() * available.length)];
  }

  /* ==========================================================
     4d. PHOTO RESIZE HELPER
     ========================================================== */

  /**
   * Resize an image file to max 80x80 and return as base64 data URL.
   * @param {File} file
   * @returns {Promise<string>}
   */
  function resizeImageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
          const maxSize = 80;
          let w = img.width;
          let h = img.height;
          if (w > h) {
            if (w > maxSize) { h = Math.round(h * maxSize / w); w = maxSize; }
          } else {
            if (h > maxSize) { w = Math.round(w * maxSize / h); h = maxSize; }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /* ==========================================================
     5. TOAST NOTIFICATIONS
     ========================================================== */

  /**
   * Show a toast notification.
   * @param {string} message
   * @param {'success'|'error'|'info'} type
   */
  function showToast(message, type = 'info') {
    const container = $('#toast-container');
    if (!container) return;

    const icons = { success: SVG.success, error: SVG.error, info: SVG.info };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><span>${sanitize(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      toast.addEventListener('animationend', () => toast.remove());
    }, 3500);
  }

  /* ==========================================================
     6. AUTH MANAGEMENT
     ========================================================== */

  /** Show login screen, hide main app */
  function showLoginScreen() {
    const loginScreen = $('#login-screen');
    const mainApp = $('#main-app');
    const gameScreen = $('#game-selection-screen');
    if (loginScreen) loginScreen.style.display = '';
    if (mainApp) mainApp.style.display = 'none';
    if (gameScreen) gameScreen.style.display = 'none';
    // Reset login form
    const loginForm = $('#login-form');
    if (loginForm) loginForm.style.display = 'none';
    const loginError = $('#login-error');
    if (loginError) loginError.textContent = '';
  }

  /**
   * Show main app with role-based UI.
   * @param {boolean} admin
   */
  function showMainApp(admin) {
    isAdmin = admin;
    const loginScreen = $('#login-screen');
    const mainApp = $('#main-app');
    const gameScreen = $('#game-selection-screen');
    if (loginScreen) loginScreen.style.display = 'none';
    if (mainApp) mainApp.style.display = '';
    if (gameScreen) gameScreen.style.display = 'none';

    // Role badge
    const badge = $('#role-badge');
    if (badge) {
      if (admin) {
        badge.textContent = 'DONO';
        badge.style.background = 'rgba(0,122,255,0.12)';
        badge.style.color = '#007aff';
      } else {
        badge.textContent = 'VISITANTE';
        badge.style.background = '';
        badge.style.color = '';
      }
    }

    // Toggle admin-only elements
    $$('.admin-only').forEach((el) => {
      el.style.display = admin ? '' : 'none';
    });

    // Render current state into the UI
    populateFormFromState();
    renderTeamList();
    renderPrize();
    renderTournamentTitle();
    renderBracket();
    renderTop3();
    if (admin) {
      populateClientSelect();
    }
  }

  /** Translate Firebase auth errors to Portuguese messages */
  function authErrorMessage(code) {
    const map = {
      'auth/invalid-email': 'E-mail inválido.',
      'auth/user-disabled': 'Esta conta foi desativada.',
      'auth/user-not-found': 'Usuário não encontrado.',
      'auth/wrong-password': 'Senha incorreta.',
      'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
      'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
      'auth/invalid-credential': 'Credenciais inválidas. Verifique e-mail e senha.',
      'auth/invalid-login-credentials': 'Credenciais inválidas. Verifique e-mail e senha.'
    };
    return map[code] || 'Erro ao fazer login. Tente novamente.';
  }

  /** Handle login form submission */
  function handleLogin(e) {
    e.preventDefault();
    const email = ($('#login-email') || {}).value || '';
    const password = ($('#login-password') || {}).value || '';
    const errorEl = $('#login-error');
    if (errorEl) errorEl.textContent = '';

    if (!email.trim() || !password.trim()) {
      if (errorEl) errorEl.textContent = 'Preencha todos os campos.';
      return;
    }

    // Disable submit button to prevent double-submission
    const submitBtn = $('#login-form button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    if (firebaseAvailable && auth) {
      // Firebase authentication
      auth.signInWithEmailAndPassword(email, password)
        .then(() => {
          // onAuthStateChanged will handle the rest
        })
        .catch((err) => {
          if (errorEl) errorEl.textContent = authErrorMessage(err.code);
        })
        .finally(() => {
          if (submitBtn) submitBtn.disabled = false;
        });
    } else {
      // Fallback authentication (local credential check with hashed password)
      sha256(password).then((hash) => {
        if (email.trim() === FALLBACK_EMAIL && hash === EXPECTED_HASH) {
          isAdmin = true;
          currentUser = { email: FALLBACK_EMAIL };
          showMainApp(true);
        } else {
          if (errorEl) errorEl.textContent = 'Credenciais inválidas. Verifique e-mail e senha.';
        }
        if (submitBtn) submitBtn.disabled = false;
      }).catch(() => {
        if (errorEl) errorEl.textContent = 'Erro ao verificar credenciais.';
        if (submitBtn) submitBtn.disabled = false;
      });
    }
  }

  /** Handle visitor button - show game selection screen */
  function handleVisitor() {
    isAdmin = false;
    currentUser = null;

    // Save remember choice
    const rememberCheck = $('#remember-choice');
    if (rememberCheck && rememberCheck.checked) {
      try { localStorage.setItem(REMEMBER_KEY, 'visitor'); } catch (_) { /* ignore */ }
    } else {
      try { localStorage.removeItem(REMEMBER_KEY); } catch (_) { /* ignore */ }
    }

    showGameSelection();
  }

  /** Show game selection screen */
  function showGameSelection() {
    const loginScreen = $('#login-screen');
    const mainApp = $('#main-app');
    const gameScreen = $('#game-selection-screen');
    if (loginScreen) loginScreen.style.display = 'none';
    if (mainApp) mainApp.style.display = 'none';
    if (gameScreen) gameScreen.style.display = '';
  }

  /** Handle FIFA game selection */
  function handleGameFifa() {
    showMainApp(false);
  }

  /** Handle back from game selection */
  function handleGameBack() {
    try { localStorage.removeItem(REMEMBER_KEY); } catch (_) { /* ignore */ }
    showLoginScreen();
  }

  /** Handle logout */
  function handleLogout() {
    try { localStorage.removeItem(REMEMBER_KEY); } catch (_) { /* ignore */ }
    if (firebaseAvailable && auth) {
      auth.signOut().then(() => {
        isAdmin = false;
        currentUser = null;
        showLoginScreen();
      }).catch(() => {
        isAdmin = false;
        currentUser = null;
        showLoginScreen();
      });
    } else {
      isAdmin = false;
      currentUser = null;
      showLoginScreen();
    }
  }

  /* ==========================================================
     7. LOGIN FORM TOGGLE
     ========================================================== */

  /** Toggle login form visibility with slide animation */
  function toggleLoginForm() {
    const form = $('#login-form');
    if (!form) return;
    if (form.style.display === 'none' || !form.style.display) {
      form.style.display = 'block';
      form.style.animation = 'slideUp 0.3s ease';
      // Focus first input
      const emailInput = $('#login-email');
      if (emailInput) emailInput.focus();
    } else {
      form.style.display = 'none';
    }
  }

  /* ==========================================================
     8. FORM STATE SYNC
     ========================================================== */

  /** Populate sidebar form fields from current state */
  function populateFormFromState() {
    const nameInput = $('#tournament-name');
    if (nameInput) nameInput.value = state.tournamentName || '';

    const countSelect = $('#team-count');
    if (countSelect) countSelect.value = String(state.teamCount || 8);

    const prizeInput = $('#prize-description');
    if (prizeInput) prizeInput.value = state.prize || '';
  }

  /** Save tournament name when it changes */
  function syncTournamentName() {
    const nameInput = $('#tournament-name');
    if (nameInput) {
      state.tournamentName = nameInput.value.trim();
      saveState();
      renderTournamentTitle();
    }
  }

  /** Render tournament title display */
  function renderTournamentTitle() {
    const display = $('#tournament-title-display');
    if (!display) return;
    if (state.tournamentName) {
      display.textContent = state.tournamentName;
      display.style.display = '';
    } else {
      display.textContent = '';
      display.style.display = 'none';
    }
  }

  /* ==========================================================
     9. PRIZE MANAGEMENT
     ========================================================== */

  /** Save prize from textarea */
  function handleSavePrize() {
    const prizeInput = $('#prize-description');
    if (!prizeInput) return;
    state.prize = prizeInput.value.trim();
    saveState();
    renderPrize();
    showToast('Premiação salva com sucesso!', 'success');
  }

  /** Render prize display banner */
  function renderPrize() {
    const display = $('#prize-display');
    const text = $('#prize-text');
    if (!display || !text) return;

    if (state.prize) {
      text.textContent = state.prize;
      display.style.display = '';
    } else {
      display.style.display = 'none';
    }
  }

  /* ==========================================================
     10. TEAM / PLAYER CRUD
     ========================================================== */

  /** Add a team+player to state */
  function handleAddTeam() {
    const teamInput = $('#team-name-input');
    const playerInput = $('#player-name-input');
    if (!teamInput || !playerInput) return;

    const teamName = teamInput.value.trim();
    const playerName = playerInput.value.trim();

    if (!teamName || !playerName) {
      showToast('Preencha o nome do time e do jogador.', 'error');
      return;
    }

    // Duplicate check (case-insensitive)
    const duplicate = state.teams.some(
      (t) => t.teamName.toLowerCase() === teamName.toLowerCase()
    );
    if (duplicate) {
      showToast('Já existe um time com esse nome.', 'error');
      return;
    }

    // Max count check
    const maxTeams = parseInt($('#team-count').value, 10) || state.teamCount;
    if (state.teams.length >= maxTeams) {
      showToast(`Limite de ${maxTeams} times atingido.`, 'error');
      return;
    }

    const photoInput = $('#player-photo-input');
    const photoFile = photoInput && photoInput.files && photoInput.files[0];

    function finishAddTeam(photoData) {
      const team = {
        id: generateId(),
        teamName,
        playerName
      };
      if (photoData) team.photo = photoData;
      state.teams.push(team);
      saveState();

      // Clear inputs
      teamInput.value = '';
      playerInput.value = '';
      if (photoInput) photoInput.value = '';
      teamInput.focus();

      renderTeamList();
      showToast(`Time "${teamName}" adicionado!`, 'success');
    }

    if (photoFile) {
      resizeImageToBase64(photoFile).then(finishAddTeam).catch(() => finishAddTeam(null));
      return;
    }
    finishAddTeam(null);
  }

  /**
   * Remove team by id.
   * @param {string} id
   */
  function removeTeam(id) {
    if (state.bracket) {
      showToast('Não é possível remover times com torneio ativo.', 'error');
      return;
    }
    const team = state.teams.find((t) => t.id === id);
    state.teams = state.teams.filter((t) => t.id !== id);
    saveState();
    renderTeamList();
    if (team) {
      showToast(`Time "${team.teamName}" removido.`, 'info');
    }
  }

  /** Render the team list in sidebar */
  function renderTeamList() {
    const container = $('#team-list');
    if (!container) return;

    const maxTeams = parseInt(($('#team-count') || {}).value, 10) || state.teamCount;

    if (state.teams.length === 0) {
      container.innerHTML = `<p style="text-align:center;color:var(--text-tertiary);font-size:13px;padding:12px 0;">Nenhum time cadastrado</p>`;
      return;
    }

    let html = `<p style="font-size:12px;color:var(--text-tertiary);margin-bottom:8px;font-weight:600;">${state.teams.length}/${maxTeams} times cadastrados</p>`;

    state.teams.forEach((team) => {
      const canDelete = !state.bracket;
      html += `
        <div class="team-item" data-id="${sanitize(team.id)}">
          <div class="team-item-info">
            <div class="team-avatar">${team.photo ? '<img src="' + sanitize(team.photo) + '" alt="">' : '<span class="av-placeholder">' + sanitize(initials(team.playerName)) + '</span>'}</div>
            <div>
              <div style="font-size:13px;font-weight:600;color:var(--text-primary);">${sanitize(team.teamName)}</div>
              <div style="font-size:12px;color:var(--text-secondary);">${sanitize(team.playerName)}</div>
            </div>
          </div>
          ${canDelete ? `<button type="button" class="btn-remove-team icon-btn" data-team-id="${sanitize(team.id)}" title="Remover time" aria-label="Remover time"><svg class="svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>` : ''}
        </div>`;
    });

    container.innerHTML = html;

    // Attach remove handlers
    container.querySelectorAll('.btn-remove-team').forEach((btn) => {
      btn.addEventListener('click', () => {
        removeTeam(btn.dataset.teamId);
      });
    });

    // Update client select if admin
    if (isAdmin) {
      populateClientSelect();
    }
  }

  /* ==========================================================
     11. TOURNAMENT GENERATION
     ========================================================== */

  /** Build a team slot data object from a team record */
  function makeTeamSlotData(t) {
    const slot = { teamName: t.teamName, playerName: t.playerName, score: null };
    if (t.photo) slot.photo = t.photo;
    return slot;
  }

  /**
   * Determine round names based on total number of teams.
   * @param {number} teamCount
   * @returns {string[]}
   */
  function getRoundNames(teamCount) {
    switch (teamCount) {
      case 32:
        return ['Primeira Fase', 'Oitavas de Final', 'Quartas de Final', 'Semifinal', 'Final'];
      case 16:
        return ['Oitavas de Final', 'Quartas de Final', 'Semifinal', 'Final'];
      case 8:
        return ['Quartas de Final', 'Semifinal', 'Final'];
      case 4:
        return ['Semifinal', 'Final'];
      default:
        return ['Final'];
    }
  }

  /** Generate bracket from registered teams */
  function handleGenerate() {
    // Sync team count from select
    const countSelect = $('#team-count');
    const requiredCount = parseInt(countSelect ? countSelect.value : state.teamCount, 10);
    state.teamCount = requiredCount;

    // Sync tournament name
    syncTournamentName();

    if (state.teams.length !== requiredCount) {
      showToast(`Cadastre exatamente ${requiredCount} times para gerar o chaveamento. Você tem ${state.teams.length}.`, 'error');
      return;
    }

    // Shuffle teams
    const shuffled = shuffleArray([...state.teams]);

    const roundNames = getRoundNames(requiredCount);
    if (roundNames.length === 0) {
      showToast('Quantidade de times inválida. Escolha 4, 8, 16 ou 32.', 'error');
      return;
    }
    let matchesInRound = requiredCount / 2;

    const rounds = [];

    roundNames.forEach((name, rIdx) => {
      const matches = [];
      for (let m = 0; m < matchesInRound; m++) {
        const match = {
          id: `r${rIdx}m${m}`,
          team1: null,
          team2: null,
          winner: null,
          penalties: null,
          dateTime: null
        };

        // First round: populate with shuffled teams
        if (rIdx === 0) {
          const t1 = shuffled[m * 2];
          const t2 = shuffled[m * 2 + 1];
          match.team1 = makeTeamSlotData(t1);
          match.team2 = makeTeamSlotData(t2);
        }

        matches.push(match);
      }
      rounds.push({ name, matches });
      matchesInRound = Math.floor(matchesInRound / 2);
    });

    state.bracket = { rounds };
    state.champion = null;
    saveState();

    renderBracket();
    showToast('Chaveamento gerado!', 'success');
  }

  /* ==========================================================
     12. BRACKET RENDERING
     ========================================================== */

  /** Main bracket render function */
  function renderBracket() {
    const container = $('#bracket-container');
    const emptyState = $('#empty-state');
    if (!container) return;

    // Clear
    container.innerHTML = '';

    if (!state.bracket || !state.bracket.rounds || state.bracket.rounds.length === 0) {
      if (emptyState) emptyState.style.display = '';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    const bracket = state.bracket;
    const bracketEl = document.createElement('div');
    bracketEl.className = 'bracket';

    bracket.rounds.forEach((round, rIdx) => {
      // Add connector column between rounds (except before the first)
      if (rIdx > 0) {
        const connCol = createConnectorColumn(bracket.rounds[rIdx - 1].matches.length, rIdx);
        bracketEl.appendChild(connCol);
      }

      const roundEl = document.createElement('div');
      roundEl.className = 'round';

      // Round header
      const roundIcon = rIdx === bracket.rounds.length - 1 ? SVG.trophy : SVG.soccer;
      const header = document.createElement('div');
      header.className = 'round-title';
      header.innerHTML = `<span class="icon">${roundIcon}</span> ${sanitize(round.name)}`;
      roundEl.appendChild(header);

      // Matches container
      const matchesEl = document.createElement('div');
      matchesEl.className = 'round-matches';

      round.matches.forEach((match, mIdx) => {
        const card = createMatchCard(match, rIdx, mIdx);
        matchesEl.appendChild(card);
      });

      roundEl.appendChild(matchesEl);
      bracketEl.appendChild(roundEl);
    });

    container.appendChild(bracketEl);

    // Show champion if already determined
    if (state.champion) {
      renderChampionBannerIfNeeded();
    }
  }

  /**
   * Create a connector column (SVG lines) between two rounds.
   * @param {number} prevMatchCount – number of matches in the previous round
   * @param {number} roundIndex
   * @returns {HTMLElement}
   */
  function createConnectorColumn(prevMatchCount, roundIndex) {
    const col = document.createElement('div');
    col.className = 'round connector-col';

    // We add a title placeholder to align with the round headers
    const titlePlaceholder = document.createElement('div');
    titlePlaceholder.className = 'round-title';
    titlePlaceholder.innerHTML = '&nbsp;';
    col.appendChild(titlePlaceholder);

    const svgWrap = document.createElement('div');
    svgWrap.style.flex = '1';
    svgWrap.style.position = 'relative';
    svgWrap.style.width = '100%';
    col.appendChild(svgWrap);

    // Defer SVG drawing until after layout
    requestAnimationFrame(() => {
      drawConnectors(svgWrap, col, prevMatchCount, roundIndex);
    });

    return col;
  }

  /**
   * Draw SVG connector lines inside the connector column.
   * Lines connect pairs of matches from the previous round to match slots in the next round.
   */
  function drawConnectors(svgWrap, col, prevMatchCount, roundIndex) {
    const bracket = col.closest('.bracket');
    if (!bracket) return;

    const rounds = bracket.querySelectorAll('.round:not(.connector-col)');
    const prevRound = rounds[roundIndex - 1];
    const nextRound = rounds[roundIndex];
    if (!prevRound || !nextRound) return;

    const prevCards = prevRound.querySelectorAll('.match-card');
    const nextCards = nextRound.querySelectorAll('.match-card');
    if (prevCards.length === 0 || nextCards.length === 0) return;

    const bracketRect = bracket.getBoundingClientRect();
    const colRect = col.getBoundingClientRect();

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'bracket-svg');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = col.offsetHeight + 'px';
    svg.style.overflow = 'visible';

    const colLeft = colRect.left;
    const colWidth = colRect.width;

    for (let i = 0; i < prevCards.length; i += 2) {
      const nextIdx = Math.floor(i / 2);
      if (nextIdx >= nextCards.length) break;

      const card1 = prevCards[i];
      const card2 = prevCards[i + 1];
      const target = nextCards[nextIdx];

      if (!card1 || !card2 || !target) continue;

      const r1 = card1.getBoundingClientRect();
      const r2 = card2.getBoundingClientRect();
      const rt = target.getBoundingClientRect();

      // Y positions relative to the column
      const y1 = r1.top + r1.height / 2 - colRect.top;
      const y2 = r2.top + r2.height / 2 - colRect.top;
      const yt = rt.top + rt.height / 2 - colRect.top;

      const midX = colWidth / 2;

      // Line from card1 right edge to midpoint
      addLine(svg, 0, y1, midX, y1);
      // Line from card2 right edge to midpoint
      addLine(svg, 0, y2, midX, y2);
      // Vertical line connecting the two
      addLine(svg, midX, y1, midX, y2);
      // Horizontal line from midpoint to next round
      addLine(svg, midX, yt, colWidth, yt);
    }

    svgWrap.appendChild(svg);
  }

  /** Helper to add an SVG line */
  function addLine(svg, x1, y1, x2, y2) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    svg.appendChild(line);
  }

  /**
   * Create a single match card element.
   * @param {object} match
   * @param {number} rIdx – round index
   * @param {number} mIdx – match index
   * @returns {HTMLElement}
   */
  function createMatchCard(match, rIdx, mIdx) {
    const card = document.createElement('div');
    card.className = 'match-card';
    card.dataset.matchId = match.id;

    // Header
    const header = document.createElement('div');
    header.className = 'match-header';

    const matchLabel = document.createElement('span');
    matchLabel.className = 'match-id';
    matchLabel.textContent = `Jogo ${mIdx + 1}`;
    header.appendChild(matchLabel);

    // Date/time display
    if (match.dateTime) {
      const dtSpan = document.createElement('span');
      dtSpan.className = 'match-datetime';
      try {
        const [datePart, timePart] = match.dateTime.split('T');
        if (datePart) {
          const [y, mo, d] = datePart.split('-');
          const formatted = d + '/' + mo + (timePart ? ' ' + timePart : '');
          dtSpan.textContent = formatted;
        }
      } catch (_) {
        dtSpan.textContent = match.dateTime;
      }
      header.appendChild(dtSpan);
    }

    // Edit button (admin only, both teams present, no winner yet)
    const bothTeams = match.team1 && match.team2;
    const canEdit = isAdmin && bothTeams && !match.winner;

    if (canEdit) {
      const editBtn = document.createElement('button');
      editBtn.className = 'match-schedule icon-btn';
      editBtn.type = 'button';
      editBtn.innerHTML = SVG.pencil + ' Resultado';
      editBtn.addEventListener('click', () => openScoreModal(rIdx, mIdx));
      header.appendChild(editBtn);
    } else if (match.winner) {
      const doneSpan = document.createElement('span');
      doneSpan.style.cssText = 'font-size:11px;color:var(--accent-green);font-weight:600;';
      doneSpan.innerHTML = SVG.checkCircle + ' Finalizado';
      header.appendChild(doneSpan);
    }

    card.appendChild(header);

    // Team 1 slot
    card.appendChild(createTeamSlot(match.team1, match, 1));

    // Team 2 slot
    card.appendChild(createTeamSlot(match.team2, match, 2));

    // Penalty info
    if (match.penalties) {
      const penDiv = document.createElement('div');
      penDiv.className = 'match-penalty-info';
      penDiv.innerHTML = `Pênaltis: ${match.penalties.team1} <svg class="svg-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="vertical-align:middle;"><path d="M18 6 6 18M6 6l12 12"/></svg> ${match.penalties.team2}`;
      card.appendChild(penDiv);
    }

    return card;
  }

  /**
   * Create a team slot inside a match card.
   * @param {object|null} team
   * @param {object} match
   * @param {1|2} teamNum
   * @returns {HTMLElement}
   */
  function createTeamSlot(team, match, teamNum) {
    const slot = document.createElement('div');
    slot.className = 'match-team';

    if (!team) {
      // TBD slot
      const nameSpan = document.createElement('span');
      nameSpan.className = 'team-name-bracket tbd';
      nameSpan.textContent = 'A definir';
      slot.appendChild(nameSpan);
      return slot;
    }

    // Winner/loser styling
    if (match.winner === teamNum) {
      slot.classList.add('winner');
    } else if (match.winner && match.winner !== teamNum) {
      slot.classList.add('loser');
    }

    // Avatar
    const avatar = document.createElement('div');
    avatar.className = 'team-avatar';
    if (team.photo) {
      const avImg = document.createElement('img');
      avImg.src = team.photo;
      avImg.alt = '';
      avatar.appendChild(avImg);
    } else {
      const avPlaceholder = document.createElement('span');
      avPlaceholder.className = 'av-placeholder';
      avPlaceholder.textContent = initials(team.playerName);
      avatar.appendChild(avPlaceholder);
    }
    slot.appendChild(avatar);

    // Player name (primary display in bracket)
    const nameSpan = document.createElement('span');
    nameSpan.className = 'team-name-bracket';
    nameSpan.textContent = team.playerName || team.teamName;
    nameSpan.title = `${team.teamName} — ${team.playerName}`;

    // Make player name clickable to show profile
    const teamRecord = state.teams.find(t => t.playerName === team.playerName && t.teamName === team.teamName);
    if (teamRecord) {
      nameSpan.classList.add('clickable');
      nameSpan.addEventListener('click', (e) => {
        e.stopPropagation();
        openPlayerProfile(teamRecord.id);
      });
    }

    slot.appendChild(nameSpan);

    // Score
    if (team.score !== null && team.score !== undefined) {
      const scoreSpan = document.createElement('span');
      scoreSpan.className = 'score-display';
      scoreSpan.textContent = String(team.score);
      slot.appendChild(scoreSpan);
    }

    return slot;
  }

  /* ==========================================================
     13. SCORE MODAL
     ========================================================== */

  /** Currently open match info for the modal */
  let modalMatch = { roundIdx: -1, matchIdx: -1 };

  /**
   * Open the score modal for a specific match.
   * @param {number} rIdx
   * @param {number} mIdx
   */
  function openScoreModal(rIdx, mIdx) {
    const match = state.bracket.rounds[rIdx].matches[mIdx];
    if (!match || !match.team1 || !match.team2) return;

    modalMatch = { roundIdx: rIdx, matchIdx: mIdx };

    const modal = $('#score-modal');
    if (!modal) return;

    // Populate team names
    const t1Name = $('#modal-team1-name');
    const t2Name = $('#modal-team2-name');
    if (t1Name) t1Name.textContent = match.team1.playerName;
    if (t2Name) t2Name.textContent = match.team2.playerName;

    // Scores
    const s1 = $('#modal-team1-score');
    const s2 = $('#modal-team2-score');
    if (s1) s1.value = match.team1.score !== null ? match.team1.score : 0;
    if (s2) s2.value = match.team2.score !== null ? match.team2.score : 0;

    // Penalty team names
    const pt1 = $('#penalty-team1-name');
    const pt2 = $('#penalty-team2-name');
    if (pt1) pt1.textContent = match.team1.playerName;
    if (pt2) pt2.textContent = match.team2.playerName;

    // Reset penalties section
    const penSection = $('#penalties-section');
    const penCheck = $('#penalties-check');
    const penInputs = $('#penalties-inputs');
    if (penSection) penSection.style.display = '';
    if (penCheck) penCheck.checked = match.penalties ? true : false;
    if (penInputs) penInputs.style.display = (match.penalties || (penCheck && penCheck.checked)) ? '' : 'none';

    const ps1 = $('#penalty-team1-score');
    const ps2 = $('#penalty-team2-score');
    if (ps1) ps1.value = match.penalties ? match.penalties.team1 : 0;
    if (ps2) ps2.value = match.penalties ? match.penalties.team2 : 0;

    // Date/time fields
    const dateInput = $('#modal-match-date');
    const timeInput = $('#modal-match-time');
    if (match.dateTime) {
      const parts = match.dateTime.split('T');
      if (dateInput) dateInput.value = parts[0] || '';
      if (timeInput) timeInput.value = parts[1] || '';
    } else {
      if (dateInput) dateInput.value = '';
      if (timeInput) timeInput.value = '';
    }

    // Modal title
    const title = $('#modal-title');
    if (title) title.textContent = 'Registrar Resultado';

    modal.style.display = 'flex';
  }

  /** Close the score modal */
  function closeScoreModal() {
    const modal = $('#score-modal');
    if (modal) modal.style.display = 'none';
    modalMatch = { roundIdx: -1, matchIdx: -1 };
  }

  /** Handle penalty checkbox toggle */
  function handlePenaltyToggle() {
    const penCheck = $('#penalties-check');
    const penInputs = $('#penalties-inputs');
    if (!penCheck || !penInputs) return;
    penInputs.style.display = penCheck.checked ? '' : 'none';
  }

  /** Auto-show penalties when scores are equal */
  function handleScoreChange() {
    const s1 = parseInt(($('#modal-team1-score') || {}).value, 10);
    const s2 = parseInt(($('#modal-team2-score') || {}).value, 10);

    if (!isNaN(s1) && !isNaN(s2) && s1 === s2) {
      const penSection = $('#penalties-section');
      const penCheck = $('#penalties-check');
      const penInputs = $('#penalties-inputs');
      if (penSection) penSection.style.display = '';
      if (penCheck) penCheck.checked = true;
      if (penInputs) penInputs.style.display = '';
    }
  }

  /** Confirm score and determine winner */
  function handleConfirmScore() {
    const rIdx = modalMatch.roundIdx;
    const mIdx = modalMatch.matchIdx;
    if (rIdx < 0 || mIdx < 0) return;

    const match = state.bracket.rounds[rIdx].matches[mIdx];
    if (!match) return;

    const score1 = parseInt(($('#modal-team1-score') || {}).value, 10);
    const score2 = parseInt(($('#modal-team2-score') || {}).value, 10);

    if (isNaN(score1) || isNaN(score2) || score1 < 0 || score2 < 0) {
      showToast('Insira placares válidos (números >= 0).', 'error');
      return;
    }

    let winnerNum = null;
    let penalties = null;

    if (score1 !== score2) {
      // Clear winner from regular score
      winnerNum = score1 > score2 ? 1 : 2;
    } else {
      // Draw: must have penalties
      const penCheck = $('#penalties-check');
      if (!penCheck || !penCheck.checked) {
        showToast('Empate! Marque os pênaltis para decidir o vencedor.', 'error');
        return;
      }

      const pen1 = parseInt(($('#penalty-team1-score') || {}).value, 10);
      const pen2 = parseInt(($('#penalty-team2-score') || {}).value, 10);

      if (isNaN(pen1) || isNaN(pen2) || pen1 < 0 || pen2 < 0) {
        showToast('Insira placares de pênaltis válidos.', 'error');
        return;
      }

      if (pen1 === pen2) {
        showToast('Pênaltis não podem terminar empatados.', 'error');
        return;
      }

      penalties = { team1: pen1, team2: pen2 };
      winnerNum = pen1 > pen2 ? 1 : 2;
    }

    // Save date/time
    const matchDateVal = ($('#modal-match-date') || {}).value || '';
    const matchTimeVal = ($('#modal-match-time') || {}).value || '';
    if (matchDateVal) {
      match.dateTime = matchDateVal + (matchTimeVal ? 'T' + matchTimeVal : '');
    }

    // Update match
    match.team1.score = score1;
    match.team2.score = score2;
    match.winner = winnerNum;
    match.penalties = penalties;

    // Advance winner to next round
    const winnerTeam = winnerNum === 1 ? match.team1 : match.team2;
    const totalRounds = state.bracket.rounds.length;

    if (rIdx < totalRounds - 1) {
      // Determine slot in next round
      const nextRound = state.bracket.rounds[rIdx + 1];
      const nextMatchIdx = Math.floor(mIdx / 2);
      const nextMatch = nextRound.matches[nextMatchIdx];

      if (nextMatch) {
        const slot = mIdx % 2 === 0 ? 'team1' : 'team2';
        nextMatch[slot] = makeTeamSlotData(winnerTeam);
      }
    }

    // Check if this was the final
    const isFinal = rIdx === totalRounds - 1;

    saveState();
    closeScoreModal();
    renderBracket();

    if (isFinal) {
      state.champion = {
        teamName: winnerTeam.teamName,
        playerName: winnerTeam.playerName
      };
      saveState();
      showChampionCelebration();
    } else {
      showToast('Resultado registrado!', 'success');
    }
  }

  /* ==========================================================
     14. CHAMPION CELEBRATION
     ========================================================== */

  let confettiAnimationId = null;

  /** Trigger the champion celebration */
  function showChampionCelebration() {
    if (!state.champion) return;

    const banner = $('#champion-banner');
    const nameEl = $('#champion-team-name');
    if (banner) {
      banner.style.display = 'flex';
    }
    if (nameEl) {
      nameEl.textContent = state.champion.playerName;
    }

    startConfetti();
    showToast(`Campeão: ${state.champion.playerName}!`, 'success');
  }

  /** Show champion banner if champion exists (on page load) */
  function renderChampionBannerIfNeeded() {
    /* Don't auto-show banner on reload; user can see it in bracket */
  }

  /** Close champion banner */
  function closeChampionBanner() {
    const banner = $('#champion-banner');
    if (banner) banner.style.display = 'none';
    stopConfetti();
  }

  /* ==========================================================
     15. CONFETTI ANIMATION
     ========================================================== */

  /** Start confetti particle animation */
  function startConfetti() {
    const canvas = $('#confetti-canvas');
    if (!canvas) return;

    canvas.style.display = 'block';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');
    const colors = ['#FFD700', '#34c759', '#007aff', '#ff3b30', '#ffffff', '#ff9500', '#af8a2e'];
    const particles = [];
    const PARTICLE_COUNT = 200;
    const DURATION = 5000;
    const startTime = Date.now();

    // Create particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w: Math.random() * 8 + 4,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 4 + 2,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        shape: Math.random() > 0.5 ? 'rect' : 'circle'
      });
    }

    function animate() {
      const elapsed = Date.now() - startTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fade out in the last second
      const opacity = elapsed > DURATION - 1000
        ? Math.max(0, 1 - (elapsed - (DURATION - 1000)) / 1000)
        : 1;

      ctx.globalAlpha = opacity;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        // Wrap horizontally
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.x < -20) p.x = canvas.width + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      ctx.globalAlpha = 1;

      if (elapsed < DURATION) {
        confettiAnimationId = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = 'none';
        confettiAnimationId = null;
      }
    }

    confettiAnimationId = requestAnimationFrame(animate);
  }

  /** Stop confetti animation */
  function stopConfetti() {
    if (confettiAnimationId) {
      cancelAnimationFrame(confettiAnimationId);
      confettiAnimationId = null;
    }
    const canvas = $('#confetti-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.display = 'none';
    }
  }

  /* ==========================================================
     16. TOURNAMENT RESET
     ========================================================== */

  /** Reset tournament (bracket + champion only, keep teams) */
  function handleReset() {
    if (!confirm('Tem certeza que deseja resetar o torneio? O chaveamento e resultados serão apagados.')) {
      return;
    }

    state.bracket = null;
    state.champion = null;
    saveState();

    closeChampionBanner();
    renderBracket();
    renderTeamList();
    showToast('Torneio resetado com sucesso.', 'info');
  }

  /* ==========================================================
     16b. MOBILE SIDEBAR
     ========================================================== */

  /** Toggle mobile sidebar */
  function toggleMobileSidebar() {
    const sidebar = $('#admin-sidebar');
    const overlay = $('#sidebar-overlay');
    if (!sidebar) return;
    const isOpen = sidebar.classList.contains('sidebar-open');
    if (isOpen) {
      sidebar.classList.remove('sidebar-open');
      if (overlay) overlay.classList.remove('active');
      document.body.classList.remove('sidebar-is-open');
    } else {
      sidebar.classList.add('sidebar-open');
      if (overlay) overlay.classList.add('active');
      document.body.classList.add('sidebar-is-open');
    }
  }

  /** Close mobile sidebar */
  function closeMobileSidebar() {
    const sidebar = $('#admin-sidebar');
    const overlay = $('#sidebar-overlay');
    if (sidebar) sidebar.classList.remove('sidebar-open');
    if (overlay) overlay.classList.remove('active');
    document.body.classList.remove('sidebar-is-open');
  }

  /* ==========================================================
     16c. CLIENT / PLAYER STATS MANAGEMENT
     ========================================================== */

  /** Populate the client select dropdown with team players */
  function populateClientSelect() {
    const select = $('#client-select');
    if (!select) return;

    const currentVal = select.value;
    select.innerHTML = '<option value="">-- Selecione --</option>';

    state.teams.forEach((team) => {
      const option = document.createElement('option');
      option.value = team.id;
      option.textContent = team.playerName + ' (' + team.teamName + ')';
      select.appendChild(option);
    });

    // Restore previous selection if still valid
    if (currentVal && state.teams.some(t => t.id === currentVal)) {
      select.value = currentVal;
    }
  }

  /** Handle client select change */
  function handleClientSelect() {
    const select = $('#client-select');
    const fields = $('#client-fields');
    if (!select || !fields) return;

    const teamId = select.value;
    if (!teamId) {
      fields.style.display = 'none';
      return;
    }

    fields.style.display = '';

    // Load existing stats
    const stats = (state.playerStats && state.playerStats[teamId]) || {};
    const igInput = $('#client-instagram');
    const trInput = $('#client-trophies');
    const fiInput = $('#client-finals');
    const sfInput = $('#client-semifinals');
    if (igInput) igInput.value = stats.instagram || '';
    if (trInput) trInput.value = stats.trophies || 0;
    if (fiInput) fiInput.value = stats.finals || 0;
    if (sfInput) sfInput.value = stats.semifinals || 0;
  }

  /** Save client stats */
  function handleSaveClient() {
    const select = $('#client-select');
    if (!select || !select.value) {
      showToast('Selecione um jogador primeiro.', 'error');
      return;
    }

    const teamId = select.value;
    if (!state.playerStats) state.playerStats = {};

    state.playerStats[teamId] = {
      instagram: ($('#client-instagram') || {}).value || '',
      trophies: parseInt(($('#client-trophies') || {}).value, 10) || 0,
      finals: parseInt(($('#client-finals') || {}).value, 10) || 0,
      semifinals: parseInt(($('#client-semifinals') || {}).value, 10) || 0
    };

    saveState();
    renderTop3();
    showToast('Dados do jogador salvos!', 'success');
  }

  /* ==========================================================
     16d. PLAYER PROFILE MODAL
     ========================================================== */

  /** Open player profile modal */
  function openPlayerProfile(teamId) {
    const team = state.teams.find(t => t.id === teamId);
    if (!team) return;

    const stats = (state.playerStats && state.playerStats[teamId]) || {};
    const modal = $('#player-profile-modal');
    if (!modal) return;

    // Avatar
    const avatarEl = $('#profile-avatar');
    if (avatarEl) {
      if (team.photo) {
        avatarEl.innerHTML = '<img src="' + sanitize(team.photo) + '" alt="' + sanitize(team.playerName) + '">';
      } else {
        avatarEl.textContent = initials(team.playerName);
      }
    }

    // Names
    const playerNameEl = $('#profile-player-name');
    const teamNameEl = $('#profile-team-name');
    if (playerNameEl) playerNameEl.textContent = team.playerName;
    if (teamNameEl) teamNameEl.textContent = team.teamName;

    // Instagram
    const igLink = $('#profile-instagram');
    const igText = $('#profile-instagram-text');
    if (igLink && igText) {
      if (stats.instagram) {
        const handle = stats.instagram.replace(/^@/, '');
        igLink.href = 'https://instagram.com/' + encodeURIComponent(handle);
        igText.textContent = '@' + handle;
        igLink.style.display = '';
      } else {
        igLink.style.display = 'none';
      }
    }

    // Stats
    const trEl = $('#profile-trophies');
    const fiEl = $('#profile-finals');
    const sfEl = $('#profile-semifinals');
    if (trEl) trEl.textContent = stats.trophies || 0;
    if (fiEl) fiEl.textContent = stats.finals || 0;
    if (sfEl) sfEl.textContent = stats.semifinals || 0;

    modal.style.display = 'flex';
  }

  /** Close player profile modal */
  function closePlayerProfile() {
    const modal = $('#player-profile-modal');
    if (modal) modal.style.display = 'none';
  }

  /* ==========================================================
     16e. TOP 3 RENDERING
     ========================================================== */

  /** Render the Top 3 players card */
  function renderTop3() {
    const card = $('#top3-card');
    const list = $('#top3-list');
    if (!card || !list) return;

    if (!state.playerStats || !state.teams || state.teams.length === 0) {
      card.style.display = 'none';
      return;
    }

    // Build ranked list by trophies, then finals, then semifinals
    const ranked = state.teams
      .map(t => {
        const stats = state.playerStats[t.id] || {};
        return {
          team: t,
          trophies: stats.trophies || 0,
          finals: stats.finals || 0,
          semifinals: stats.semifinals || 0
        };
      })
      .filter(r => r.trophies > 0 || r.finals > 0 || r.semifinals > 0)
      .sort((a, b) => {
        if (b.trophies !== a.trophies) return b.trophies - a.trophies;
        if (b.finals !== a.finals) return b.finals - a.finals;
        return b.semifinals - a.semifinals;
      })
      .slice(0, 3);

    if (ranked.length === 0) {
      card.style.display = 'none';
      return;
    }

    card.style.display = '';
    const posColors = ['gold', 'silver', 'bronze'];
    const posLabels = ['1º', '2º', '3º'];

    let html = '';
    ranked.forEach((r, i) => {
      const avatar = r.team.photo
        ? '<img src="' + sanitize(r.team.photo) + '" alt="' + sanitize(r.team.playerName) + '">'
        : '<span class="av-placeholder top3-av-placeholder">' + sanitize(initials(r.team.playerName)) + '</span>';

      html += `
        <li class="top3-item" data-team-id="${sanitize(r.team.id)}">
          <span class="top3-position ${posColors[i]}">${posLabels[i]}</span>
          <div class="top3-avatar">${avatar}</div>
          <span class="top3-name">${sanitize(r.team.playerName)}</span>
          <span class="top3-trophies">${r.trophies} troféu${r.trophies !== 1 ? 's' : ''}</span>
        </li>`;
    });

    list.innerHTML = html;

    // Click handlers for top 3 items
    list.querySelectorAll('.top3-item').forEach(item => {
      item.addEventListener('click', () => {
        openPlayerProfile(item.dataset.teamId);
      });
    });
  }

  /* ==========================================================
     17. EVENT LISTENERS
     ========================================================== */

  /** Set up all event listeners */
  function setupEventListeners() {
    // Login form toggle
    const btnShowLogin = $('#btn-show-login');
    if (btnShowLogin) {
      btnShowLogin.addEventListener('click', toggleLoginForm);
    }

    // Login form submit
    const loginForm = $('#login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
    }

    // Visitor button
    const btnVisitor = $('#btn-visitor');
    if (btnVisitor) {
      btnVisitor.addEventListener('click', handleVisitor);
    }

    // Logout button
    const btnLogout = $('#btn-logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', handleLogout);
    }

    // Add team button
    const btnAddTeam = $('#btn-add-team');
    if (btnAddTeam) {
      btnAddTeam.addEventListener('click', handleAddTeam);
    }

    // Enter key in team/player inputs
    const teamInput = $('#team-name-input');
    const playerInput = $('#player-name-input');
    [teamInput, playerInput].forEach((input) => {
      if (input) {
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTeam();
          }
        });
      }
    });

    // Save prize
    const btnSavePrize = $('#btn-save-prize');
    if (btnSavePrize) {
      btnSavePrize.addEventListener('click', handleSavePrize);
    }

    // Generate bracket
    const btnGenerate = $('#btn-generate');
    if (btnGenerate) {
      btnGenerate.addEventListener('click', handleGenerate);
    }

    // Reset tournament
    const btnReset = $('#btn-reset');
    if (btnReset) {
      btnReset.addEventListener('click', handleReset);
    }

    // Score modal: confirm
    const btnConfirm = $('#btn-confirm-score');
    if (btnConfirm) {
      btnConfirm.addEventListener('click', handleConfirmScore);
    }

    // Score modal: cancel
    const btnCancel = $('#btn-cancel-modal');
    if (btnCancel) {
      btnCancel.addEventListener('click', closeScoreModal);
    }

    // Score modal: backdrop click
    const backdrop = $('.modal-backdrop[data-dismiss="modal"]');
    if (backdrop) {
      backdrop.addEventListener('click', closeScoreModal);
    }

    // Penalties checkbox
    const penCheck = $('#penalties-check');
    if (penCheck) {
      penCheck.addEventListener('change', handlePenaltyToggle);
    }

    // Score inputs: auto-detect draw
    const s1Input = $('#modal-team1-score');
    const s2Input = $('#modal-team2-score');
    [s1Input, s2Input].forEach((input) => {
      if (input) {
        input.addEventListener('input', handleScoreChange);
      }
    });

    // Champion banner close
    const btnCloseChamp = $('#btn-close-champion');
    if (btnCloseChamp) {
      btnCloseChamp.addEventListener('click', closeChampionBanner);
    }

    // Tournament name: save on blur/change
    const tournamentNameInput = $('#tournament-name');
    if (tournamentNameInput) {
      tournamentNameInput.addEventListener('blur', syncTournamentName);
      tournamentNameInput.addEventListener('change', syncTournamentName);
    }

    // Team count select: save on change
    const teamCountSelect = $('#team-count');
    if (teamCountSelect) {
      teamCountSelect.addEventListener('change', () => {
        state.teamCount = parseInt(teamCountSelect.value, 10);
        saveState();
        renderTeamList();
      });
    }

    // Mobile menu toggle
    const btnMobileMenu = $('#btn-mobile-menu');
    if (btnMobileMenu) {
      btnMobileMenu.addEventListener('click', toggleMobileSidebar);
    }

    // Sidebar overlay click
    const sidebarOverlay = $('#sidebar-overlay');
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', closeMobileSidebar);
    }

    // Random team name generator
    const btnRandomName = $('#btn-random-name');
    if (btnRandomName) {
      btnRandomName.addEventListener('click', () => {
        const nameInput = $('#team-name-input');
        if (nameInput) {
          nameInput.value = generateRandomTeamName();
          nameInput.focus();
        }
      });
    }

    // Handle window resize for confetti canvas
    window.addEventListener('resize', () => {
      const canvas = $('#confetti-canvas');
      if (canvas && canvas.style.display !== 'none') {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    });

    // Game selection buttons
    const btnGameFifa = $('#btn-game-fifa');
    if (btnGameFifa) {
      btnGameFifa.addEventListener('click', handleGameFifa);
    }

    const btnGameBack = $('#btn-game-back');
    if (btnGameBack) {
      btnGameBack.addEventListener('click', handleGameBack);
    }

    // Client management
    const clientSelect = $('#client-select');
    if (clientSelect) {
      clientSelect.addEventListener('change', handleClientSelect);
    }

    const btnSaveClient = $('#btn-save-client');
    if (btnSaveClient) {
      btnSaveClient.addEventListener('click', handleSaveClient);
    }

    // Player profile modal close
    const btnCloseProfile = $('#btn-close-profile');
    if (btnCloseProfile) {
      btnCloseProfile.addEventListener('click', closePlayerProfile);
    }

    // Player profile modal backdrop
    const profileBackdrop = $('.modal-backdrop[data-dismiss="profile-modal"]');
    if (profileBackdrop) {
      profileBackdrop.addEventListener('click', closePlayerProfile);
    }

    // Re-populate client select when teams change
    const teamCountSelectForClients = $('#team-count');
    if (teamCountSelectForClients) {
      teamCountSelectForClients.addEventListener('change', () => {
        populateClientSelect();
      });
    }
  }

  /* ==========================================================
     18. INITIALIZATION
     ========================================================== */

  /** Main initialization function */
  function init() {
    // 1. Load persisted state
    loadState();

    // 2. Set up event listeners
    setupEventListeners();

    // 3. Listen for Firebase auth state changes (if available)
    if (firebaseAvailable && auth) {
      auth.onAuthStateChanged((user) => {
        currentUser = user;
        if (user) {
          // User is signed in: show as admin
          showMainApp(true);
        } else {
          // Not signed in: only show login if we haven't already entered as visitor
          const mainApp = document.getElementById('main-app');
          if (!mainApp || mainApp.style.display === 'none') {
            showLoginScreen();
          }
        }
      });
    }

    // 4. Check for remembered choice
    try {
      const remembered = localStorage.getItem(REMEMBER_KEY);
      if (remembered === 'visitor') {
        isAdmin = false;
        currentUser = null;
        showGameSelection();
        return;
      }
    } catch (_) { /* ignore */ }

    // 5. Default: show login screen (auth callback above may override)
    showLoginScreen();
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
