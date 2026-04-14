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
      'SLIDES/Barbearia-virtu/IMG_6324.JPG.jpeg'
    ],
    linkFile: 'SLIDES/Barbearia-virtu/Link.txt'
  },
  {
    id: 'biel-motos',
    name: 'Biel Motos',
    logo: 'SLIDES/Biel-Motos/FOTO%20DE%20PERFIL.png',
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
      'SLIDES/Bizuca%20Health%20%26%20Academy/slide1.jpg',
      'SLIDES/Bizuca%20Health%20%26%20Academy/slide2.jpg',
      'SLIDES/Bizuca%20Health%20%26%20Academy/slide3.jpg.jpeg'
    ],
    linkFile: 'SLIDES/Bizuca%20Health%20%26%20Academy/Link.txt'
  },
  {
    id: 'bruno-leite',
    name: 'Bruno Leite Assessoria Contábil',
    logo: 'SLIDES/Bruno-Leite/slide%201.jpeg',
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
    logo: 'SLIDES/Carol-Home/IMG_20260413_153223.jpg.jpeg',
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
    logo: 'PATROCINADORES/central%20atacatista.png',
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
    logo: 'SLIDES/E-Burger/foto1.jpeg',
    images: [
      'SLIDES/E-Burger/foto1.jpeg',
      'SLIDES/E-Burger/foto2.jpeg'
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
    logo: 'PATROCINADORES/gy%20cake.png',
    images: [],
    linkFile: null
  },
  {
    id: 'imperio',
    name: 'Império MRS',
    logo: 'PATROCINADORES/imperio.png',
    images: [
      'PATROCINADORES/banner%20IMPERIO.png'
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
    logo: 'SLIDES/Presencial-Tecnologia/foto1.png',
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
      'SLIDES/Rogerio-Relogio/WhatsApp%20Image%202026-04-03%20at%2017.05.34.jpeg'
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

  // Indicadores de patrocinador (mini-dots no rodapé)
  var sponsorNav = document.createElement('div');
  sponsorNav.className = 'sponsors-nav';
  var sponsorDots = [];
  for (var n = 0; n < sponsorsConfig.length; n++) {
    var sDot = document.createElement('span');
    sDot.className = 'sponsor-nav-dot' + (n === 0 ? ' active' : '');
    sponsorNav.appendChild(sDot);
    sponsorDots.push(sDot);
  }
  container.appendChild(sponsorNav);

  // ─── Estado global do slideshow ───
  var SLIDE_INTERVAL_FULL = 7000;
  var SLIDE_INTERVAL_LOGO = 5000;
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
        var sImg = document.createElement('img');
        sImg.src = slidesFiles[idx];
        sImg.loading = 'lazy';
        sImg.alt = sponsor.name + ' - imagem ' + (idx + 1);
        sImg.className = 'sponsor-slide-img' + (idx === 0 ? ' active' : '');
        slideArea.appendChild(sImg);
        slideEls.push(sImg);
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
      activeDotEls[0].classList.remove('active');
      activeSlideEls[currentSlide].classList.add('active');
      activeDotEls[currentSlide].classList.add('active');
    }

    activeCard.classList.add('entering');
    stage.appendChild(activeCard);
    void activeCard.offsetWidth;
    activeCard.classList.remove('entering');
    activeCard.classList.add('visible');

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
      // Próximo slide do mesmo patrocinador
      activeSlideEls[currentSlide].classList.remove('active');
      if (activeDotEls[currentSlide]) activeDotEls[currentSlide].classList.remove('active');
      currentSlide = nextSlide;
      activeSlideEls[currentSlide].classList.add('active');
      if (activeDotEls[currentSlide]) activeDotEls[currentSlide].classList.add('active');
      restartProgress();
    }
  }

  /**
   * Inicia/reinicia o timer automático.
   */
  function startAutoSlide() {
    if (timer) clearTimeout(timer);
    var interval = getCurrentInterval();
    timer = setTimeout(function autoTick() {
      if (isPlaying) advance();
      var nextInterval = getCurrentInterval();
      timer = setTimeout(autoTick, nextInterval);
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

  controls.appendChild(btnPrev);
  controls.appendChild(btnPlayPause);
  controls.appendChild(btnNext);
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

  // ─── Inicializa exibindo o primeiro patrocinador ───
  showSponsor(0, 0);
  startAutoSlide();
}
