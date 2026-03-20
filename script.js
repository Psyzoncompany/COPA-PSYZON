/* ======================================================
   COPA PSYZON — Script Principal
   Gerenciamento de Torneio Eliminatório (Mata-Mata)
   ====================================================== */

(function () {
  'use strict';

  // ——— Estado Global ———
  let state = {
    tournamentName: '',
    teams: [],           // { id, name, img }
    rounds: [],          // [ [ {id, team1, team2, score1, score2, winner, date, time} ] ]
    started: false,
    champion: null
  };

  const LS_KEY = 'copa_psyzon_state';

  // ——— Seleções (Seleções Nacionais) ———
  const SELECOES = [
    { code: '', name: 'Sem seleção', flag: '' },
    { code: 'BR', name: 'Brasil', flag: '🇧🇷' },
    { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
    { code: 'DE', name: 'Alemanha', flag: '🇩🇪' },
    { code: 'FR', name: 'França', flag: '🇫🇷' },
    { code: 'ES', name: 'Espanha', flag: '🇪🇸' },
    { code: 'IT', name: 'Itália', flag: '🇮🇹' },
    { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
    { code: 'GB-ENG', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { code: 'NL', name: 'Holanda', flag: '🇳🇱' },
    { code: 'BE', name: 'Bélgica', flag: '🇧🇪' },
    { code: 'UY', name: 'Uruguai', flag: '🇺🇾' },
    { code: 'CO', name: 'Colômbia', flag: '🇨🇴' },
    { code: 'MX', name: 'México', flag: '🇲🇽' },
    { code: 'JP', name: 'Japão', flag: '🇯🇵' },
    { code: 'KR', name: 'Coreia do Sul', flag: '🇰🇷' },
    { code: 'US', name: 'EUA', flag: '🇺🇸' },
    { code: 'HR', name: 'Croácia', flag: '🇭🇷' },
    { code: 'MA', name: 'Marrocos', flag: '🇲🇦' },
    { code: 'SN', name: 'Senegal', flag: '🇸🇳' },
    { code: 'AU', name: 'Austrália', flag: '🇦🇺' },
    { code: 'CL', name: 'Chile', flag: '🇨🇱' },
    { code: 'PE', name: 'Peru', flag: '🇵🇪' },
    { code: 'EC', name: 'Equador', flag: '🇪🇨' },
    { code: 'PY', name: 'Paraguai', flag: '🇵🇾' },
    { code: 'NG', name: 'Nigéria', flag: '🇳🇬' },
    { code: 'GH', name: 'Gana', flag: '🇬🇭' },
    { code: 'CM', name: 'Camarões', flag: '🇨🇲' },
    { code: 'DZ', name: 'Argélia', flag: '🇩🇿' },
    { code: 'EG', name: 'Egito', flag: '🇪🇬' },
    { code: 'TR', name: 'Turquia', flag: '🇹🇷' },
    { code: 'PL', name: 'Polônia', flag: '🇵🇱' },
    { code: 'SE', name: 'Suécia', flag: '🇸🇪' },
    { code: 'DK', name: 'Dinamarca', flag: '🇩🇰' },
    { code: 'CH', name: 'Suíça', flag: '🇨🇭' },
    { code: 'AT', name: 'Áustria', flag: '🇦🇹' },
    { code: 'RS', name: 'Sérvia', flag: '🇷🇸' },
    { code: 'SA', name: 'Arábia Saudita', flag: '🇸🇦' },
    { code: 'QA', name: 'Catar', flag: '🇶🇦' },
    { code: 'CR', name: 'Costa Rica', flag: '🇨🇷' },
  ];

  function getFlag(code) {
    if (!code) return '';
    const s = SELECOES.find(s => s.code === code);
    return s ? s.flag : '';
  }

  // ——— Seleção de Elementos ———
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const elTournamentName = $('#tournament-name');
  const elTeamCount = $('#team-count');
  const elTeamList = $('#team-list');
  const elBtnGenerate = $('#btn-generate');
  const elBtnShuffle = $('#btn-shuffle');
  const elBtnReset = $('#btn-reset');
  const elBracketArea = $('#bracket-area');
  const elTournamentTitle = $('#tournament-title-display');
  const elTournamentStatus = $('#tournament-status');
  const elChampionBanner = $('#champion-banner');
  const elEmptyState = $('#empty-state');
  const elToastContainer = $('#toast-container');
  const elModalOverlay = $('#modal-overlay');
  const elPlayerDragZone = $('#player-drag-zone');
  const elDragPool = $('#drag-pool');
  const elDragSlots = $('#drag-slots');
  const elBtnConfirmDrag = $('#btn-confirm-drag');

  // ——— Inicialização ———
  function init() {
    loadState();
    bindEvents();
    renderTeamInputs();
    if (state.started) {
      renderBracket();
    }
  }

  // ——— Persistência ———
  function saveState() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch (e) { /* silently fail */ }
  }

  function loadState() {
    try {
      const data = localStorage.getItem(LS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed && parsed.teams) {
          state = parsed;
          elTournamentName.value = state.tournamentName || '';
          elTeamCount.value = state.teams.length || 8;
        }
      }
    } catch (e) { /* silently fail */ }
  }

  // ——— Eventos ———
  function bindEvents() {
    elTeamCount.addEventListener('change', renderTeamInputs);
    elBtnGenerate.addEventListener('click', generateTournament);
    elBtnShuffle.addEventListener('click', shuffleTeams);
    elBtnReset.addEventListener('click', resetTournament);
    elModalOverlay.addEventListener('click', (e) => {
      if (e.target === elModalOverlay) closeModal();
    });
    if (elBtnConfirmDrag) {
      elBtnConfirmDrag.addEventListener('click', confirmDragOrder);
    }
  }

  // ——— Toast ———
  function toast(msg, type = 'info') {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = msg;
    elToastContainer.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }

  // ——— Render Team Inputs ———
  function renderTeamInputs() {
    const count = parseInt(elTeamCount.value) || 8;

    // Preserve existing team data
    const existing = [];
    if (state.teams.length && !state.started) {
      state.teams.forEach(t => existing.push({ ...t }));
    }

    if (!state.started) {
      state.teams = [];
      for (let i = 0; i < count; i++) {
        state.teams.push({
          id: i,
          name: existing[i] ? existing[i].name : '',
          img: existing[i] ? existing[i].img : '',
          country: existing[i] ? existing[i].country || '' : ''
        });
      }
    }

    elTeamList.innerHTML = '';
    state.teams.forEach((team, idx) => {
      const entry = document.createElement('div');
      entry.className = 'team-entry';
      entry.draggable = !state.started;
      entry.dataset.index = idx;

      const countryOpts = SELECOES.map(s =>
        `<option value="${s.code}" ${team.country === s.code ? 'selected' : ''}>${s.flag} ${s.name}</option>`
      ).join('');

      entry.innerHTML = `
        <span class="team-num">${idx + 1}</span>
        <div class="team-img-wrapper" title="Clique para adicionar imagem">
          ${team.img
            ? `<img src="${sanitizeDataUrl(team.img)}" alt="">`
            : '<span class="img-placeholder">IMG</span>'}
        </div>
        <input type="text" placeholder="Nome do time ${idx + 1}" value="${escapeHtml(team.name)}" ${state.started ? 'disabled' : ''}>
        <select class="country-select" ${state.started ? 'disabled' : ''}>${countryOpts}</select>
        ${!state.started ? '<button class="remove-team" title="Remover">&times;</button>' : ''}
      `;

      // Name input
      const nameInput = $('input[type="text"]', entry);
      nameInput.addEventListener('input', () => {
        state.teams[idx].name = nameInput.value.trim();
        saveState();
      });

      // Country select
      const countrySelect = $('.country-select', entry);
      if (countrySelect) {
        countrySelect.addEventListener('change', () => {
          state.teams[idx].country = countrySelect.value;
          saveState();
        });
      }

      // Image click
      const imgWrapper = $('.team-img-wrapper', entry);
      if (!state.started) {
        imgWrapper.addEventListener('click', () => pickImage(idx));
      }

      // Remove button
      const removeBtn = $('.remove-team', entry);
      if (removeBtn) {
        removeBtn.addEventListener('click', () => {
          state.teams.splice(idx, 1);
          // Re-index
          state.teams.forEach((t, i) => t.id = i);
          elTeamCount.value = state.teams.length;
          renderTeamInputs();
          saveState();
        });
      }

      // Drag & Drop reorder
      if (!state.started) {
        entry.addEventListener('dragstart', handleTeamDragStart);
        entry.addEventListener('dragover', handleTeamDragOver);
        entry.addEventListener('drop', handleTeamDrop);
        entry.addEventListener('dragend', handleTeamDragEnd);
      }

      elTeamList.appendChild(entry);
    });

    saveState();
  }

  // ——— Image Picker ———
  function pickImage(teamIdx) {
    if (state.started) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', () => {
      const file = input.files[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
        toast('Imagem muito grande (máx 2MB)', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        state.teams[teamIdx].img = e.target.result;
        saveState();
        renderTeamInputs();
      };
      reader.readAsDataURL(file);
    });
    input.click();
  }

  function sanitizeDataUrl(url) {
    if (!url) return '';
    if (url.startsWith('data:image/')) return url;
    return '';
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  // ——— Team Drag Reorder ———
  let dragSrcIndex = null;

  function handleTeamDragStart(e) {
    dragSrcIndex = parseInt(this.dataset.index);
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleTeamDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
  }

  function handleTeamDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    const targetIndex = parseInt(this.dataset.index);
    if (dragSrcIndex === null || dragSrcIndex === targetIndex) return;

    const moved = state.teams.splice(dragSrcIndex, 1)[0];
    state.teams.splice(targetIndex, 0, moved);
    state.teams.forEach((t, i) => t.id = i);
    renderTeamInputs();
    saveState();
  }

  function handleTeamDragEnd() {
    $$('.team-entry').forEach(el => el.classList.remove('dragging', 'drag-over'));
    dragSrcIndex = null;
  }

  // ——— Shuffle Teams ———
  function shuffleTeams() {
    if (state.started) return;
    for (let i = state.teams.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [state.teams[i], state.teams[j]] = [state.teams[j], state.teams[i]];
    }
    state.teams.forEach((t, i) => t.id = i);
    renderTeamInputs();
    saveState();
    toast('Times embaralhados!', 'success');
  }

  // ——— Validate Before Generate ———
  function validateTeams() {
    const count = state.teams.length;
    if (count < 2) {
      toast('Mínimo de 2 times!', 'error');
      return false;
    }
    // Must be power of 2
    if ((count & (count - 1)) !== 0) {
      toast('Quantidade de times deve ser potência de 2 (2, 4, 8, 16, 32...)', 'error');
      return false;
    }
    // All teams must have names
    for (const t of state.teams) {
      if (!t.name) {
        toast('Todos os times precisam de nome!', 'error');
        return false;
      }
    }
    // No duplicate names
    const names = state.teams.map(t => t.name.toLowerCase());
    const unique = new Set(names);
    if (unique.size !== names.length) {
      toast('Nomes de times duplicados!', 'error');
      return false;
    }
    return true;
  }

  // ——— Generate Tournament ———
  function generateTournament() {
    state.tournamentName = elTournamentName.value.trim() || 'COPA PSYZON';
    if (!validateTeams()) return;

    // Show drag zone for ordering
    showDragZone();
  }

  // ——— Drag Zone for Initial Placement ———
  function showDragZone() {
    elPlayerDragZone.classList.add('show');
    elDragPool.innerHTML = '';
    elDragSlots.innerHTML = '';

    const shuffled = [...state.teams];
    // Shuffle for random initial pool order
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    shuffled.forEach(team => {
      const chip = createDragChip(team);
      elDragPool.appendChild(chip);
    });

    for (let i = 0; i < state.teams.length; i++) {
      const slot = document.createElement('div');
      slot.className = 'drag-slot';
      slot.dataset.slotIndex = i;
      slot.textContent = `Posição ${i + 1}`;

      slot.addEventListener('dragover', (e) => {
        e.preventDefault();
        slot.classList.add('drag-hover');
      });
      slot.addEventListener('dragleave', () => slot.classList.remove('drag-hover'));
      slot.addEventListener('drop', (e) => {
        e.preventDefault();
        slot.classList.remove('drag-hover');
        const teamId = parseInt(e.dataTransfer.getData('text/plain'));
        placeTeamInSlot(teamId, slot);
      });

      elDragSlots.appendChild(slot);
    }

    elBracketArea.scrollTo({ top: 0, behavior: 'smooth' });
    toast('Arraste os times para as posições desejadas, ou confirme para posições aleatórias!', 'info');
  }

  function createDragChip(team) {
    const chip = document.createElement('div');
    chip.className = 'drag-player';
    chip.draggable = true;
    chip.dataset.teamId = team.id;
    chip.innerHTML = `
      <div class="dp-avatar">
        ${team.img ? `<img src="${sanitizeDataUrl(team.img)}" alt="">` : ''}
      </div>
      ${team.country ? `<span class="dp-flag">${getFlag(team.country)}</span>` : ''}
      <span>${escapeHtml(team.name)}</span>
    `;
    chip.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', String(team.id));
      chip.classList.add('dragging');
    });
    chip.addEventListener('dragend', () => chip.classList.remove('dragging'));
    return chip;
  }

  function placeTeamInSlot(teamId, slot) {
    // If slot already filled, return chip to pool
    if (slot.dataset.filledTeamId !== undefined && slot.dataset.filledTeamId !== '') {
      const oldId = parseInt(slot.dataset.filledTeamId);
      const oldTeam = state.teams.find(t => t.id === oldId);
      if (oldTeam) {
        elDragPool.appendChild(createDragChip(oldTeam));
      }
    }

    // Remove chip from pool
    const chip = $(`.drag-player[data-team-id="${teamId}"]`, elDragPool);
    if (chip) chip.remove();
    // Also remove from other slots
    $$('.drag-slot').forEach(s => {
      if (s.dataset.filledTeamId === String(teamId)) {
        const idx = s.dataset.slotIndex;
        s.textContent = `Posição ${parseInt(idx) + 1}`;
        s.classList.remove('filled');
        delete s.dataset.filledTeamId;
      }
    });

    const team = state.teams.find(t => t.id === teamId);
    if (!team) return;

    slot.innerHTML = '';
    slot.classList.add('filled');
    slot.dataset.filledTeamId = teamId;

    const miniChip = document.createElement('div');
    miniChip.className = 'drag-player';
    miniChip.style.cursor = 'default';
    miniChip.innerHTML = `
      <div class="dp-avatar">
        ${team.img ? `<img src="${sanitizeDataUrl(team.img)}" alt="">` : ''}
      </div>
      ${team.country ? `<span class="dp-flag">${getFlag(team.country)}</span>` : ''}
      <span>${escapeHtml(team.name)}</span>
    `;
    slot.appendChild(miniChip);
  }

  function confirmDragOrder() {
    const slots = $$('.drag-slot');
    const orderedIds = [];
    let allFilled = true;

    slots.forEach(s => {
      if (s.dataset.filledTeamId !== undefined && s.dataset.filledTeamId !== '') {
        orderedIds.push(parseInt(s.dataset.filledTeamId));
      } else {
        allFilled = false;
      }
    });

    // If not all filled, auto-fill remaining
    if (!allFilled) {
      const placed = new Set(orderedIds);
      const remaining = state.teams.filter(t => !placed.has(t.id));
      // Shuffle remaining
      for (let i = remaining.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
      }
      let rIdx = 0;
      const finalOrder = [];
      slots.forEach(s => {
        if (s.dataset.filledTeamId !== undefined && s.dataset.filledTeamId !== '') {
          finalOrder.push(parseInt(s.dataset.filledTeamId));
        } else {
          finalOrder.push(remaining[rIdx].id);
          rIdx++;
        }
      });
      startTournament(finalOrder);
    } else {
      startTournament(orderedIds);
    }

    elPlayerDragZone.classList.remove('show');
  }

  // ——— Start Tournament with given order ———
  function startTournament(orderedIds) {
    const orderedTeams = orderedIds.map(id => state.teams.find(t => t.id === id));
    state.teams = orderedTeams.map((t, i) => ({ ...t, id: i }));
    state.started = true;
    state.champion = null;
    state.rounds = [];

    // Build first round matches
    const firstRound = [];
    for (let i = 0; i < state.teams.length; i += 2) {
      firstRound.push({
        id: `R1M${i / 2 + 1}`,
        team1: state.teams[i],
        team2: state.teams[i + 1],
        score1: null,
        score2: null,
        winner: null,
        date: '',
        time: ''
      });
    }
    state.rounds.push(firstRound);

    // Build placeholder rounds
    let matchCount = firstRound.length / 2;
    let roundNum = 2;
    while (matchCount >= 1) {
      const round = [];
      for (let i = 0; i < matchCount; i++) {
        round.push({
          id: `R${roundNum}M${i + 1}`,
          team1: null,
          team2: null,
          score1: null,
          score2: null,
          winner: null,
          date: '',
          time: ''
        });
      }
      state.rounds.push(round);
      matchCount = matchCount / 2;
      roundNum++;
    }

    saveState();
    renderTeamInputs();
    renderBracket();
    toast('Torneio gerado com sucesso!', 'success');
  }

  // ——— Round Names ———
  // SVG icon helper — returns inline SVG HTML using the sprite
  function svgIcon(id, cls = 'icon') {
    return `<svg class="${cls}"><use href="#ico-${id}"/></svg>`;
  }

  function getRoundName(roundIdx, totalRounds) {
    const remaining = totalRounds - roundIdx;
    if (remaining === 1) return 'FINAL';
    if (remaining === 2) return 'SEMIFINAL';
    if (remaining === 3) return 'QUARTAS';
    if (remaining === 4) return 'OITAVAS';
    if (remaining === 5) return '16 AVOS';
    return `RODADA ${roundIdx + 1}`;
  }

  function getRoundIcon(roundIdx, totalRounds) {
    const remaining = totalRounds - roundIdx;
    if (remaining === 1) return 'trophy';
    return 'ball';
  }

  // ——— Render Bracket ———
  function renderBracket() {
    if (!state.started || !state.rounds.length) {
      elBracketArea.innerHTML = '';
      elBracketArea.appendChild(createEmptyState());
      elEmptyState && (elEmptyState.style.display = '');
      elChampionBanner.classList.remove('show');
      elTournamentTitle.textContent = '';
      elTournamentStatus.textContent = '';
      return;
    }

    elTournamentTitle.textContent = state.tournamentName;
    updateStatus();

    const bracket = document.createElement('div');
    bracket.className = 'bracket';

    const totalRounds = state.rounds.length;
    const firstRoundMatches = state.rounds[0].length;

    state.rounds.forEach((round, rIdx) => {
      const roundDiv = document.createElement('div');
      roundDiv.className = 'round';

      const title = document.createElement('div');
      title.className = 'round-title';
      title.innerHTML = svgIcon(getRoundIcon(rIdx, totalRounds)) + ' ' + getRoundName(rIdx, totalRounds);
      roundDiv.appendChild(title);

      const matchesDiv = document.createElement('div');
      matchesDiv.className = 'round-matches';

      // Calculate spacing - matches should be vertically centered between feeder matches
      const matchHeight = 120;
      const baseGap = 12;
      const spacer = rIdx === 0 ? 0 : (Math.pow(2, rIdx) - 1) * (matchHeight + baseGap) / 2;

      matchesDiv.style.paddingTop = spacer + 'px';
      matchesDiv.style.gap = (rIdx === 0 ? baseGap : (Math.pow(2, rIdx) * (matchHeight + baseGap) - matchHeight)) + 'px';

      round.forEach((match, mIdx) => {
        const card = createMatchCard(match, rIdx, mIdx);
        matchesDiv.appendChild(card);
      });

      roundDiv.appendChild(matchesDiv);
      bracket.appendChild(roundDiv);

      // Connector column
      if (rIdx < totalRounds - 1) {
        const connCol = document.createElement('div');
        connCol.className = 'round connector-col';
        connCol.style.minWidth = '30px';
        connCol.style.display = 'flex';
        connCol.style.alignItems = 'stretch';

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '30');
        svg.style.overflow = 'visible';
        svg.style.flex = '1';
        connCol.appendChild(svg);
        bracket.appendChild(connCol);
      }
    });

    elBracketArea.innerHTML = '';
    elBracketArea.appendChild(bracket);

    // Draw SVG connectors after DOM layout
    requestAnimationFrame(() => drawConnectors());

    // Champion
    if (state.champion) {
      showChampion(state.champion);
    } else {
      elChampionBanner.classList.remove('show');
    }
  }

  // ——— Create Match Card ———
  function createMatchCard(match, roundIdx, matchIdx) {
    const card = document.createElement('div');
    card.className = 'match-card';
    card.dataset.round = roundIdx;
    card.dataset.match = matchIdx;

    // Header
    const header = document.createElement('div');
    header.className = 'match-header';
    header.innerHTML = `
      <span class="match-id">${match.id}</span>
      <span class="match-schedule" title="Definir data/hora">${svgIcon('calendar', 'icon-btn')} ${formatSchedule(match)}</span>
    `;
    $('.match-schedule', header).addEventListener('click', () => openScheduleModal(roundIdx, matchIdx));
    card.appendChild(header);

    // Team rows
    [1, 2].forEach(num => {
      const team = match[`team${num}`];
      const score = match[`score${num}`];
      const isWinner = match.winner && team && match.winner.id === team.id;
      const isLoser = match.winner && team && match.winner.id !== team.id;

      const row = document.createElement('div');
      row.className = 'match-team' + (isWinner ? ' winner' : '') + (isLoser ? ' loser' : '');

      if (team) {
        row.innerHTML = `
          <div class="team-avatar">
            ${team.img ? `<img src="${sanitizeDataUrl(team.img)}" alt="">` : `<span class="av-placeholder">${team.name.substring(0, 2).toUpperCase()}</span>`}
          </div>
          ${team.country ? `<span class="team-flag">${getFlag(team.country)}</span>` : ''}
          <span class="team-name-bracket">${escapeHtml(team.name)}</span>
        `;

        if (!match.winner) {
          const scoreInput = document.createElement('input');
          scoreInput.type = 'number';
          scoreInput.className = 'score-input';
          scoreInput.min = '0';
          scoreInput.max = '99';
          scoreInput.value = score !== null ? score : '';
          scoreInput.placeholder = '-';
          scoreInput.addEventListener('input', () => {
            const val = scoreInput.value;
            state.rounds[roundIdx][matchIdx][`score${num}`] = val !== '' ? parseInt(val) : null;
            saveState();
          });
          row.appendChild(scoreInput);
        } else {
          const scoreDisp = document.createElement('span');
          scoreDisp.className = 'score-display';
          scoreDisp.textContent = score !== null ? score : '-';
          row.appendChild(scoreDisp);
        }
      } else {
        row.innerHTML = `
          <div class="team-avatar"><span class="av-placeholder">?</span></div>
          <span class="team-name-bracket tbd">A definir</span>
        `;
      }

      card.appendChild(row);
    });

    // Actions
    if (match.team1 && match.team2 && !match.winner) {
      const actions = document.createElement('div');
      actions.className = 'match-actions';
      const confirmBtn = document.createElement('button');
      confirmBtn.className = 'btn btn-primary btn-sm';
      confirmBtn.innerHTML = svgIcon('check', 'icon-btn') + ' Confirmar';
      confirmBtn.addEventListener('click', () => confirmResult(roundIdx, matchIdx));
      actions.appendChild(confirmBtn);
      card.appendChild(actions);
    } else if (match.winner) {
      if (match.pen1 != null && match.pen2 != null) {
        const penInfo = document.createElement('div');
        penInfo.className = 'match-penalty-info';
        penInfo.textContent = `PEN: ${match.pen1} \u2013 ${match.pen2}`;
        card.appendChild(penInfo);
      }
      const actions = document.createElement('div');
      actions.className = 'match-actions';
      const editBtn = document.createElement('button');
      editBtn.className = 'btn btn-warning btn-sm';
      editBtn.innerHTML = svgIcon('edit', 'icon-btn') + ' Editar';
      editBtn.addEventListener('click', () => editMatch(roundIdx, matchIdx));
      actions.appendChild(editBtn);
      card.appendChild(actions);
    }

    return card;
  }

  // ——— Schedule ———
  function formatSchedule(match) {
    if (match.date || match.time) {
      const d = match.date ? formatDate(match.date) : '';
      const t = match.time || '';
      return `${d} ${t}`.trim() || 'Agendar';
    }
    return 'Agendar';
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
    return dateStr;
  }

  function openScheduleModal(roundIdx, matchIdx) {
    const match = state.rounds[roundIdx][matchIdx];
    elModalOverlay.classList.add('show');
    const modal = $('.modal', elModalOverlay);
    modal.innerHTML = `
      <h3>${svgIcon('calendar')} Agendar Partida — ${match.id}</h3>
      <div class="form-row">
        <div class="form-group">
          <label>Data</label>
          <input type="date" id="modal-date" value="${match.date || ''}">
        </div>
        <div class="form-group">
          <label>Horário</label>
          <input type="time" id="modal-time" value="${match.time || ''}">
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-primary btn-sm" id="modal-save">Salvar</button>
        <button class="btn btn-danger btn-sm" id="modal-cancel">Cancelar</button>
      </div>
    `;

    $('#modal-save', modal).addEventListener('click', () => {
      state.rounds[roundIdx][matchIdx].date = $('#modal-date', modal).value;
      state.rounds[roundIdx][matchIdx].time = $('#modal-time', modal).value;
      saveState();
      renderBracket();
      closeModal();
      toast('Agenda atualizada!', 'success');
    });

    $('#modal-cancel', modal).addEventListener('click', closeModal);
  }

  function closeModal() {
    elModalOverlay.classList.remove('show');
  }

  // ——— Confirm Result ———
  function confirmResult(roundIdx, matchIdx) {
    const match = state.rounds[roundIdx][matchIdx];
    const s1 = match.score1;
    const s2 = match.score2;

    if (s1 === null || s2 === null) {
      toast('Insira o placar dos dois times!', 'error');
      return;
    }

    if (s1 === s2) {
      openPenaltyModal(roundIdx, matchIdx);
      return;
    }

    applyMatchResult(roundIdx, matchIdx, s1 > s2 ? match.team1 : match.team2);
  }

  function applyMatchResult(roundIdx, matchIdx, winner, pen1, pen2) {
    const match = state.rounds[roundIdx][matchIdx];
    match.winner = { ...winner };
    if (pen1 != null) match.pen1 = pen1;
    if (pen2 != null) match.pen2 = pen2;

    const nextRoundIdx = roundIdx + 1;
    if (nextRoundIdx < state.rounds.length) {
      const nextMatchIdx = Math.floor(matchIdx / 2);
      const slot = matchIdx % 2 === 0 ? 'team1' : 'team2';
      state.rounds[nextRoundIdx][nextMatchIdx][slot] = { ...winner };
    }

    if (nextRoundIdx >= state.rounds.length) {
      state.champion = { ...winner };
    }

    saveState();
    renderBracket();

    if (state.champion) {
      toast(`${state.champion.name} é o CAMPEÃO!`, 'success');
      launchConfetti();
    } else {
      toast(`${winner.name} avança!`, 'success');
    }
  }

  // ——— Penalty Shootout Modal ———
  function openPenaltyModal(roundIdx, matchIdx) {
    const match = state.rounds[roundIdx][matchIdx];
    elModalOverlay.classList.add('show');
    const modal = $('.modal', elModalOverlay);
    modal.innerHTML = `
      <h3>${svgIcon('bolt')} Disputa de Pênaltis — ${match.id}</h3>
      <p style="text-align:center;color:var(--text-dim);font-size:.85rem;margin-bottom:14px;">
        Placar no tempo normal: ${match.score1} x ${match.score2} (Empate)
      </p>
      <div class="penalty-row">
        <div class="penalty-team">
          ${match.team1.country ? `<span class="penalty-flag">${getFlag(match.team1.country)}</span>` : ''}
          <span>${escapeHtml(match.team1.name)}</span>
        </div>
        <input type="number" id="modal-pen1" min="0" max="99" placeholder="0" class="penalty-input">
      </div>
      <div class="penalty-row">
        <div class="penalty-team">
          ${match.team2.country ? `<span class="penalty-flag">${getFlag(match.team2.country)}</span>` : ''}
          <span>${escapeHtml(match.team2.name)}</span>
        </div>
        <input type="number" id="modal-pen2" min="0" max="99" placeholder="0" class="penalty-input">
      </div>
      <div class="modal-actions" style="margin-top:16px;">
        <button class="btn btn-primary btn-sm" id="modal-pen-save">${svgIcon('check', 'icon-btn')} Confirmar</button>
        <button class="btn btn-danger btn-sm" id="modal-pen-cancel">Cancelar</button>
      </div>
    `;

    $('#modal-pen-save', modal).addEventListener('click', () => {
      const p1 = parseInt($('#modal-pen1', modal).value);
      const p2 = parseInt($('#modal-pen2', modal).value);
      if (isNaN(p1) || isNaN(p2)) {
        toast('Insira o placar dos pênaltis!', 'error');
        return;
      }
      if (p1 === p2) {
        toast('Pênaltis não podem empatar!', 'error');
        return;
      }
      const winner = p1 > p2 ? match.team1 : match.team2;
      closeModal();
      applyMatchResult(roundIdx, matchIdx, winner, p1, p2);
    });

    $('#modal-pen-cancel', modal).addEventListener('click', closeModal);
  }

  // ——— Edit Match ———
  function editMatch(roundIdx, matchIdx) {
    const match = state.rounds[roundIdx][matchIdx];
    if (!match.winner) return;

    match.winner = null;
    match.score1 = null;
    match.score2 = null;
    delete match.pen1;
    delete match.pen2;

    cascadeClear(roundIdx, matchIdx);
    state.champion = null;

    saveState();
    renderBracket();
    toast('Jogo liberado para edição!', 'info');
  }

  function cascadeClear(roundIdx, matchIdx) {
    const nextRoundIdx = roundIdx + 1;
    if (nextRoundIdx >= state.rounds.length) return;

    const nextMatchIdx = Math.floor(matchIdx / 2);
    const slot = matchIdx % 2 === 0 ? 'team1' : 'team2';
    const nextMatch = state.rounds[nextRoundIdx][nextMatchIdx];

    nextMatch[slot] = null;

    if (nextMatch.winner) {
      nextMatch.winner = null;
      nextMatch.score1 = null;
      nextMatch.score2 = null;
      delete nextMatch.pen1;
      delete nextMatch.pen2;
      cascadeClear(nextRoundIdx, nextMatchIdx);
    }
  }

  // ——— Status ———
  function updateStatus() {
    if (state.champion) {
      elTournamentStatus.textContent = `Torneio finalizado — Campeão: ${state.champion.name}`;
    } else {
      const totalMatches = state.rounds.reduce((a, r) => a + r.length, 0);
      const completed = state.rounds.reduce((a, r) => a + r.filter(m => m.winner).length, 0);
      elTournamentStatus.textContent = `${completed}/${totalMatches} jogos concluídos — ${state.teams.length} times`;
    }
  }

  // ——— Show Champion ———
  function showChampion(team) {
    elChampionBanner.classList.add('show');
    elChampionBanner.innerHTML = `
      <svg class="trophy-svg"><use href="#ico-trophy"/></svg>
      <h2>CAMPEÃO</h2>
      ${team.img ? `<div class="champ-avatar"><img src="${sanitizeDataUrl(team.img)}" alt=""></div>` : ''}
      ${team.country ? `<div class="champ-flag">${getFlag(team.country)}</div>` : ''}
      <div class="champ-name">${escapeHtml(team.name)}</div>
    `;
  }

  // ——— Draw SVG Connectors ———
  function drawConnectors() {
    const bracket = $('.bracket', elBracketArea);
    if (!bracket) return;

    const connCols = $$('.connector-col', bracket);
    const rounds = $$('.round:not(.connector-col)', bracket);

    connCols.forEach((col, cIdx) => {
      const svg = $('svg', col);
      if (!svg) return;

      const leftRound = rounds[cIdx];
      const rightRound = rounds[cIdx + 1];
      if (!leftRound || !rightRound) return;

      const leftCards = $$('.match-card', leftRound);
      const rightCards = $$('.match-card', rightRound);

      const colRect = col.getBoundingClientRect();
      svg.setAttribute('height', colRect.height);
      svg.innerHTML = '';

      rightCards.forEach((rCard, rIdx) => {
        const topCard = leftCards[rIdx * 2];
        const botCard = leftCards[rIdx * 2 + 1];
        if (!topCard || !botCard) return;

        const rRect = rCard.getBoundingClientRect();
        const tRect = topCard.getBoundingClientRect();
        const bRect = botCard.getBoundingClientRect();

        const y1 = tRect.top + tRect.height / 2 - colRect.top;
        const y2 = bRect.top + bRect.height / 2 - colRect.top;
        const yMid = rRect.top + rRect.height / 2 - colRect.top;

        const w = 30;

        // Top line: left mid -> right end at midpoint
        addLine(svg, 0, y1, w / 2, y1);
        addLine(svg, w / 2, y1, w / 2, yMid);
        addLine(svg, w / 2, yMid, w, yMid);

        // Bottom line
        addLine(svg, 0, y2, w / 2, y2);
        addLine(svg, w / 2, y2, w / 2, yMid);
      });
    });
  }

  function addLine(svg, x1, y1, x2, y2) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    svg.appendChild(line);
  }

  // ——— Reset Tournament ———
  function resetTournament() {
    if (state.started && !confirm('Tem certeza que deseja resetar o torneio? Todos os dados serão perdidos.')) {
      return;
    }
    state = {
      tournamentName: '',
      teams: [],
      rounds: [],
      started: false,
      champion: null
    };
    elTournamentName.value = '';
    elTeamCount.value = 8;
    localStorage.removeItem(LS_KEY);
    renderTeamInputs();
    renderBracket();
    elPlayerDragZone.classList.remove('show');
    elChampionBanner.classList.remove('show');
    toast('Torneio resetado!', 'info');
  }

  // ——— Empty State ———
  function createEmptyState() {
    const div = document.createElement('div');
    div.className = 'empty-state';
    div.innerHTML = `
      <svg class="empty-icon-svg"><use href="#ico-ball"/></svg>
      <p>Nenhum torneio ativo</p>
      <p style="font-size:.85rem;">Configure os times e clique em <strong>"Gerar Torneio"</strong></p>
    `;
    return div;
  }

  // ——— Confetti ———
  function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#ffdf00', '#009c3b', '#002776', '#ffffff', '#00e676', '#ff4444'];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w: Math.random() * 10 + 5,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vy: Math.random() * 3 + 2,
        vx: (Math.random() - 0.5) * 2,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10
      });
    }

    let frame = 0;
    const maxFrames = 180;

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotSpeed;
        p.vy += 0.05;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - frame / maxFrames);
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      frame++;
      if (frame < maxFrames) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    animate();
  }

  // Redraw connectors on resize
  window.addEventListener('resize', () => {
    if (state.started) {
      requestAnimationFrame(drawConnectors);
    }
  });

  // Init
  document.addEventListener('DOMContentLoaded', init);
})();
