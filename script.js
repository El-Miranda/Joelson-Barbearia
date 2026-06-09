// ── SLIDER ──────────────────────────────────────────
const slides = document.querySelectorAll('.slide');
const dots   = document.querySelectorAll('.dot');
let current  = 0;
let autoTimer;

function goTo(idx) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (idx + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}

function startAuto() {
  autoTimer = setInterval(() => goTo(current + 1), 5000);
}

document.getElementById('prevSlide').addEventListener('click', () => {
  clearInterval(autoTimer); goTo(current - 1); startAuto();
});
document.getElementById('nextSlide').addEventListener('click', () => {
  clearInterval(autoTimer); goTo(current + 1); startAuto();
});
dots.forEach(d => d.addEventListener('click', () => {
  clearInterval(autoTimer); goTo(+d.dataset.idx); startAuto();
}));
startAuto();

// ── SCROLL REVEAL ────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const observer  = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

// ── NAV ACTIVE ON SCROLL ─────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let scrollY = window.scrollY + 80;
  sections.forEach(sec => {
    if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
      navLinks.forEach(l => l.classList.remove('active'));
      const match = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
      if (match) match.classList.add('active');
    }
  });
}, { passive: true });

// ── SMOOTH SCROLL ─────────────────────────────────────
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

function enviarContato() {
    const nome     = document.getElementById('contact-nome').value.trim();
    const email    = document.getElementById('contact-email').value.trim();
    const celular  = document.getElementById('contact-celular').value.trim();
    const assunto  = document.getElementById('contact-assunto').value.trim();
    const mensagem = document.getElementById('contact-mensagem').value.trim();
    const status   = document.getElementById('msg-status');
    const btn      = document.getElementById('btn-enviar');

    if (!nome || !email) {
      status.style.display = 'block';
      status.style.color = '#e74c3c';
      status.textContent = 'Por favor, preencha Nome e Email.';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Enviando...';

    const templateParams = {
      from_name:  nome,
      from_email: email,
      phone:      celular,
      subject:    assunto,
      message:    mensagem
    };

    emailjs.send('service_fs71d7u', 'template_8cm86xf', templateParams)
      .then(() => {
        status.style.display = 'block';
        status.style.color = '#2ecc71';
        status.textContent = '✅ Mensagem enviada com sucesso! Entraremos em contato em breve.';
        btn.textContent = 'Enviado!';
        // Limpa os campos
        ['contact-nome','contact-celular','contact-email','contact-assunto','contact-mensagem']
          .forEach(id => document.getElementById(id).value = '');
      })
      .catch((err) => {
        status.style.display = 'block';
        status.style.color = '#e74c3c';
        status.textContent = '❌ Erro ao enviar. Tente novamente mais tarde.';
        btn.disabled = false;
        btn.textContent = 'Enviar';
        console.error('EmailJS error:', err);
      });
  }