/**
 * common.js - Lógica global para componentes repetitivos
 */

const globalSponsorsHTML = `
  <div class="sponsors-card">
    <h3 class="sponsors-title">PATROCINADORES</h3>
    <div class="sponsors-grid">
      <a href="https://www.instagram.com/ramos_acai_/" target="_blank" class="sponsor-placeholder"><img src="PATROCINADORES/banner ramos acai.png" alt="Sponsor AÇAÍ RAMOS"></a>
      <a href="https://www.instagram.com/barbeariavirtu_/" target="_blank" class="sponsor-placeholder"><img src="PATROCINADORES/banner virtu.png" alt="Sponsor BARBEARIA VIRTU"></a>
      <div class="sponsor-placeholder"><img src="PATROCINADORES/BIEL%20MOTOS.png" alt="Sponsor BIEL MOTOS"></div>
      <a href="https://www.instagram.com/bizucahealthacademy/" target="_blank" class="sponsor-placeholder"><img src="PATROCINADORES/banner bizuca.png" alt="Sponsor BIZUCA HEALTH ACADEMY"></a>
      <a href="https://www.instagram.com/brunoleite.contador/" target="_blank" class="sponsor-placeholder"><img src="PATROCINADORES/BRUNO%20LEITE.png" alt="Sponsor BRUNO LEITE"></a>
      <div class="sponsor-placeholder"><img src="PATROCINADORES/CAROL%20ROCHA.png" alt="Sponsor CAROL HOME"></div>
      <div class="sponsor-placeholder"><img src="PATROCINADORES/CENTRAL%20ATACADISTA.png" alt="Sponsor CENTRAL DE BEBIDAS"></div>
      <a href="https://www.instagram.com/clinica_revitalize_itarantim/" target="_blank" class="sponsor-placeholder"><img src="PATROCINADORES/banner revitalize.png" alt="Sponsor CLÍNICA REVITALIZE"></a>
      <div class="sponsor-placeholder"><img src="PATROCINADORES/daby%20gourmet.png" alt="Sponsor DABY GOURMET"></div>
      <a href="https://www.instagram.com/e.burguer_" target="_blank" class="sponsor-placeholder"><img src="PATROCINADORES/E-BURGUER.png" alt="Sponsor E-BURGER"></a>
      <a href="https://www.instagram.com/fagundes_distribuidora/" target="_blank" class="sponsor-placeholder"><img src="PATROCINADORES/fagundes.png" alt="Sponsor FAGUNDES DISTRIBUIDORA"></a>
      <a href="https://www.instagram.com/chef_giselle_oliveira/" target="_blank" class="sponsor-placeholder"><img src="PATROCINADORES/banner giselle.png" alt="Sponsor GISELLE FEST"></a>
      <div class="sponsor-placeholder"><img src="PATROCINADORES/GUSM%C3%83O%20MODAS.png" alt="Sponsor GUSMÃO MODAS"></div>
      <div class="sponsor-placeholder"><img src="PATROCINADORES/imperio.png" alt="Sponsor IMPÉRIO MRS"></div>
      <a href="https://www.instagram.com/jane_joiasoficial/" target="_blank" class="sponsor-placeholder"><img src="PATROCINADORES/banner jane joias.png" alt="Sponsor JANE JÓIAS"></a>
      <a href="https://www.instagram.com/tg_lava_jato/" target="_blank" class="sponsor-placeholder"><img src="PATROCINADORES/lava%20jato%20tg.png" alt="Sponsor LAVA JATO TG"></a>
      <a href="https://www.instagram.com/ledulcis.brigadeiria/" target="_blank" class="sponsor-placeholder"><img src="PATROCINADORES/L%C3%AA%20Dulcis.png" alt="Sponsor LÊ DULCIS"></a>
      <a href="https://www.instagram.com/trailer_nachapa/" target="_blank" class="sponsor-placeholder"><img src="PATROCINADORES/banner na chapa.png" alt="Sponsor NA CHAPA"></a>
      <a href="https://www.instagram.com/presencialtecnologia/" target="_blank" class="sponsor-placeholder"><img src="PATROCINADORES/PRECENSIAL.png" alt="Sponsor PRESENCIAL TECNOLOGIA"></a>
      <a href="https://www.instagram.com/rogerio_relogio03/" target="_blank" class="sponsor-placeholder"><img src="PATROCINADORES/banner rogerio relogio.png" alt="Sponsor ROGÉRIO RELÓGIO"></a>
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
