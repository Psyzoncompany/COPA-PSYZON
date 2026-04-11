/**
 * common.js - Lógica global para componentes repetitivos
 */

const globalSponsorsHTML = `
  <div class="sponsors-card">
    <h3 class="sponsors-title">PATROCINADORES</h3>
    <div class="sponsors-grid">
      <a href="https://www.instagram.com/rogerio_relogio03/" target="_blank" class="sponsor-placeholder"><img src="PATROCINADORES/banner rogerio relogio.png" alt="Sponsor ROGERIO"></a>
      <a href="https://www.instagram.com/jane_joiasoficial/" target="_blank" class="sponsor-placeholder"><img src="PATROCINADORES/banner jane joias.png" alt="Sponsor JANE JOIAS"></a>
      <a href="https://sites.appbarber.com.br/links/maxbarbearia-h2wb" target="_blank" class="sponsor-placeholder"><img src="PATROCINADORES/banner virtu.png" alt="Sponsor VIRTU BARBEARIA"></a>
      <a href="https://www.instagram.com/trailer_nachapa" target="_blank" class="sponsor-placeholder"><img src="PATROCINADORES/banner na chapa.png" alt="Sponsor NA CHAPA"></a>
      <a href="https://www.instagram.com/clinica_revitalize_itarantim" target="_blank" class="sponsor-placeholder"><img src="PATROCINADORES/banner revitalize.png" alt="Sponsor REVITALIZE"></a>
      <a href="https://www.instagram.com/ramos_acai_" target="_blank" class="sponsor-placeholder"><img src="PATROCINADORES/banner ramos acai.png" alt="Sponsor RAMOS AÇAI"></a>
      <a href="https://www.instagram.com/bizucahealthacademy" target="_blank" class="sponsor-placeholder"><img src="PATROCINADORES/banner bizuca.png" alt="Sponsor BIZUCA HEALTH ACADEMY"></a>
      <a href="https://www.instagram.com/chef_giselle_oliveira" target="_blank" class="sponsor-placeholder"><img src="PATROCINADORES/banner giselle.png" alt="Sponsor GISELLE FEST"></a>
      <a href="https://www.instagram.com/ledulcis.brigadeiria/" target="_blank" class="sponsor-placeholder"><img src="PATROCINADORES/L%C3%AA%20Dulcis.png" alt="Sponsor LEDULCIS"></a>
      <a href="https://www.instagram.com/brunoleite.contador/" target="_blank" class="sponsor-placeholder"><img src="SLIDES/Bruno%20Leite%20Assessoria%20Cont%C3%A1bil/logo.jpeg" alt="Sponsor BRUNO LEITE"></a>
      <div class="sponsor-placeholder"><img src="PATROCINADORES/central%20atacatista.png" alt="Sponsor CENTRAL DE BEBIDAS"></div>
      <div class="sponsor-placeholder"><img src="PATROCINADORES/daby%20gourmet.png" alt="Sponsor DABY GOURMET"></div>
      <a href="https://www.instagram.com/e.burguer_" target="_blank" class="sponsor-placeholder"><img src="SLIDES/E-Burger+/slide%201.jpeg" alt="Sponsor E-BURGER"></a>
      <a href="https://www.instagram.com/fagundes_distribuidora/" target="_blank" class="sponsor-placeholder"><img src="PATROCINADORES/fagundes.png" alt="Sponsor FAGUNDES DISTRIBUIDORA"></a>
      <a href="https://www.instagram.com/gycake/" target="_blank" class="sponsor-placeholder"><img src="PATROCINADORES/gy%20cake.png" alt="Sponsor GYCAKE"></a>
      <a href="https://www.instagram.com/tg_lava_jato/" target="_blank" class="sponsor-placeholder"><img src="PATROCINADORES/lava%20jato%20tg.png" alt="Sponsor LAVA JATO TG"></a>
      <div class="sponsor-placeholder"><img src="PATROCINADORES/banner%20IMPERIO.png" alt="Sponsor IMPERIO"></div>
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
