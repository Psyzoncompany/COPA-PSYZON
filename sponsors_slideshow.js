/**
 * Sponsors Slideshow Logic — Sequential Display
 * Exibe UM patrocinador por vez na aba de Chaveamento.
 * Cada imagem = 7s. Após as 3 imagens do cliente → próximo cliente.
 * O card se adapta ao formato da foto (object-fit: contain, height: auto).
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

document.addEventListener('DOMContentLoaded', function() {
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

  var SLIDE_DURATION = 7000; // 7s por imagem

  // ── Título da seção ──
  var sectionTitle = document.createElement('h3');
  sectionTitle.className = 'sponsors-showcase-title';
  sectionTitle.textContent = 'PATROCINADORES';
  container.appendChild(sectionTitle);

  // ── Palco (exibe 1 card por vez) ──
  var stage = document.createElement('div');
  stage.className = 'sponsors-stage';
  container.appendChild(stage);

  // ── Dots de navegação entre patrocinadores ──
  var sponsorNav = document.createElement('div');
  sponsorNav.className = 'sponsor-nav-dots';
  container.appendChild(sponsorNav);

  // ── Carrega links em paralelo ──
  var links = await Promise.all(sponsorsConfig.map(function(s) {
    if (!s.linkFile) return Promise.resolve('');
    return fetch(s.linkFile)
      .then(function(r) { return r.ok ? r.text() : ''; })
      .then(function(t) { return extractFirstUrl(t); })
      .catch(function() { return ''; });
  }));

  // ── Estruturas por card ──
  var cards = [];
  var cardImgEls = [];      // [sponsorIdx][imgIdx] → <img>
  var cardImgDotEls = [];   // [sponsorIdx][dotIdx] → <span>
  var cardProgressFills = []; // [sponsorIdx] → <div> (barra de progresso)
  var sponsorDotEls = [];   // [sponsorIdx] → <span> (dot de navegação)

  // ── Constrói todos os cards ──
  for (var i = 0; i < sponsorsConfig.length; i++) {
    var s = sponsorsConfig[i];
    var link = links[i];

    // Card: <a> se tem link, <div> se não
    var card = document.createElement(link ? 'a' : 'div');
    card.className = 'sponsor-showcase-card';
    if (link) {
      card.href = link;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
    }
    // Esconde todos; apenas o ativo será exibido pelo motor
    card.style.display = 'none';
    stage.appendChild(card);
    cards.push(card);

    // ── Área de slides (imagens) ──
    var slidesArea = document.createElement('div');
    slidesArea.className = 'sponsor-slides-area';
    card.appendChild(slidesArea);

    var files = s.images || [];
    var imgs = [];
    for (var j = 0; j < files.length; j++) {
      var img = document.createElement('img');
      img.src = files[j];
      img.alt = s.name + ' - imagem ' + (j + 1);
      img.className = 'sponsor-slide-img';
      img.loading = 'lazy';
      slidesArea.appendChild(img);
      imgs.push(img);
    }
    cardImgEls.push(imgs);

    // Dots de imagem
    var imageDots = document.createElement('div');
    imageDots.className = 'sponsor-image-dots';
    var imgDotArr = [];
    for (var d = 0; d < files.length; d++) {
      var dot = document.createElement('span');
      dot.className = 'sponsor-dot';
      imageDots.appendChild(dot);
      imgDotArr.push(dot);
    }
    slidesArea.appendChild(imageDots);
    cardImgDotEls.push(imgDotArr);

    // Barra de progresso
    var progressBar = document.createElement('div');
    progressBar.className = 'sponsor-slide-progress';
    var progressFill = document.createElement('div');
    progressFill.className = 'sponsor-slide-progress-fill';
    progressBar.appendChild(progressFill);
    slidesArea.appendChild(progressBar);
    cardProgressFills.push(progressFill);

    // ── Rodapé: logo + nome + controles ──
    var footer = document.createElement('div');
    footer.className = 'sponsor-card-footer';

    var logoWrap = document.createElement('div');
    logoWrap.className = 'sponsor-card-logo-wrap';

    var logoImg = document.createElement('img');
    logoImg.src = s.logo;
    logoImg.alt = 'Logo ' + s.name;
    logoImg.className = 'sponsor-card-logo';
    logoImg.loading = 'lazy';

    var nameEl = document.createElement('span');
    nameEl.className = 'sponsor-card-name';
    nameEl.textContent = s.name;

    logoWrap.appendChild(logoImg);
    logoWrap.appendChild(nameEl);
    footer.appendChild(logoWrap);

    // Controles manuais
    var controls = document.createElement('div');
    controls.className = 'sponsor-card-controls';
    controls.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
    });

    var btnPrev = document.createElement('button');
    btnPrev.className = 'sponsor-btn-ctrl';
    btnPrev.setAttribute('aria-label', 'Imagem anterior');
    btnPrev.innerHTML = '<span class="material-symbols-outlined">chevron_left</span>';

    var btnPause = document.createElement('button');
    btnPause.className = 'sponsor-btn-ctrl sponsor-btn-pause';
    btnPause.setAttribute('aria-label', 'Pausar / Retomar');
    btnPause.innerHTML = '<span class="material-symbols-outlined">pause</span>';

    var btnNext = document.createElement('button');
    btnNext.className = 'sponsor-btn-ctrl';
    btnNext.setAttribute('aria-label', 'Próxima imagem');
    btnNext.innerHTML = '<span class="material-symbols-outlined">chevron_right</span>';

    controls.appendChild(btnPrev);
    controls.appendChild(btnPause);
    controls.appendChild(btnNext);
    footer.appendChild(controls);

    card.appendChild(footer);

    // Dot de navegação de patrocinador
    var navDot = document.createElement('span');
    navDot.className = 'sponsor-nav-dot';
    navDot.title = s.name;
    sponsorNav.appendChild(navDot);
    sponsorDotEls.push(navDot);
  }

  // ══════════════════════════════════════════
  //  MOTOR DO SLIDESHOW SEQUENCIAL
  // ══════════════════════════════════════════
  var currentSponsor = 0;
  var currentImage = 0;
  var isPlaying = true;
  var timer = null;
  var locked = false; // Impede transições simultâneas

  function setImageActive(sIdx, iIdx) {
    var imgs = cardImgEls[sIdx];
    var dots = cardImgDotEls[sIdx];
    for (var i = 0; i < imgs.length; i++) {
      imgs[i].classList.toggle('active', i === iIdx);
      if (dots[i]) dots[i].classList.toggle('active', i === iIdx);
    }
  }

  function setNavDot(sIdx) {
    for (var i = 0; i < sponsorDotEls.length; i++) {
      sponsorDotEls[i].classList.toggle('active', i === sIdx);
    }
  }

  function startProgress(fill) {
    fill.style.transition = 'none';
    fill.style.width = '0%';
    void fill.offsetWidth; // force reflow so transition reset is applied before next transition starts
    fill.style.transition = 'width ' + SLIDE_DURATION + 'ms linear';
    fill.style.width = '100%';
  }

  function stopProgress(fill) {
    fill.style.width = getComputedStyle(fill).width;
    fill.style.transition = 'none';
  }

  function resetProgress(fill) {
    fill.style.transition = 'none';
    fill.style.width = '0%';
  }

  function showCurrentImage() {
    setImageActive(currentSponsor, currentImage);
    if (isPlaying) startProgress(cardProgressFills[currentSponsor]);
  }

  function scheduleNext() {
    clearTimeout(timer);
    timer = setTimeout(function() {
      if (isPlaying && !locked) advance();
    }, SLIDE_DURATION);
  }

  function advance() {
    var totalImages = (sponsorsConfig[currentSponsor].images || []).length;
    if (currentImage + 1 < totalImages) {
      // Próxima imagem do mesmo patrocinador
      currentImage++;
      showCurrentImage();
      scheduleNext();
    } else {
      // Próximo patrocinador
      var next = (currentSponsor + 1) % sponsorsConfig.length;
      switchSponsor(next);
    }
  }

  function switchSponsor(newIdx) {
    if (locked) return;
    locked = true;
    clearTimeout(timer);

    var oldCard = cards[currentSponsor];
    var oldFill = cardProgressFills[currentSponsor];
    stopProgress(oldFill);

    // Anima saída do card atual
    oldCard.classList.add('sponsor-card-exit');

    setTimeout(function() {
      // Oculta card antigo e reseta seu estado interno
      oldCard.classList.remove('sponsor-card-exit');
      oldCard.style.display = 'none';
      setImageActive(currentSponsor, 0);
      resetProgress(cardProgressFills[currentSponsor]);

      // Atualiza estado global
      currentSponsor = newIdx;
      currentImage = 0;
      setNavDot(newIdx);

      // Atualiza botão de pause dos controles
      var btns = cards[newIdx].querySelectorAll('.sponsor-btn-pause');
      if (btns.length > 0) {
        btns[0].innerHTML = isPlaying
          ? '<span class="material-symbols-outlined">pause</span>'
          : '<span class="material-symbols-outlined">play_arrow</span>';
      }

      // Mostra novo card com animação de entrada
      var newCard = cards[newIdx];
      newCard.style.display = 'flex';
      void newCard.offsetWidth; // force reflow so display change is processed before the enter animation starts
      newCard.classList.add('sponsor-card-enter');

      setTimeout(function() {
        newCard.classList.remove('sponsor-card-enter');
        locked = false;
        setImageActive(currentSponsor, 0);
        if (isPlaying) {
          startProgress(cardProgressFills[currentSponsor]);
          scheduleNext();
        }
      }, 50);
    }, 500);
  }

  // ── Conecta controles de cada card ──
  for (var ci = 0; ci < cards.length; ci++) {
    (function(idx) {
      var card = cards[idx];
      var allCtrl = card.querySelectorAll('.sponsor-btn-ctrl');
      var bPrev  = allCtrl[0];
      var bPause = allCtrl[1];
      var bNext  = allCtrl[2];

      bPrev.addEventListener('click', function() {
        if (locked || idx !== currentSponsor) return;
        clearTimeout(timer);
        var prev = currentImage - 1;
        if (prev < 0) prev = (sponsorsConfig[currentSponsor].images || []).length - 1;
        currentImage = prev;
        showCurrentImage();
        if (isPlaying) scheduleNext();
      });

      bNext.addEventListener('click', function() {
        if (locked || idx !== currentSponsor) return;
        clearTimeout(timer);
        advance();
      });

      bPause.addEventListener('click', function() {
        if (idx !== currentSponsor) return;
        isPlaying = !isPlaying;
        bPause.innerHTML = isPlaying
          ? '<span class="material-symbols-outlined">pause</span>'
          : '<span class="material-symbols-outlined">play_arrow</span>';
        if (isPlaying) {
          startProgress(cardProgressFills[currentSponsor]);
          scheduleNext();
        } else {
          stopProgress(cardProgressFills[currentSponsor]);
          clearTimeout(timer);
        }
      });

      sponsorDotEls[idx].addEventListener('click', function() {
        if (idx === currentSponsor || locked) return;
        switchSponsor(idx);
      });
    })(ci);
  }

  // ── Inicia com o primeiro patrocinador ──
  cards[0].style.display = 'flex';
  setNavDot(0);
  setImageActive(0, 0);
  if (isPlaying) {
    startProgress(cardProgressFills[0]);
    scheduleNext();
  }
}
