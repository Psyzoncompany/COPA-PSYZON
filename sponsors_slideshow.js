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
    logo: 'PATROCINADORES/banner ramos acai.png',
    images: [
      'SLIDES/Açaí Ramos +/Screenshot 2026-04-08 at 11-06-11 (7) Instagram.png',
      'SLIDES/Açaí Ramos +/Screenshot 2026-04-08 at 11-07-00 (7) Instagram.png',
      'SLIDES/Açaí Ramos +/Screenshot 2026-04-08 at 11-07-34 (7) Instagram.png'
    ],
    linkFile: 'SLIDES/Açaí Ramos +/Link.txt'
  },
  {
    id: 'bizuca',
    name: 'Bizuca Health & Academy',
    logo: 'PATROCINADORES/banner bizuca.png',
    images: [
      'PATROCINADORES/banner bizuca.png',
      'PATROCINADORES/banner bizuca.png',
      'PATROCINADORES/banner bizuca.png'
    ],
    linkFile: 'SLIDES/Bizuca Health & Academy/Link.txt'
  },
  {
    id: 'bruno-leite',
    name: 'Bruno Leite Assessoria Contábil',
    logo: 'SLIDES/Bruno Leite Assessoria Contábil/WhatsApp Image 2026-04-07 at 19.13.53.jpeg',
    images: [
      'SLIDES/Bruno Leite Assessoria Contábil/WhatsApp Image 2026-04-07 at 19.13.53.jpeg',
      'SLIDES/Bruno Leite Assessoria Contábil/WhatsApp Image 2026-04-07 at 19.14.07.jpeg',
      'SLIDES/Bruno Leite Assessoria Contábil/WhatsApp Image 2026-04-07 at 19.13.53.jpeg'
    ],
    linkFile: 'SLIDES/Bruno Leite Assessoria Contábil/Link.txt'
  },
  {
    id: 'central-bebidas',
    name: 'Central de Bebidas e Ancore Seguradora',
    logo: 'SLIDES/Central de Bebidas e Ancore Seguradora/WhatsApp Image 2026-04-08 at 09.00.09.jpeg',
    images: [
      'SLIDES/Central de Bebidas e Ancore Seguradora/WhatsApp Image 2026-04-08 at 09.00.09.jpeg',
      'SLIDES/Central de Bebidas e Ancore Seguradora/WhatsApp Image 2026-04-08 at 09.00.09 1.jpeg',
      'SLIDES/Central de Bebidas e Ancore Seguradora/WhatsApp Image 2026-04-08 at 09.00.09.jpeg'
    ],
    linkFile: null
  },
  {
    id: 'revitalize',
    name: 'Clínica Revitalize',
    logo: 'PATROCINADORES/banner revitalize.png',
    images: [
      'PATROCINADORES/banner revitalize.png',
      'PATROCINADORES/banner revitalize.png',
      'PATROCINADORES/banner revitalize.png'
    ],
    linkFile: 'SLIDES/Clinica Revitalize+/Link.txt'
  },
  {
    id: 'daby-gourmet',
    name: 'Daby Gourmet',
    logo: 'SLIDES/Daby Gourmet/WhatsApp Image 2026-04-08 at 14.44.18.jpeg',
    images: [
      'SLIDES/Daby Gourmet/WhatsApp Image 2026-04-08 at 14.44.18.jpeg',
      'SLIDES/Daby Gourmet/WhatsApp Image 2026-04-08 at 14.44.18.jpeg',
      'SLIDES/Daby Gourmet/WhatsApp Image 2026-04-08 at 14.44.18.jpeg'
    ],
    linkFile: null
  },
  {
    id: 'eburger',
    name: 'E-Burger',
    logo: 'SLIDES/E-Burger+/WhatsApp Image 2026-04-08 at 08.54.37.jpeg',
    images: [
      'SLIDES/E-Burger+/WhatsApp Image 2026-04-08 at 08.54.37.jpeg',
      'SLIDES/E-Burger+/WhatsApp Image 2026-04-08 at 08.54.37 (1).jpeg',
      'SLIDES/E-Burger+/WhatsApp Image 2026-04-08 at 08.54.37.jpeg'
    ],
    linkFile: 'SLIDES/E-Burger+/Link.txt'
  },
  {
    id: 'fagundes',
    name: 'Fagundes Distribuidora',
    logo: 'SLIDES/Fagundes Distribuidora/WhatsApp Image 2026-04-07 at 22.01.55.jpeg',
    images: [
      'SLIDES/Fagundes Distribuidora/WhatsApp Image 2026-04-07 at 22.01.55.jpeg',
      'SLIDES/Fagundes Distribuidora/WhatsApp Image 2026-04-07 at 22.01.54.jpeg',
      'SLIDES/Fagundes Distribuidora/WhatsApp Image 2026-04-07 at 22.01.55.jpeg'
    ],
    linkFile: 'SLIDES/Fagundes Distribuidora/Link.txt'
  },
  {
    id: 'giselle',
    name: 'Giselle Fest',
    logo: 'PATROCINADORES/banner giselle.png',
    images: [
      'SLIDES/Giselle Fest +/Screenshot 2026-04-08 at 10-41-32 (7) Instagram.png',
      'SLIDES/Giselle Fest +/Screenshot 2026-04-08 at 11-17-22 (7) Instagram.png',
      'SLIDES/Giselle Fest +/Screenshot 2026-04-08 at 11-21-26 (7) Instagram.png'
    ],
    linkFile: 'SLIDES/Giselle Fest +/Link.txt'
  },
  {
    id: 'gycake',
    name: 'GyCake',
    logo: 'SLIDES/GyCake +/Screenshot 2026-04-08 at 10-03-15 (7) Instagram.png',
    images: [
      'SLIDES/GyCake +/Screenshot 2026-04-08 at 10-02-54 (7) Instagram.png',
      'SLIDES/GyCake +/Screenshot 2026-04-08 at 10-03-15 (7) Instagram.png',
      'SLIDES/GyCake +/Screenshot 2026-04-08 at 10-03-21 (7) Instagram.png'
    ],
    linkFile: 'SLIDES/GyCake +/Link.txt'
  },
  {
    id: 'janejoias',
    name: 'Jane Jóias',
    logo: 'PATROCINADORES/banner jane joias.png',
    images: [
      'SLIDES/Jane Jóias +/Screenshot 2026-04-08 at 11-27-55 Stories • Instagram.png',
      'SLIDES/Jane Jóias +/Screenshot 2026-04-08 at 11-29-34 Stories • Instagram.png',
      'SLIDES/Jane Jóias +/Screenshot 2026-04-08 at 11-31-03 Stories • Instagram.png'
    ],
    linkFile: 'SLIDES/Jane Jóias +/Link.txt'
  },
  {
    id: 'lavajato-tg',
    name: 'Lava Jato TG',
    logo: 'SLIDES/Lava Jato TG +/WhatsApp Image 2026-04-08 at 07.59.15.jpeg',
    images: [
      'SLIDES/Lava Jato TG +/WhatsApp Image 2026-04-08 at 07.59.15.jpeg',
      'SLIDES/Lava Jato TG +/WhatsApp Image 2026-04-08 at 08.00.10.jpeg',
      'SLIDES/Lava Jato TG +/WhatsApp Image 2026-04-08 at 08.00.15.jpeg'
    ],
    linkFile: 'SLIDES/Lava Jato TG +/Link.txt'
  },
  {
    id: 'ledulcis',
    name: 'Ledulcis Brigadeiria',
    logo: 'SLIDES/Ledulcis +/Screenshot 2026-04-08 at 10-58-34 (7) Instagram.png',
    images: [
      'SLIDES/Ledulcis +/Screenshot 2026-04-08 at 10-58-34 (7) Instagram.png',
      'SLIDES/Ledulcis +/Screenshot 2026-04-08 at 10-58-51 (7) Instagram.png',
      'SLIDES/Ledulcis +/Screenshot 2026-04-08 at 10-59-02 (7) Instagram.png'
    ],
    linkFile: 'SLIDES/Ledulcis +/Link.txt'
  },
  {
    id: 'nachapa',
    name: 'Na Chapa',
    logo: 'PATROCINADORES/banner na chapa.png',
    images: [
      'SLIDES/Na Chapa/Screenshot 2026-04-08 at 09-23-37 Instagram.png',
      'SLIDES/Na Chapa/Screenshot 2026-04-08 at 09-25-07 (6) Instagram.png',
      'SLIDES/Na Chapa/Screenshot 2026-04-08 at 11-22-43 (7) Instagram.png'
    ],
    linkFile: 'SLIDES/Na Chapa/Link.txt'
  },
  {
    id: 'rogeriorelogio',
    name: 'Rogério Relógio',
    logo: 'PATROCINADORES/banner rogerio relogio.png',
    images: [
      'SLIDES/Rogério Relógio/WhatsApp Image 2026-04-03 at 17.05.34.jpeg',
      'PATROCINADORES/banner rogerio relogio.png',
      'SLIDES/Rogério Relógio/WhatsApp Image 2026-04-03 at 17.05.34.jpeg'
    ],
    linkFile: null
  },
  {
    id: 'virtu',
    name: 'Barbearia Virtu',
    logo: 'PATROCINADORES/banner virtu.png',
    images: [
      'SLIDES/Barbearia Virtu+/IMG_6324.JPG.jpeg',
      'SLIDES/Barbearia Virtu+/Logotipo Secúndaria - Negativo.png',
      'PATROCINADORES/banner virtu.png'
    ],
    linkFile: null
  }
];

document.addEventListener('DOMContentLoaded', () => {
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

  // Grid dos cards
  var grid = document.createElement('div');
  grid.className = 'sponsors-showcase-grid';
  container.appendChild(grid);

  for (var s = 0; s < sponsorsConfig.length; s++) {
    var sponsor = sponsorsConfig[s];
    var targetLink = '';

    // Lê o arquivo Link.txt do cliente para obter a URL
    if (sponsor.linkFile) {
      try {
        var response = await fetch(sponsor.linkFile);
        if (response.ok) {
          var text = await response.text();
          targetLink = extractFirstUrl(text);
        }
      } catch (e) {
        // Ignora erro (arquivo não encontrado) → segue sem link
      }
    }

    // Container do card: <a> se tem link, <div> se não
    var cardEl = targetLink ? document.createElement('a') : document.createElement('div');
    cardEl.className = 'sponsor-slidecase-card';
    if (targetLink) {
      cardEl.href = targetLink;
      cardEl.target = '_blank';
      cardEl.rel = 'noopener noreferrer';
    } else {
      cardEl.classList.add('no-link');
    }

    // ─── Logo Lateral (fixa, centralizada verticalmente) ───
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

    // ─── Área do Slideshow (ocupa todo espaço direito) ───
    var slideArea = document.createElement('div');
    slideArea.className = 'sponsor-slides-area';

    var slidesFiles = sponsor.images || [];
    var slideElements = [];

    for (var idx = 0; idx < slidesFiles.length; idx++) {
      var sImg = document.createElement('img');
      sImg.src = slidesFiles[idx];
      sImg.loading = 'lazy';
      sImg.alt = sponsor.name + ' - imagem ' + (idx + 1);
      sImg.className = 'sponsor-slide-img' + (idx === 0 ? ' active' : '');
      slideArea.appendChild(sImg);
      slideElements.push(sImg);
    }

    // Indicadores de slide (dots)
    var dotsWrap = document.createElement('div');
    dotsWrap.className = 'sponsor-slide-dots';
    var dotElements = [];
    for (var d = 0; d < slidesFiles.length; d++) {
      var dot = document.createElement('span');
      dot.className = 'sponsor-dot' + (d === 0 ? ' active' : '');
      dotsWrap.appendChild(dot);
      dotElements.push(dot);
    }
    slideArea.appendChild(dotsWrap);

    // Barra de progresso automático
    var progressBar = document.createElement('div');
    progressBar.className = 'sponsor-slide-progress';
    var progressFill = document.createElement('div');
    progressFill.className = 'sponsor-slide-progress-fill';
    progressBar.appendChild(progressFill);
    slideArea.appendChild(progressBar);

    // ─── Controles Manuais ───
    var controls = document.createElement('div');
    controls.className = 'sponsor-slide-controls';
    // Impede propagação do clique para o <a> pai
    controls.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
    });

    var btnPrev = document.createElement('button');
    btnPrev.className = 'sponsor-btn-control';
    btnPrev.setAttribute('aria-label', 'Voltar');
    btnPrev.innerHTML = '<span class="material-symbols-outlined">chevron_left</span>';

    var btnPlayPause = document.createElement('button');
    btnPlayPause.className = 'sponsor-btn-control';
    btnPlayPause.setAttribute('aria-label', 'Pausar / Retomar');
    btnPlayPause.title = 'Pausar / Retomar';
    btnPlayPause.innerHTML = '<span class="material-symbols-outlined">pause</span>';

    var btnNext = document.createElement('button');
    btnNext.className = 'sponsor-btn-control';
    btnNext.setAttribute('aria-label', 'Avançar');
    btnNext.innerHTML = '<span class="material-symbols-outlined">chevron_right</span>';

    controls.appendChild(btnPrev);
    controls.appendChild(btnPlayPause);
    controls.appendChild(btnNext);
    slideArea.appendChild(controls);

    cardEl.appendChild(slideArea);
    grid.appendChild(cardEl);

    // ─── Lógica do Slideshow individual por card ───
    (function(slideEls, dotEls, pFill, playPauseBtn) {
      var currentIndex = 0;
      var isPlaying = true;
      var timer = null;
      var SLIDE_INTERVAL = 7000;

      function renderSlide(index) {
        if (slideEls.length === 0) return;
        slideEls[currentIndex].classList.remove('active');
        if (dotEls[currentIndex]) dotEls[currentIndex].classList.remove('active');
        currentIndex = index;
        if (currentIndex >= slideEls.length) currentIndex = 0;
        if (currentIndex < 0) currentIndex = slideEls.length - 1;
        slideEls[currentIndex].classList.add('active');
        if (dotEls[currentIndex]) dotEls[currentIndex].classList.add('active');
        restartProgress();
      }

      function rotateNext() { renderSlide(currentIndex + 1); }
      function rotatePrev() { renderSlide(currentIndex - 1); }

      function restartProgress() {
        pFill.style.transition = 'none';
        pFill.style.width = '0%';
        // Force reflow
        void pFill.offsetWidth;
        if (isPlaying) {
          pFill.style.transition = 'width ' + SLIDE_INTERVAL + 'ms linear';
          pFill.style.width = '100%';
        }
      }

      function startAutoSlide() {
        if (timer) clearInterval(timer);
        timer = setInterval(function() {
          if (isPlaying) rotateNext();
        }, SLIDE_INTERVAL);
        restartProgress();
      }

      // Inicia rotação automática
      startAutoSlide();

      btnPrev.addEventListener('click', function() {
        rotatePrev();
        startAutoSlide();
      });

      btnNext.addEventListener('click', function() {
        rotateNext();
        startAutoSlide();
      });

      playPauseBtn.addEventListener('click', function() {
        isPlaying = !isPlaying;
        playPauseBtn.innerHTML = isPlaying
          ? '<span class="material-symbols-outlined">pause</span>'
          : '<span class="material-symbols-outlined">play_arrow</span>';
        if (isPlaying) {
          startAutoSlide();
        } else {
          pFill.style.width = getComputedStyle(pFill).width;
          pFill.style.transition = 'none';
        }
      });
    })(slideElements, dotElements, progressFill, btnPlayPause);
  }
}
