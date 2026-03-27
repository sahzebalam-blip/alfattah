const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const dropdown = document.querySelector('.nav-dropdown');
const dropdownTrigger = document.querySelector('.dropdown-trigger');
const ecosystemPanels = document.querySelectorAll('.ecosystem-panel');
const ecosystemLinks = document.querySelectorAll('.ecosystem-link');
const ecosystemContents = document.querySelectorAll('.ecosystem-content');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navMenu.classList.toggle('open');
  });
}

if (dropdown && dropdownTrigger) {
  dropdownTrigger.addEventListener('click', () => {
    const expanded = dropdownTrigger.getAttribute('aria-expanded') === 'true';
    dropdownTrigger.setAttribute('aria-expanded', String(!expanded));
    dropdown.classList.toggle('open');
  });

  document.addEventListener('click', (event) => {
    if (!dropdown.contains(event.target)) {
      dropdown.classList.remove('open');
      dropdownTrigger.setAttribute('aria-expanded', 'false');
    }
  });
}

function activateEcosystem(targetId) {
  ecosystemPanels.forEach((panel) => {
    const isActive = panel.dataset.target === targetId;
    panel.classList.toggle('active', isActive);
    panel.setAttribute('aria-selected', String(isActive));
  });

  ecosystemLinks.forEach((link) => {
    const isActive = link.dataset.target === targetId;
    link.classList.toggle('active', isActive);
  });

  ecosystemContents.forEach((content) => {
    const isActive = content.id === targetId;
    content.classList.toggle('active', isActive);
    content.hidden = !isActive;
  });
}

ecosystemPanels.forEach((panel) => {
  panel.addEventListener('click', () => activateEcosystem(panel.dataset.target));
});

ecosystemLinks.forEach((link) => {
  link.addEventListener('click', () => {
    activateEcosystem(link.dataset.target);
    document.querySelector('#ecosystem')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (window.innerWidth <= 840) {
      navMenu?.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
      dropdown.classList.remove('open');
      dropdownTrigger?.setAttribute('aria-expanded', 'false');
    }
  });
});

navMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 840) {
      navMenu.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  });
});
