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
    logo: 'SLIDES/A%C3%A7a%C3%AD%20Ramos%20+/logo.jpeg',
    images: [
      'SLIDES/A%C3%A7a%C3%AD%20Ramos%20+/slide%201.png',
      'SLIDES/A%C3%A7a%C3%AD%20Ramos%20+/slide%202.png',
      'SLIDES/A%C3%A7a%C3%AD%20Ramos%20+/slide%203.png'
    ],
    linkFile: 'SLIDES/A%C3%A7a%C3%AD%20Ramos%20+/Link.txt'
  },
  {
    id: 'bizuca',
    name: 'Bizuca Health & Academy',
    logo: 'PATROCINADORES/banner%20bizuca.png',
    images: [
      'PATROCINADORES/banner%20bizuca.png',
      'PATROCINADORES/banner%20bizuca.png',
      'PATROCINADORES/banner%20bizuca.png'
    ],
    linkFile: 'SLIDES/Bizuca%20Health%20%26%20Academy/Link.txt'
  },
  {
    id: 'bruno-leite',
    name: 'Bruno Leite Assessoria Contábil',
    logo: 'SLIDES/Bruno%20Leite%20Assessoria%20Cont%C3%A1bil/logo.jpeg',
    images: [
      'SLIDES/Bruno%20Leite%20Assessoria%20Cont%C3%A1bil/slide%201.jpeg',
      'SLIDES/Bruno%20Leite%20Assessoria%20Cont%C3%A1bil/slide%202.jpeg',
      'SLIDES/Bruno%20Leite%20Assessoria%20Cont%C3%A1bil/slide%203.jpeg'
    ],
    linkFile: 'SLIDES/Bruno%20Leite%20Assessoria%20Cont%C3%A1bil/Link.txt'
  },
  {
    id: 'central-bebidas',
    name: 'Central de Bebidas e Ancore Seguradora',
    logo: 'SLIDES/Central%20de%20Bebidas%20e%20Ancore%20Seguradora/logo%20central%20das%20bebidas.png',
    images: [
      'SLIDES/Central%20de%20Bebidas%20e%20Ancore%20Seguradora/logo%20central%20das%20bebidas.png',
      'SLIDES/Central%20de%20Bebidas%20e%20Ancore%20Seguradora/logo%20central%20das%20bebidas.png',
      'SLIDES/Central%20de%20Bebidas%20e%20Ancore%20Seguradora/logo%20central%20das%20bebidas.png'
    ],
    linkFile: null
  },
  {
    id: 'revitalize',
    name: 'Clínica Revitalize',
    logo: 'PATROCINADORES/banner%20revitalize.png',
    images: [
      'PATROCINADORES/banner%20revitalize.png',
      'PATROCINADORES/banner%20revitalize.png',
      'PATROCINADORES/banner%20revitalize.png'
    ],
    linkFile: 'SLIDES/Clinica%20Revitalize+/Link.txt'
  },
  {
    id: 'daby-gourmet',
    name: 'Daby Gourmet',
    logo: 'SLIDES/Daby%20Gourmet/slide%201.jpeg',
    images: [
      'SLIDES/Daby%20Gourmet/slide%201.jpeg',
      'SLIDES/Daby%20Gourmet/slide%201.jpeg',
      'SLIDES/Daby%20Gourmet/slide%201.jpeg'
    ],
    linkFile: null
  },
  {
    id: 'eburger',
    name: 'E-Burger',
    logo: 'SLIDES/E-Burger+/slide%201.jpeg',
    images: [
      'SLIDES/E-Burger+/slide%201.jpeg',
      'SLIDES/E-Burger+/slide%202.jpeg',
      'SLIDES/E-Burger+/slide%201.jpeg'
    ],
    linkFile: 'SLIDES/E-Burger+/Link.txt'
  },
  {
    id: 'fagundes',
    name: 'Fagundes Distribuidora',
    logo: 'SLIDES/Fagundes%20Distribuidora/logo.jpeg',
    images: [
      'SLIDES/Fagundes%20Distribuidora/slide%201.jpeg',
      'SLIDES/Fagundes%20Distribuidora/slide%201.jpeg',
      'SLIDES/Fagundes%20Distribuidora/slide%201.jpeg'
    ],
    linkFile: 'SLIDES/Fagundes%20Distribuidora/Link.txt'
  },
  {
    id: 'giselle',
    name: 'Giselle Fest',
    logo: 'PATROCINADORES/banner%20giselle.png',
    images: [
      'SLIDES/Giselle%20Fest%20+/slide%201.png',
      'SLIDES/Giselle%20Fest%20+/slide%202.png',
      'SLIDES/Giselle%20Fest%20+/slide%203.png'
    ],
    linkFile: 'SLIDES/Giselle%20Fest%20+/Link.txt'
  },
  {
    id: 'gycake',
    name: 'GyCake',
    logo: 'SLIDES/GyCake%20+/logo.jpeg',
    images: [
      'SLIDES/GyCake%20+/slide%201.png',
      'SLIDES/GyCake%20+/slide%202.png',
      'SLIDES/GyCake%20+/slide%203.png'
    ],
    linkFile: 'SLIDES/GyCake%20+/Link.txt'
  },
  {
    id: 'janejoias',
    name: 'Jane Jóias',
    logo: 'PATROCINADORES/banner%20jane%20joias.png',
    images: [
      'SLIDES/Jane%20J%C3%B3ias%20+/slide%201.png',
      'SLIDES/Jane%20J%C3%B3ias%20+/slide%202.png',
      'SLIDES/Jane%20J%C3%B3ias%20+/slide%203.png'
    ],
    linkFile: 'SLIDES/Jane%20J%C3%B3ias%20+/Link.txt'
  },
  {
    id: 'lavajato-tg',
    name: 'Lava Jato TG',
    logo: 'SLIDES/Lava%20Jato%20TG%20+/logo%20lava%20jato.jpeg',
    images: [
      'SLIDES/Lava%20Jato%20TG%20+/slide%201.jpeg',
      'SLIDES/Lava%20Jato%20TG%20+/slide%202.jpeg',
      'SLIDES/Lava%20Jato%20TG%20+/slide%203.jpeg'
    ],
    linkFile: 'SLIDES/Lava%20Jato%20TG%20+/Link.txt'
  },
  {
    id: 'ledulcis',
    name: 'Ledulcis Brigadeiria',
    logo: 'SLIDES/Ledulcis%20+/logo.jpeg',
    images: [
      'SLIDES/Ledulcis%20+/slide%201.png',
      'SLIDES/Ledulcis%20+/slide%202.png',
      'SLIDES/Ledulcis%20+/slide%203.png'
    ],
    linkFile: 'SLIDES/Ledulcis%20+/Link.txt'
  },
  {
    id: 'nachapa',
    name: 'Na Chapa',
    logo: 'SLIDES/Na%20Chapa/logo.jpeg',
    images: [
      'SLIDES/Na%20Chapa/slide%201.png',
      'SLIDES/Na%20Chapa/slide%202.png',
      'SLIDES/Na%20Chapa/slide%203.png'
    ],
    linkFile: 'SLIDES/Na%20Chapa/Link.txt'
  },
  {
    id: 'rogeriorelogio',
    name: 'Rogério Relógio',
    logo: 'SLIDES/Rog%C3%A9rio%20Rel%C3%B3gio/logo.jpeg',
    images: [
      'SLIDES/Rog%C3%A9rio%20Rel%C3%B3gio/logo.jpeg',
      'PATROCINADORES/banner%20rogerio%20relogio.png',
      'SLIDES/Rog%C3%A9rio%20Rel%C3%B3gio/logo.jpeg'
    ],
    linkFile: null
  },
  {
    id: 'virtu',
    name: 'Barbearia Virtu',
    logo: 'SLIDES/Barbearia%20Virtu+/logo.png',
    images: [
      'SLIDES/Barbearia%20Virtu+/slide%201.jpeg',
      'SLIDES/Barbearia%20Virtu+/slide%203.jpeg',
      'PATROCINADORES/banner%20virtu.png'
    ],
    linkFile: 'SLIDES/Barbearia%20Virtu+/link.txt'
  },
  {
    id: 'imperio',
    name: 'Império',
    logo: 'PATROCINADORES/imperio.png',
    images: [
      'PATROCINADORES/banner%20IMPERIO.png',
      'PATROCINADORES/banner%20IMPERIO.png',
      'PATROCINADORES/banner%20IMPERIO.png'
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
  var SLIDE_INTERVAL = 7000;
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

    var cardEl = targetLink ? document.createElement('a') : document.createElement('div');
    cardEl.className = 'sponsor-slidecase-card';
    if (targetLink) {
      cardEl.href = targetLink;
      cardEl.target = '_blank';
      cardEl.rel = 'noopener noreferrer';
    } else {
      cardEl.classList.add('no-link');
    }

    // ─── Logo / Nome do patrocinador (topo) ───
    var logoArea = document.createElement('div');
    logoArea.className = 'sponsor-logo-area';

    var logoImg = document.createElement('img');
    logoImg.src = sponsor.logo;
    logoImg.alt = 'Logo ' + sponsor.name;
    logoImg.loading = 'lazy';
    logoImg.className = 'sponsor-logo-img';
    logoArea.appendChild(logoImg);

    var logoName = document.createElement('span');
    logoName.className = 'sponsor-logo-name';
    logoName.textContent = sponsor.name;
    logoArea.appendChild(logoName);

    cardEl.appendChild(logoArea);

    // ─── Área do Slideshow (imagem adapta ao formato) ───
    var slideArea = document.createElement('div');
    slideArea.className = 'sponsor-slides-area';

    var slidesFiles = sponsor.images || [];
    var slideEls = [];
    for (var idx = 0; idx < slidesFiles.length; idx++) {
      var sImg = document.createElement('img');
      sImg.src = slidesFiles[idx];
      sImg.loading = 'lazy';
      sImg.alt = sponsor.name + ' - imagem ' + (idx + 1);
      sImg.className = 'sponsor-slide-img' + (idx === 0 ? ' active' : '');
      slideArea.appendChild(sImg);
      slideEls.push(sImg);
    }

    // Dots indicadores de slide
    var dotsWrap = document.createElement('div');
    dotsWrap.className = 'sponsor-slide-dots';
    var dotEls = [];
    for (var d = 0; d < slidesFiles.length; d++) {
      var dot = document.createElement('span');
      dot.className = 'sponsor-dot' + (d === 0 ? ' active' : '');
      dotsWrap.appendChild(dot);
      dotEls.push(dot);
    }
    slideArea.appendChild(dotsWrap);

    // Barra de progresso
    var progressBar = document.createElement('div');
    progressBar.className = 'sponsor-slide-progress';
    var progressFill = document.createElement('div');
    progressFill.className = 'sponsor-slide-progress-fill';
    progressBar.appendChild(progressFill);
    slideArea.appendChild(progressBar);

    cardEl.appendChild(slideArea);

    return { card: cardEl, slideEls: slideEls, dotEls: dotEls, progressFill: progressFill };
  }

  /**
   * Reinicia a barra de progresso para o slide atual.
   */
  function restartProgress() {
    if (!activeProgressFill) return;
    activeProgressFill.style.transition = 'none';
    activeProgressFill.style.width = '0%';
    void activeProgressFill.offsetWidth;
    if (isPlaying) {
      activeProgressFill.style.transition = 'width ' + SLIDE_INTERVAL + 'ms linear';
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
    if (timer) clearInterval(timer);
    timer = setInterval(function () {
      if (isPlaying) advance();
    }, SLIDE_INTERVAL);
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
