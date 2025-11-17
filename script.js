
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
      header.style.boxShadow = '0 6px 24px rgba(59,130,246,.25)';
      header.style.background = 'rgba(15,15,16,.85)';
    } else {
      header.style.boxShadow = 'none';
      header.style.background = 'transparent';
    }
  };
  onScroll(); window.addEventListener('scroll', onScroll);

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Add fade-in animations to sections
  document.querySelectorAll('.section h2, .card, .feature, .gallery__item').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  // Active section indicator in navigation
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__menu a[href^="#"]');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.style.color = '';
          link.style.background = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = '#60a5fa';
            link.style.background = 'rgba(59,130,246,.1)';
          }
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(section => navObserver.observe(section));

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

  // Phone mask function
  const phoneMask = (input) => {
    input.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.startsWith('7')) val = val.substring(1);
      if (val.length > 0) val = '+7 (' + val;
      if (val.length > 7) val = val.substring(0, 7) + ') ' + val.substring(7);
      if (val.length > 13) val = val.substring(0, 13) + '-' + val.substring(13);
      if (val.length > 16) val = val.substring(0, 16) + '-' + val.substring(16, 18);
      e.target.value = val;
    });
  };

  // Apply phone mask
  document.querySelectorAll('input[type="tel"]').forEach(phoneMask);

  // Enhanced form validation
  const validateForm = (form) => {
    const phone = form.querySelector('input[type="tel"]');
    const name = form.querySelector('input[name="name"]');
    let valid = true;

    if (phone && phone.value.replace(/\D/g, '').length < 11) {
      phone.style.borderColor = '#ef4444';
      valid = false;
    } else if (phone) {
      phone.style.borderColor = '#10b981';
    }

    if (name && name.value.trim().length < 2) {
      name.style.borderColor = '#ef4444';
      valid = false;
    } else if (name) {
      name.style.borderColor = '#10b981';
    }

    return valid;
  };

  // Show success message
  const showSuccess = (form) => {
    let successMsg = form.querySelector('.form__success');
    if (!successMsg) {
      successMsg = document.createElement('div');
      successMsg.className = 'form__success';
      successMsg.textContent = '✓ Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.';
      form.appendChild(successMsg);
    }
    successMsg.style.display = 'block';
    setTimeout(() => {
      successMsg.style.display = 'none';
      form.reset();
    }, 5000);
  };

  // Main form submission
  const form = document.getElementById('quote-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm(form)) {
      showSuccess(form);
    }
  });

  // Quick quote form submission
  const quick = document.getElementById('quick-quote');
  quick.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm(quick)) {
      showSuccess(quick);
      setTimeout(() => {
        modal.setAttribute('aria-hidden', 'true');
      }, 2000);
    }
  });
})();
