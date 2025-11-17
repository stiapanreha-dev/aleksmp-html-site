
(function(){
  const header = document.querySelector('[data-header]');
  const navBtn = document.querySelector('[data-nav-toggle]');
  const navMenu = document.querySelector('[data-nav-menu]');
  const openQuoteBtns = document.querySelectorAll('[data-open-quote]');
  const modal = document.getElementById('quote-modal');
  const modalClose = modal.querySelector('[data-modal-close]');

  // Sticky header shadow on scroll
  const onScroll = () => {
    if (window.scrollY > 10) {
      header.style.boxShadow = '0 6px 24px rgba(0,0,0,.35)';
      header.style.background = 'rgba(15,15,16,.75)';
    } else {
      header.style.boxShadow = 'none';
      header.style.background = 'transparent';
    }
  };
  onScroll(); window.addEventListener('scroll', onScroll);

  // Mobile menu toggle
  if (navBtn) {
    navBtn.addEventListener('click', () => {
      const expanded = navBtn.getAttribute('aria-expanded') === 'true';
      navBtn.setAttribute('aria-expanded', String(!expanded));
      const open = navMenu.getAttribute('aria-expanded') === 'true';
      navMenu.setAttribute('aria-expanded', String(!open));
    });
    // Close menu on link click (mobile)
    navMenu.addEventListener('click', (e)=>{
      if(e.target.tagName === 'A' && window.innerWidth <= 900){
        navBtn.setAttribute('aria-expanded','false');
        navMenu.setAttribute('aria-expanded','false');
      }
    });
  }

  // Smooth scroll for internal links
  document.addEventListener('click', (e)=>{
    const a = e.target.closest('a[href^="#"]');
    if(!a) return;
    const id = a.getAttribute('href');
    if(id.length > 1){
      const el = document.querySelector(id);
      if(el){
        e.preventDefault();
        el.scrollIntoView({behavior:'smooth', block: 'start'});
        history.pushState(null, '', id);
      }
    }
  });

  // Lightbox for gallery
  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('.lightbox__img');
  document.addEventListener('click', (e)=>{
    const item = e.target.closest('[data-lightbox]');
    if(!item) return;
    e.preventDefault();
    lbImg.src = item.getAttribute('href');
    lb.setAttribute('aria-hidden','false');
  });
  lb.addEventListener('click', (e)=>{
    if(e.target === lb || e.target.hasAttribute('data-lightbox-close')){
      lb.setAttribute('aria-hidden','true');
      lbImg.removeAttribute('src');
    }
  });
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){
      lb.setAttribute('aria-hidden','true');
      modal.setAttribute('aria-hidden','true');
    }
  });

  // Quote modal
  const openModal = () => modal.setAttribute('aria-hidden','false');
  const closeModal = () => modal.setAttribute('aria-hidden','true');
  openQuoteBtns.forEach(b => b.addEventListener('click', openModal));
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });

  // Basic form validation (example)
  const form = document.getElementById('quote-form');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const phone = form.phone.value.trim();
    if(!phone){
      alert('Пожалуйста, укажите телефон для связи.');
      form.phone.focus();
      return;
    }
    alert('Спасибо! Заявка отправлена (демо).');
    form.reset();
  });

  const quick = document.getElementById('quick-quote');
  quick.addEventListener('submit', (e)=>{
    e.preventDefault();
    const phone = quick.qphone.value.trim();
    if(!phone){
      alert('Укажите номер телефона.');
      quick.qphone.focus();
      return;
    }
    alert('Спасибо! Мы перезвоним (демо).');
    quick.reset();
    modal.setAttribute('aria-hidden','true');
  });
})();
