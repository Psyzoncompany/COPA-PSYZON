/**
 * Sponsors Slideshow Logic
 * Exibe logos e slideshows para clientes na aba de Chaveamento.
 */

const sponsorsConfig = [
  {
    id: 'bizuca',
    name: 'Bizuca',
    logo: 'PATROCINADORES/banner bizuca.png',
    images: [
      'PATROCINADORES/banner bizuca.png',
      'PATROCINADORES/banner bizuca.png',
      'PATROCINADORES/banner bizuca.png'
    ],
    txtLinkUrl: 'PATROCINADORES/link_bizuca.txt'
  },
  {
    id: 'giselle',
    name: 'Giselle',
    logo: 'PATROCINADORES/banner giselle.png',
    images: [
      'PATROCINADORES/banner giselle.png',
      'PATROCINADORES/banner giselle.png',
      'PATROCINADORES/banner giselle.png'
    ],
    txtLinkUrl: 'PATROCINADORES/link_giselle.txt'
  },
  {
    id: 'janejoias',
    name: 'Jane Joias',
    logo: 'PATROCINADORES/banner jane joias.png',
    images: [
      'PATROCINADORES/banner jane joias.png',
      'PATROCINADORES/banner jane joias.png',
      'PATROCINADORES/banner jane joias.png'
    ],
    txtLinkUrl: 'PATROCINADORES/link_janejoias.txt'
  },
  {
    id: 'nachapa',
    name: 'Na Chapa',
    logo: 'PATROCINADORES/banner na chapa.png',
    images: [
      'PATROCINADORES/banner na chapa.png',
      'PATROCINADORES/banner na chapa.png',
      'PATROCINADORES/banner na chapa.png'
    ],
    txtLinkUrl: 'PATROCINADORES/link_nachapa.txt'
  },
  {
    id: 'ramosacai',
    name: 'Ramos Açai',
    logo: 'PATROCINADORES/banner ramos acai.png',
    images: [
      'PATROCINADORES/banner ramos acai.png',
      'PATROCINADORES/banner ramos acai.png',
      'PATROCINADORES/banner ramos acai.png'
    ],
    txtLinkUrl: 'PATROCINADORES/link_ramosacai.txt'
  },
  {
    id: 'revitalize',
    name: 'Revitalize',
    logo: 'PATROCINADORES/banner revitalize.png',
    images: [
      'PATROCINADORES/banner revitalize.png',
      'PATROCINADORES/banner revitalize.png',
      'PATROCINADORES/banner revitalize.png'
    ],
    txtLinkUrl: 'PATROCINADORES/link_revitalize.txt'
  },
  {
    id: 'rogeriorelogio',
    name: 'Rogerio Relogio',
    logo: 'PATROCINADORES/banner rogerio relogio.png',
    images: [
      'PATROCINADORES/banner rogerio relogio.png',
      'PATROCINADORES/banner rogerio relogio.png',
      'PATROCINADORES/banner rogerio relogio.png'
    ],
    txtLinkUrl: 'PATROCINADORES/link_rogeriorelogio.txt'
  },
  {
    id: 'virtu',
    name: 'Virtu',
    logo: 'PATROCINADORES/banner virtu.png',
    images: [
      'PATROCINADORES/banner virtu.png',
      'PATROCINADORES/banner virtu.png',
      'PATROCINADORES/banner virtu.png'
    ],
    txtLinkUrl: 'PATROCINADORES/link_virtu.txt'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initSponsorsShowcase();
});

async function initSponsorsShowcase() {
  const container = document.getElementById('bracket-sponsors-showcase');
  if (!container) return;

  for (const sponsor of sponsorsConfig) {
    let targetLink = '';
    
    // Tenta carregar o arquivo .txt para o link
    if (sponsor.txtLinkUrl) {
      try {
        const response = await fetch(sponsor.txtLinkUrl);
        if (response.ok) {
          const text = await response.text();
          if (text && text.trim().startsWith('http')) {
            targetLink = text.trim();
          }
        }
      } catch (e) {
        // Ignora caso erro(arquivo nao criado) -> segue sem link
      }
    }

    // Container do card
    const cardEl = targetLink ? document.createElement('a') : document.createElement('div');
    cardEl.className = 'sponsor-slidecase-card';
    if (targetLink) {
      cardEl.href = targetLink;
      cardEl.target = '_blank';
      cardEl.rel = 'noopener noreferrer';
    } else {
      cardEl.classList.add('no-link');
    }

    // Logo Lateral
    const logoArea = document.createElement('div');
    logoArea.className = 'sponsor-logo-area';
    const logoImg = document.createElement('img');
    logoImg.src = sponsor.logo;
    logoImg.alt = `Logo ${sponsor.name}`;
    logoImg.loading = 'lazy';
    logoImg.className = 'sponsor-logo-img';
    logoArea.appendChild(logoImg);
    cardEl.appendChild(logoArea);

    // Area do Slideshow
    const slideArea = document.createElement('div');
    slideArea.className = 'sponsor-slides-area';

    let slidesFiles = sponsor.images || [];
    let slideElements = [];

    slidesFiles.forEach((src, idx) => {
      const sImg = document.createElement('img');
      sImg.src = src;
      sImg.loading = 'lazy';
      sImg.className = `sponsor-slide-img ${idx === 0 ? 'active' : ''}`;
      slideArea.appendChild(sImg);
      slideElements.push(sImg);
    });

    // Controles Manuais
    const controls = document.createElement('div');
    controls.className = 'sponsor-slide-controls';
    // Se for link, nao propaga o clique dos botoes para a tag <a> pai
    controls.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
    });

    const btnPrev = document.createElement('button');
    btnPrev.className = 'sponsor-btn-control';
    btnPrev.innerHTML = '<span class="material-symbols-outlined">chevron_left</span>';

    const btnPlayPause = document.createElement('button');
    btnPlayPause.className = 'sponsor-btn-control';
    btnPlayPause.innerHTML = '<span class="material-symbols-outlined">pause</span>';
    btnPlayPause.title = "Pausar / Retomar";

    const btnNext = document.createElement('button');
    btnNext.className = 'sponsor-btn-control';
    btnNext.innerHTML = '<span class="material-symbols-outlined">chevron_right</span>';

    controls.appendChild(btnPrev);
    controls.appendChild(btnPlayPause);
    controls.appendChild(btnNext);
    slideArea.appendChild(controls);

    cardEl.appendChild(slideArea);
    container.appendChild(cardEl);

    // Lógica do Slideshow individual por card
    let currentIndex = 0;
    let isPlaying = true;
    let timer = null;

    function renderSlide(index) {
      if(slideElements.length === 0) return;
      slideElements[currentIndex].classList.remove('active');
      currentIndex = index;
      if (currentIndex >= slideElements.length) currentIndex = 0;
      if (currentIndex < 0) currentIndex = slideElements.length - 1;
      slideElements[currentIndex].classList.add('active');
    }

    function rotateNext() {
      renderSlide(currentIndex + 1);
    }

    function rotatePrev() {
      renderSlide(currentIndex - 1);
    }

    function startAutoSlide() {
      if (timer) clearInterval(timer);
      timer = setInterval(() => {
        if (isPlaying) {
          rotateNext();
        }
      }, 7000); // 7s como solicitado
    }

    // Inicia rotação
    startAutoSlide();

    // Eventos 
    btnPrev.addEventListener('click', () => {
      rotatePrev();
      startAutoSlide(); // Reinicia contador
    });

    btnNext.addEventListener('click', () => {
      rotateNext();
      startAutoSlide(); // Reinicia contador
    });

    btnPlayPause.addEventListener('click', () => {
      isPlaying = !isPlaying;
      btnPlayPause.innerHTML = isPlaying
        ? '<span class="material-symbols-outlined">pause</span>'
        : '<span class="material-symbols-outlined">play_arrow</span>';
    });
  }
}
