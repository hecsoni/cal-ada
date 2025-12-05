// Menu hamburguer
const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.menu');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = menu.style.display === 'flex';
    menu.style.display = isOpen ? 'none' : 'flex';
    menu.style.flexDirection = 'column';
    menu.style.gap = '12px';
    hamburger.setAttribute('aria-expanded', (!isOpen).toString());
  });
}

// Ano dinâmico
document.getElementById('year').textContent = new Date().getFullYear().toString();

// Scroll reveal básico
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal-up, .card, .masonry__item').forEach(el => observer.observe(el));

// Botão de voltar ao topo
const scrollTopBtn = document.querySelector('.scroll-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 320){
    scrollTopBtn.classList.add('show');
    whatsappToggle(true);
  } else {
    scrollTopBtn.classList.remove('show');
    whatsappToggle(false);
  }
});
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

// Parallax leve na imagem do hero
const heroImg = document.querySelector('.hero__media img');
window.addEventListener('scroll', () => {
  if (!heroImg) return;
  const y = window.scrollY * 0.05;
  heroImg.style.transform = `translateY(${Math.min(20, y)}px)`;
});

// Validação simples do formulário
const form = document.getElementById('form-orcamento');
const successEl = document.querySelector('.form__success');

function setError(id, msg){
  const el = document.querySelector(`.error[data-for="${id}"]`);
  if (el) el.textContent = msg || '';
}
function validateEmail(value){
  if (!value) return true; // email opcional
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function getSelectedText(sel){
  return sel?.options?.[sel.selectedIndex]?.text || '';
}

if (form){
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = form.nome.value.trim();
    const telefone = form.telefone.value.trim();
    const email = form.email.value.trim();
    const servico = getSelectedText(form.servico);
    const mensagem = form.mensagem.value.trim();

    let ok = true;
    setError('nome',''); setError('telefone',''); setError('email','');

    if (!nome){ setError('nome','Por favor, informe seu nome.'); ok=false; }
    if (!telefone){ setError('telefone','Informe um número para contato.'); ok=false; }
    if (!validateEmail(email)){ setError('email','Digite um e-mail válido.'); ok=false; }

    if (!ok) return;

    // Simulação de envio
    successEl.textContent = 'Obrigado! Recebemos seus dados e entraremos em contato.';
    form.reset();

    // Event tracking básico (substitua por GA/Pixel se desejar)
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'form_submit',
      form_name: 'orcamento',
      service_selected: servico,
      message_length: mensagem.length
    });

    // Integração futura:
    // fetch('/api/orcamento', { method:'POST', body: new FormData(form) });
  });
}

// WhatsApp float + tracking
const waFloat = document.getElementById('whatsapp-float');
function whatsappToggle(show){
  if (!waFloat) return;
  waFloat.classList.toggle('show', !!show);
}
// Mostrar o botão após pequeno atraso (UX) e em scroll > 320px (acima).
setTimeout(() => whatsappToggle(window.scrollY > 320), 1200);

if (waFloat){
  waFloat.addEventListener('click', () => {
    // Tracking
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'whatsapp_click',
      location: 'float_button'
    });
  });
}