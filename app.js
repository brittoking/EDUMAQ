const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#menu');
const backdrop = document.querySelector('.menu-backdrop');
function setMenu(open) {
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  menu.classList.toggle('open', open);
  backdrop.hidden = !open;
}
function closeMenu() { setMenu(false); }
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
backdrop.addEventListener('click', closeMenu);
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { closeMenu(); toggle.focus(); }
});
document.addEventListener('focusin', event => {
  if (!menu.contains(event.target) && !toggle.contains(event.target)) closeMenu();
});
const mobileLayout = window.matchMedia('(max-width: 760px)');
mobileLayout.addEventListener('change', closeMenu);
document.querySelectorAll('[data-equipment]').forEach(link => link.addEventListener('click', () => { document.querySelector('#equipment').value = link.dataset.equipment; document.querySelector('#service').value = link.dataset.service || 'Manutenção ou reparo'; }));
function buildQuote(data) {
  return `Olá, EDUMAQ! Gostaria de solicitar atendimento.\n\nNome: ${data.nome.trim()}\nCidade e bairro: ${data.local.trim()}\nEquipamento: ${data.equipamento}\nServiço: ${data.servico}${data.mensagem.trim() ? '\nDetalhes: ' + data.mensagem.trim() : ''}\n\nPodemos conversar sobre a disponibilidade e o orçamento?`;
}
document.querySelector('#quote-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  for (const name of ['nome', 'local']) { const input = form.elements.namedItem(name); if (!input.value.trim()) { input.setCustomValidity('Preencha este campo.'); input.reportValidity(); input.addEventListener('input', () => input.setCustomValidity(''), {once:true}); return; } }
  if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form));
  window.location.assign('https://wa.me/5514991818212?text=' + encodeURIComponent(buildQuote(data)));
});
document.querySelector('#year').textContent = new Date().getFullYear();

// Keep the contact bar out of the way while the quote form is being used.
const quoteForm = document.querySelector('#quote-form');
let formVisible = false;
function updateQuickbar() {
  document.body.classList.toggle('quickbar-hidden', formVisible || quoteForm.contains(document.activeElement));
}
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    formVisible = entries[0].isIntersecting;
    updateQuickbar();
  }, { threshold: 0 });
  observer.observe(quoteForm);
}
quoteForm.addEventListener('focusin', updateQuickbar);
quoteForm.addEventListener('focusout', () => window.setTimeout(updateQuickbar, 0));
