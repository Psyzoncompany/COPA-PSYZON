/**
 * Sponsors Slideshow Logic
 * Exibe logos e slideshows para clientes na aba de Chaveamento.
 * Cada cliente possui exatamente 3 imagens com rotação automática de 7s,
 * controles manuais (avançar, voltar, pausar/retomar) e link clicável
 * lido automaticamente do arquivo Link.txt da pasta do cliente.
 */

const sponsorsConfig = [
  {
    id: 'acai-ramos',
    name: 'Açaí Ramos',
    logo: 'PATROCINADORES/banner%20ramos%20acai.png',
    images: [
      'SLIDES/acai-ramos/foto1.jpg',
      'SLIDES/acai-ramos/foto2.png',
      'SLIDES/acai-ramos/foto3.png'
    ],
    linkFile: 'SLIDES/acai-ramos/Link.txt'
  },
  {
    id: 'virtu',
    name: 'Barbearia Virtu',
    logo: 'PATROCINADORES/banner%20virtu.png',
    images: [
      'SLIDES/Barbearia-virtu/IMG_6106.jpg',
      'SLIDES/Barbearia-virtu/IMG_6324.JPG.jpeg',
      {type: 'video', src: 'SLIDES/Barbearia-virtu/video.mp4.mp4'}
    ],
    linkFile: 'SLIDES/Barbearia-virtu/Link.txt'
  },
  {
    id: 'biel-motos',
    name: 'Biel Motos',
    logo: 'PATROCINADORES/BIEL%20MOTOS.png',
    images: [
      'SLIDES/Biel-Motos/IMG_20260413_145322.jpg.jpeg',
      'SLIDES/Biel-Motos/IMG_20260413_145346.jpg.jpeg',
      'SLIDES/Biel-Motos/IMG_20260413_151307.jpg.jpeg'
    ],
    linkFile: null
  },
  {
    id: 'bizuca',
    name: 'Bizuca Health & Academy',
    logo: 'PATROCINADORES/banner%20bizuca.png',
    images: [
      'SLIDES/Bizuca-Health-%26-Academy/slide1.jpg',
      'SLIDES/Bizuca-Health-%26-Academy/slide2.jpg',
      'SLIDES/Bizuca-Health-%26-Academy/slide3.jpg.jpeg'
    ],
    linkFile: 'SLIDES/Bizuca-Health-%26-Academy/Link.txt'
  },
  {
    id: 'bruno-leite',
    name: 'Bruno Leite Assessoria Contábil',
    logo: 'PATROCINADORES/BRUNO%20LEITE.png',
    images: [
      'SLIDES/Bruno-Leite/slide%201.jpeg',
      'SLIDES/Bruno-Leite/slide%202.jpeg',
      'SLIDES/Bruno-Leite/slide%203.jpeg'
    ],
    linkFile: 'SLIDES/Bruno-Leite/Link.txt'
  },
  {
    id: 'carol-home',
    name: 'Carol Home',
    logo: 'PATROCINADORES/CAROL%20ROCHA.png',
    images: [
      'SLIDES/Carol-Home/IMG_20260413_153223.jpg.jpeg',
      'SLIDES/Carol-Home/IMG_20260413_153236.jpg.jpeg',
      'SLIDES/Carol-Home/IMG_20260413_153456.jpg.jpeg'
    ],
    linkFile: null
  },
  {
    id: 'central-bebidas',
    name: 'Central de Bebidas',
    logo: 'PATROCINADORES/CENTRAL%20ATACADISTA.png',
    images: [],
    linkFile: null
  },
  {
    id: 'revitalize',
    name: 'Clínica Revitalize',
    logo: 'PATROCINADORES/banner%20revitalize.png',
    images: [
      'SLIDES/Clinica-Revitalize/clinica1.jpg',
      'SLIDES/Clinica-Revitalize/FOTO2.png',
      'SLIDES/Clinica-Revitalize/FOTO3.png'
    ],
    linkFile: 'SLIDES/Clinica-Revitalize/Link.txt'
  },
  {
    id: 'daby-gourmet',
    name: 'Daby Gourmet',
    logo: 'PATROCINADORES/daby%20gourmet.png',
    images: [],
    linkFile: null
  },
  {
    id: 'eburger',
    name: 'E-Burger',
    logo: 'PATROCINADORES/E-BURGUER.png',
    images: [
      'SLIDES/E-Burger/foto1.jpeg',
      'SLIDES/E-Burger/foto2.jpeg',
      {type: 'video', src: 'SLIDES/E-Burger/video1.mp4'}
    ],
    linkFile: 'SLIDES/E-Burger/Link.txt'
  },
  {
    id: 'fagundes',
    name: 'Fagundes Distribuidora',
    logo: 'PATROCINADORES/fagundes.png',
    images: [
      'SLIDES/FagundesDistribuidora/foto1.jpg',
      'SLIDES/FagundesDistribuidora/foto2.jpeg',
      'SLIDES/FagundesDistribuidora/foto3.jpeg'
    ],
    linkFile: 'SLIDES/FagundesDistribuidora/Link.txt'
  },
  {
    id: 'giselle',
    name: 'Giselle Fest',
    logo: 'PATROCINADORES/banner%20giselle.png',
    images: [
      'SLIDES/Giselle-Fest/foto1.png',
      'SLIDES/Giselle-Fest/foto2.png',
      'SLIDES/Giselle-Fest/foto3.png'
    ],
    linkFile: 'SLIDES/Giselle-Fest/Link.txt'
  },
  {
    id: 'gusmao-modas',
    name: 'Gusmão Modas',
    logo: 'PATROCINADORES/GUSM%C3%83O%20MODAS.png',
    images: [
      {type: 'video', src: 'SLIDES/Gusmao-Modas/video1.mp4'}
    ],
    linkFile: null
  },
  {
    id: 'imperio',
    name: 'Império MRS',
    logo: 'PATROCINADORES/imperio.png',
    images: [
      {type: 'video', src: 'SLIDES/ImperiosMRS/foto2.mp4'}
    ],
    linkFile: null
  },
  {
    id: 'janejoias',
    name: 'Jane Jóias',
    logo: 'PATROCINADORES/banner%20jane%20joias.png',
    images: [
      'SLIDES/JaneJoias/foto1.png',
      'SLIDES/JaneJoias/foto2.png',
      'SLIDES/JaneJoias/foto3.png'
    ],
    linkFile: 'SLIDES/JaneJoias/Link.txt'
  },
  {
    id: 'lavajato-tg',
    name: 'Lava Jato TG',
    logo: 'PATROCINADORES/lava%20jato%20tg.png',
    images: [
      'SLIDES/LavaJato/foto1.jpeg',
      'SLIDES/LavaJato/foto2.jpeg',
      'SLIDES/LavaJato/foto3.jpeg'
    ],
    linkFile: 'SLIDES/LavaJato/Link.txt'
  },
  {
    id: 'ledulcis',
    name: 'Lê Dulcis Brigadeiria',
    logo: 'PATROCINADORES/L%C3%AA%20Dulcis.png',
    images: [
      'SLIDES/Ledulcis/foto1.jpeg',
      'SLIDES/Ledulcis/foto2.png',
      'SLIDES/Ledulcis/foto3.png'
    ],
    linkFile: 'SLIDES/Ledulcis/Link.txt'
  },
  {
    id: 'nachapa',
    name: 'Na Chapa',
    logo: 'PATROCINADORES/banner%20na%20chapa.png',
    images: [
      'SLIDES/NaChapa/foto1.png',
      'SLIDES/NaChapa/foto2.png',
      'SLIDES/NaChapa/foto3.png'
    ],
    linkFile: 'SLIDES/NaChapa/Link.txt'
  },
  {
    id: 'presencial-tecnologia',
    name: 'Presencial Tecnologia',
    logo: 'PATROCINADORES/PRECENSIAL.png',
    images: [
      'SLIDES/Presencial-Tecnologia/foto1.png',
      'SLIDES/Presencial-Tecnologia/foto2.png',
      'SLIDES/Presencial-Tecnologia/foto3.png'
    ],
    linkFile: 'SLIDES/Presencial-Tecnologia/Link.txt'
  },
  {
    id: 'rogeriorelogio',
    name: 'Rogério Relógio',
    logo: 'PATROCINADORES/banner%20rogerio%20relogio.png',
    images: [
      {type: 'video', src: 'SLIDES/Rogerio-Relogio/video1.mp4'}
    ],
    linkFile: null
  }
];

document.addEventListener('DOMContentLoaded', function () {
  initSponsorsShowcase();
});

/**
 * Extrai a primeira URL válida (http/https) de um texto multi-linha.
 */
function extractFirstUrl(text) {
  if (!text) return '';
  var lines = text.split('\n');
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line.match(/^https?:\/\//)) {
      return line;
    }
  }
  return '';
}

async function initSponsorsShowcase() {
  var container = document.getElementById('bracket-sponsors-showcase');
  if (!container) return;

  // Título da seção
  var sectionTitle = document.createElement('h3');
  sectionTitle.className = 'sponsors-showcase-title';
  sectionTitle.textContent = 'PATROCINADORES';
  container.appendChild(sectionTitle);

  // ─── Resolução de links (fetch todos em paralelo) ───
  var sponsorLinks = [];
  var linkPromises = sponsorsConfig.map(function (sponsor) {
    if (!sponsor.linkFile) return Promise.resolve('');
    return fetch(sponsor.linkFile)
      .then(function (r) { return r.ok ? r.text() : ''; })
      .then(function (t) { return extractFirstUrl(t); })
      .catch(function () { return ''; });
  });
  sponsorLinks = await Promise.all(linkPromises);

  // ─── Palco único: exibe 1 patrocinador por vez ───
  var stage = document.createElement('div');
  stage.className = 'sponsors-showcase-stage';
  container.appendChild(stage);

  // Indicadores de patrocinador (logos no rodapé)
  var sponsorNav = document.createElement('div');
  sponsorNav.className = 'sponsors-nav';
  var sponsorDots = [];
  for (var n = 0; n < sponsorsConfig.length; n++) {
    var sThumb = document.createElement('img');
    sThumb.src = sponsorsConfig[n].logo;
    sThumb.alt = sponsorsConfig[n].name;
    sThumb.className = 'sponsor-nav-logo' + (n === 0 ? ' active' : '');
    sThumb.loading = 'lazy';
    sThumb.dataset.index = n;
    sThumb.addEventListener('click', (function(idx) {
      return function(e) {
        e.preventDefault();
        e.stopPropagation();
        showSponsor(idx, 0);
        startAutoSlide();
      };
    })(n));
    sponsorNav.appendChild(sThumb);
    sponsorDots.push(sThumb);
  }
  container.appendChild(sponsorNav);

  // ─── Estado global do slideshow ───
  var SLIDE_INTERVAL_FULL = 7000;
  var SLIDE_INTERVAL_LOGO = 5000;
  var VIDEO_MAX_DURATION = 21; // segundos
  var currentSponsor = 0;
  var currentSlide = 0;
  var timer = null;
  var isPlaying = true;

  // Elementos em exibição
  var activeCard = null;
  var activeSlideEls = [];
  var activeDotEls = [];
  var activeProgressFill = null;

  /**
   * Cria e exibe o card de um patrocinador no palco.
   * Retorna { card, slideEls, dotEls, progressFill }
   */
  function buildSponsorCard(index) {
    var sponsor = sponsorsConfig[index];
    var targetLink = sponsorLinks[index] || '';
    var slidesFiles = sponsor.images || [];
    var isLogoOnly = slidesFiles.length === 0;

    var cardEl = targetLink ? document.createElement('a') : document.createElement('div');
    cardEl.className = 'sponsor-slidecase-card';
    if (isLogoOnly) cardEl.classList.add('logo-only-card');
    if (targetLink) {
      cardEl.href = targetLink;
      cardEl.target = '_blank';
      cardEl.rel = 'noopener noreferrer';
    } else {
      cardEl.classList.add('no-link');
    }

    // ─── Logo / Nome do patrocinador (topo) ───
    var logoArea = document.createElement('div');
    logoArea.className = 'sponsor-logo-area' + (isLogoOnly ? ' logo-only' : '');

    var logoImg = document.createElement('img');
    logoImg.src = sponsor.logo;
    logoImg.alt = 'Logo ' + sponsor.name;
    logoImg.loading = 'lazy';
    logoImg.className = 'sponsor-logo-img' + (isLogoOnly ? ' logo-only-img' : '');
    logoArea.appendChild(logoImg);

    var logoName = document.createElement('span');
    logoName.className = 'sponsor-logo-name';
    logoName.textContent = sponsor.name;
    logoArea.appendChild(logoName);

    cardEl.appendChild(logoArea);

    var slideEls = [];
    var dotEls = [];
    var progressFill = null;

    if (!isLogoOnly) {
      // ─── Área do Slideshow (imagem adapta ao formato) ───
      var slideArea = document.createElement('div');
      slideArea.className = 'sponsor-slides-area';

      for (var idx = 0; idx < slidesFiles.length; idx++) {
        var mediaItem = slidesFiles[idx];
        var isVideo = typeof mediaItem === 'object' && mediaItem.type === 'video';
        var mediaSrc = isVideo ? mediaItem.src : mediaItem;
        var el;

        if (isVideo) {
          el = document.createElement('video');
          el.src = mediaSrc;
          el.muted = true;
          el.loop = false;
          el.playsInline = true;
          el.preload = 'metadata';
          el.className = 'sponsor-slide-img sponsor-slide-video' + (idx === 0 ? ' active' : '');
        } else {
          el = document.createElement('img');
          el.src = mediaSrc;
          el.loading = 'lazy';
          el.alt = sponsor.name + ' - imagem ' + (idx + 1);
          el.className = 'sponsor-slide-img' + (idx === 0 ? ' active' : '');
        }
        slideArea.appendChild(el);
        slideEls.push(el);
      }

      // Dots indicadores de slide (só se mais de 1 imagem)
      if (slidesFiles.length > 1) {
        var dotsWrap = document.createElement('div');
        dotsWrap.className = 'sponsor-slide-dots';
        for (var d = 0; d < slidesFiles.length; d++) {
          var dot = document.createElement('span');
          dot.className = 'sponsor-dot' + (d === 0 ? ' active' : '');
          dotsWrap.appendChild(dot);
          dotEls.push(dot);
        }
        slideArea.appendChild(dotsWrap);
      }

      // Barra de progresso
      var progressBar = document.createElement('div');
      progressBar.className = 'sponsor-slide-progress';
      progressFill = document.createElement('div');
      progressFill.className = 'sponsor-slide-progress-fill';
      progressBar.appendChild(progressFill);
      slideArea.appendChild(progressBar);

      cardEl.appendChild(slideArea);
    }

    return { card: cardEl, slideEls: slideEls, dotEls: dotEls, progressFill: progressFill };
  }

  /**
   * Reinicia a barra de progresso para o slide atual.
   */
  function getCurrentInterval() {
    var sponsor = sponsorsConfig[currentSponsor];
    var imgs = sponsor && sponsor.images ? sponsor.images : [];
    return imgs.length === 0 ? SLIDE_INTERVAL_LOGO : SLIDE_INTERVAL_FULL;
  }

  /**
   * Verifica se um elemento de slide é um vídeo.
   */
  function isVideoEl(el) {
    return el && el.tagName === 'VIDEO';
  }

  /**
   * Para todos os vídeos ativos no card.
   */
  function stopAllVideos(els) {
    for (var v = 0; v < els.length; v++) {
      if (isVideoEl(els[v])) {
        els[v].pause();
        els[v].currentTime = 0;
      }
    }
  }

  /**
   * Inicia reprodução do vídeo ativo se for vídeo.
   * Retorna true se é vídeo (precisa esperar 'ended').
   */
  function playActiveVideo() {
    var el = activeSlideEls[currentSlide];
    if (isVideoEl(el)) {
      el.currentTime = 0;
      el.play().catch(function() {});
      return true;
    }
    return false;
  }

  var videoTimeupdateHandler = null;
  var videoMaxTimer = null;

  /**
   * Configura limite de 21s no vídeo ativo.
   */
  function setupVideoLimit(el) {
    clearVideoLimit();
    var handler = function() {
      if (el.currentTime >= VIDEO_MAX_DURATION) {
        el.pause();
        el.removeEventListener('timeupdate', handler);
      }
    };
    el.addEventListener('timeupdate', handler);
    videoTimeupdateHandler = { el: el, fn: handler };
    // Fallback timer
    videoMaxTimer = setTimeout(function() {
      if (!el.paused) el.pause();
    }, (VIDEO_MAX_DURATION + 0.5) * 1000);
  }

  function clearVideoLimit() {
    if (videoTimeupdateHandler && videoTimeupdateHandler.el) {
      videoTimeupdateHandler.el.removeEventListener('timeupdate', videoTimeupdateHandler.fn);
      videoTimeupdateHandler = null;
    }
    if (videoMaxTimer) {
      clearTimeout(videoMaxTimer);
      videoMaxTimer = null;
    }
  }

  function restartProgress() {
    if (!activeProgressFill) return;
    var interval = getCurrentInterval();
    activeProgressFill.style.transition = 'none';
    activeProgressFill.style.width = '0%';
    void activeProgressFill.offsetWidth;
    if (isPlaying) {
      activeProgressFill.style.transition = 'width ' + interval + 'ms linear';
      activeProgressFill.style.width = '100%';
    }
  }

  /**
   * Exibe o patrocinador na posição `sIdx`, começando pelo slide `slIdx`.
   * Faz animação de entrada/saída.
   */
  function showSponsor(sIdx, slIdx) {
    if (sIdx < 0) sIdx = sponsorsConfig.length - 1;
    if (sIdx >= sponsorsConfig.length) sIdx = 0;
    currentSponsor = sIdx;
    currentSlide = slIdx || 0;

    // Atualiza dots de navegação do patrocinador
    for (var i = 0; i < sponsorDots.length; i++) {
      sponsorDots[i].classList.toggle('active', i === currentSponsor);
    }

    // Anima saída do card atual
    if (activeCard) {
      stopAllVideos(activeSlideEls);
      activeCard.classList.add('exiting');
      var old = activeCard;
      setTimeout(function () { if (old.parentNode) old.parentNode.removeChild(old); }, 500);
    }

    // Constrói novo card
    var data = buildSponsorCard(currentSponsor);
    activeCard = data.card;
    activeSlideEls = data.slideEls;
    activeDotEls = data.dotEls;
    activeProgressFill = data.progressFill;

    // Ativa o slide correto
    if (currentSlide > 0 && currentSlide < activeSlideEls.length) {
      activeSlideEls[0].classList.remove('active');
      if (activeDotEls[0]) activeDotEls[0].classList.remove('active');
      activeSlideEls[currentSlide].classList.add('active');
      if (activeDotEls[currentSlide]) activeDotEls[currentSlide].classList.add('active');
    }

    activeCard.classList.add('entering');
    stage.appendChild(activeCard);
    void activeCard.offsetWidth;
    activeCard.classList.remove('entering');
    activeCard.classList.add('visible');

    // Se o slide ativo for vídeo, inicia reprodução
    playActiveVideo();
    restartProgress();
  }

  /**
   * Avança para o próximo slide; se último, vai ao próximo patrocinador.
   */
  function advance() {
    var nextSlide = currentSlide + 1;
    if (nextSlide >= activeSlideEls.length) {
      // Próximo patrocinador
      showSponsor(currentSponsor + 1, 0);
    } else {
      // Para vídeo atual se for vídeo
      if (isVideoEl(activeSlideEls[currentSlide])) {
        activeSlideEls[currentSlide].pause();
      }
      // Próximo slide do mesmo patrocinador
      activeSlideEls[currentSlide].classList.remove('active');
      if (activeDotEls[currentSlide]) activeDotEls[currentSlide].classList.remove('active');
      currentSlide = nextSlide;
      activeSlideEls[currentSlide].classList.add('active');
      if (activeDotEls[currentSlide]) activeDotEls[currentSlide].classList.add('active');
      // Inicia reprodução se for vídeo
      playActiveVideo();
      restartProgress();
    }
  }

  /**
   * Inicia/reinicia o timer automático.
   * Para vídeos, espera o evento 'ended' antes de avançar.
   */
  var videoEndHandler = null;

  function startAutoSlide() {
    if (timer) clearTimeout(timer);
    // Limpa handler de vídeo anterior
    if (videoEndHandler && videoEndHandler.el) {
      videoEndHandler.el.removeEventListener('ended', videoEndHandler.fn);
      videoEndHandler = null;
    }

    var activeEl = activeSlideEls[currentSlide];

    // Se o slide atual for vídeo, limita a 21s e avança ao terminar
    if (isVideoEl(activeEl)) {
      // Esconde barra de progresso durante vídeo
      if (activeProgressFill) {
        activeProgressFill.style.transition = 'none';
        activeProgressFill.style.width = '0%';
      }
      setupVideoLimit(activeEl);
      var endFn = function() {
        clearVideoLimit();
        if (isPlaying) advance();
        startAutoSlide();
      };
      // Avança quando o vídeo terminar OU quando atingir 21s
      activeEl.addEventListener('ended', endFn, { once: true });
      // Timer de segurança para 21s
      timer = setTimeout(function() {
        activeEl.removeEventListener('ended', endFn);
        endFn();
      }, (VIDEO_MAX_DURATION + 0.5) * 1000);
      videoEndHandler = { el: activeEl, fn: endFn };
      return;
    }

    // Para imagens, usa o timer normal
    var interval = getCurrentInterval();
    timer = setTimeout(function autoTick() {
      if (isPlaying) advance();
      startAutoSlide();
    }, interval);
    restartProgress();
  }

  // ─── Controles globais (prev / play-pause / next) ───
  var controls = document.createElement('div');
  controls.className = 'sponsor-slide-controls sponsor-global-controls';

  var btnPrev = document.createElement('button');
  btnPrev.className = 'sponsor-btn-control';
  btnPrev.setAttribute('aria-label', 'Patrocinador anterior');
  btnPrev.innerHTML = '<span class="material-symbols-outlined">chevron_left</span>';

  var btnPlayPause = document.createElement('button');
  btnPlayPause.className = 'sponsor-btn-control';
  btnPlayPause.setAttribute('aria-label', 'Pausar / Retomar');
  btnPlayPause.title = 'Pausar / Retomar';
  btnPlayPause.innerHTML = '<span class="material-symbols-outlined">pause</span>';

  var btnNext = document.createElement('button');
  btnNext.className = 'sponsor-btn-control';
  btnNext.setAttribute('aria-label', 'Próximo patrocinador');
  btnNext.innerHTML = '<span class="material-symbols-outlined">chevron_right</span>';

  var btnFullscreen = document.createElement('button');
  btnFullscreen.className = 'sponsor-btn-control sponsor-btn-fullscreen';
  btnFullscreen.setAttribute('aria-label', 'Tela Cheia');
  btnFullscreen.title = 'Tela Cheia';
  btnFullscreen.innerHTML = '<span class="material-symbols-outlined">fullscreen</span>';

  controls.appendChild(btnPrev);
  controls.appendChild(btnPlayPause);
  controls.appendChild(btnNext);
  controls.appendChild(btnFullscreen);
  container.appendChild(controls);

  btnPrev.addEventListener('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    showSponsor(currentSponsor - 1, 0);
    startAutoSlide();
  });

  btnNext.addEventListener('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    showSponsor(currentSponsor + 1, 0);
    startAutoSlide();
  });

  btnPlayPause.addEventListener('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    isPlaying = !isPlaying;
    btnPlayPause.innerHTML = isPlaying
      ? '<span class="material-symbols-outlined">pause</span>'
      : '<span class="material-symbols-outlined">play_arrow</span>';
    if (isPlaying) {
      startAutoSlide();
    } else {
      if (activeProgressFill) {
        activeProgressFill.style.width = getComputedStyle(activeProgressFill).width;
        activeProgressFill.style.transition = 'none';
      }
    }
  });

  // ─── Fullscreen (Tela Cheia para telão) ───
  var isFullscreen = false;

  function enterFullscreen() {
    isFullscreen = true;
    container.classList.add('sponsors-fullscreen');
    document.body.classList.add('sponsors-fullscreen-active');
    btnFullscreen.innerHTML = '<span class="material-symbols-outlined">fullscreen_exit</span>';
    btnFullscreen.title = 'Sair da Tela Cheia';

    // Tenta usar a API nativa de fullscreen do navegador
    var elem = container;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(function() {});
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  }

  function exitFullscreen() {
    isFullscreen = false;
    container.classList.remove('sponsors-fullscreen');
    document.body.classList.remove('sponsors-fullscreen-active');
    btnFullscreen.innerHTML = '<span class="material-symbols-outlined">fullscreen</span>';
    btnFullscreen.title = 'Tela Cheia';

    if (document.fullscreenElement || document.webkitFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(function() {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  function toggleFullscreen() {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }

  btnFullscreen.addEventListener('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    toggleFullscreen();
  });

  // Sai do fullscreen se o navegador sair (ESC nativo)
  document.addEventListener('fullscreenchange', function () {
    if (!document.fullscreenElement && isFullscreen) {
      isFullscreen = false;
      container.classList.remove('sponsors-fullscreen');
      document.body.classList.remove('sponsors-fullscreen-active');
      btnFullscreen.innerHTML = '<span class="material-symbols-outlined">fullscreen</span>';
      btnFullscreen.title = 'Tela Cheia';
    }
  });
  document.addEventListener('webkitfullscreenchange', function () {
    if (!document.webkitFullscreenElement && isFullscreen) {
      isFullscreen = false;
      container.classList.remove('sponsors-fullscreen');
      document.body.classList.remove('sponsors-fullscreen-active');
      btnFullscreen.innerHTML = '<span class="material-symbols-outlined">fullscreen</span>';
      btnFullscreen.title = 'Tela Cheia';
    }
  });

  // ESC como atalho adicional
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isFullscreen) {
      exitFullscreen();
    }
    // F11 para toggle
    if (e.key === 'F11') {
      e.preventDefault();
      toggleFullscreen();
    }
  });

  // ─── Inicializa exibindo o primeiro patrocinador ───
  showSponsor(0, 0);
  startAutoSlide();
}
