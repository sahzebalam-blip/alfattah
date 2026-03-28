async function loadInclude(selector, filePath) {
  const mountPoint = document.querySelector(selector);
  if (!mountPoint) return;

  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load ${filePath}: ${response.status}`);
    }

    const html = await response.text();
    mountPoint.innerHTML = html;
  } catch (error) {
    console.error(error);
  }
}

function setActiveNav() {
  const currentPage = document.body.dataset.page;
  if (!currentPage) return;

  const navLinks = document.querySelectorAll(".nav-link[data-page]");
  const dropdownToggle = document.querySelector(".dropdown-toggle[data-page='ecosystem']");

  navLinks.forEach((link) => link.classList.remove("is-active"));
  if (dropdownToggle) dropdownToggle.classList.remove("is-active");

  const activeLink = document.querySelector(`.nav-link[data-page="${currentPage}"]`);

  if (activeLink) {
    activeLink.classList.add("is-active");
    return;
  }

  const ecosystemPages = ["academy", "markets", "participation", "token", "labs"];
  if (ecosystemPages.includes(currentPage) && dropdownToggle) {
    dropdownToggle.classList.add("is-active");
  }
}

function initNavbarInteractions() {
  const body = document.body;
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navDropdown = document.querySelector(".nav-dropdown");
  const dropdownToggle = document.querySelector(".dropdown-toggle");
  const dropdownMenu = document.querySelector(".dropdown-menu");

  if (!navToggle || !navMenu) return;

  const closeMobileMenu = () => {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    body.classList.remove("nav-open");
  };

  const toggleMobileMenu = () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    body.classList.toggle("nav-open", isOpen);
  };

  const closeDropdown = () => {
    if (!navDropdown || !dropdownToggle) return;
    navDropdown.classList.remove("open");
    if (dropdownMenu) dropdownMenu.classList.remove("open");
    dropdownToggle.setAttribute("aria-expanded", "false");
  };

  const toggleDropdown = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!navDropdown || !dropdownToggle) return;

    const isOpen = navDropdown.classList.toggle("open");
    if (dropdownMenu) dropdownMenu.classList.toggle("open", isOpen);
    dropdownToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  };

  navToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleMobileMenu();
  });

  if (dropdownToggle) {
    dropdownToggle.addEventListener("click", toggleDropdown);
  }

  document.addEventListener("click", (event) => {
    const clickedInsideNav =
      navMenu.contains(event.target) || navToggle.contains(event.target);

    if (!clickedInsideNav && window.innerWidth <= 960) {
      closeMobileMenu();
    }

    if (navDropdown && !navDropdown.contains(event.target)) {
      closeDropdown();
    }
  });

  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      closeDropdown();
      closeMobileMenu();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDropdown();
      closeMobileMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) {
      closeMobileMenu();
    }
  });
}

async function initIncludes() {
  await loadInclude("#navbar-include", "components/navbar.html");
  await loadInclude("#footer-include", "components/footer.html");

  setActiveNav();
  initNavbarInteractions();
}

document.addEventListener("DOMContentLoaded", initIncludes);
