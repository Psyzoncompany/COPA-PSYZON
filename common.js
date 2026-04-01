/**
 * common.js - Lógica global para componentes repetitivos
 */

const globalSponsorsHTML = `
  <div class="sponsors-card">
    <h3 class="sponsors-title">PATROCINADORES</h3>
    <div class="sponsors-grid">
      <a href="https://www.instagram.com/rogerio_relogio03/" target="_blank" class="sponsor-placeholder"><img src="PATROCINADORES/ROGERIO.svg" alt="Sponsor ROGERIO"></a>
      <a href="https://www.instagram.com/jane_joiasoficial/" target="_blank" class="sponsor-placeholder"><img src="PATROCINADORES/JANE JOIAS.png" alt="Sponsor JANE JOIAS"></a>
      <a href="https://sites.appbarber.com.br/links/maxbarbearia-h2wb" target="_blank" class="sponsor-placeholder"><img src="PATROCINADORES/virtu barbearia.png" alt="Sponsor VIRTU BARBEARIA"></a>
      <div class="sponsor-placeholder">Logo Parceiro</div>
    </div>
  </div>
`;

function injectGlobalComponents() {
  // Injetar Patrocinadores
  const sponsorsWrappers = document.querySelectorAll('.sponsors-wrapper');
  sponsorsWrappers.forEach(wrapper => {
    if (!wrapper.innerHTML.trim()) {
      wrapper.innerHTML = globalSponsorsHTML;
    }
  });
}

// Executar ao carregar o DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectGlobalComponents);
} else {
  injectGlobalComponents();
}
