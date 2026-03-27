document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  /* ---------- NAV ---------- */
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navDropdown = document.querySelector(".nav-dropdown");
  const dropdownToggle = document.querySelector(".dropdown-toggle");
  const navLinks = document.querySelectorAll(".nav-link");
  const navMenuLinks = document.querySelectorAll(".nav-menu a[href^='#']");
  const sectionMap = [
    { id: "home", link: document.querySelector('.nav-link[href="#home"]') },
    { id: "about", link: document.querySelector('.nav-link[href="#about"]') },
    { id: "ecosystem", link: document.querySelector('.nav-link[href="#ecosystem"]') || dropdownToggle },
    { id: "logic", link: document.querySelector('.nav-link[href="#logic"]') },
    { id: "footer-legal", link: document.querySelector('.nav-link[href="#footer-legal"]') }
  ];

  const closeMobileMenu = () => {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  const closeDropdown = () => {
    if (!navDropdown || !dropdownToggle) return;
    navDropdown.classList.remove("open");
    dropdownToggle.setAttribute("aria-expanded", "false");
  };

  const clearActiveNav = () => {
    navLinks.forEach((link) => link.classList.remove("is-active"));
    if (dropdownToggle) dropdownToggle.classList.remove("is-active");
  };

  const setActiveNav = (targetId) => {
    clearActiveNav();

    const matchedLink = document.querySelector(`.nav-link[href="#${targetId}"]`);
    if (matchedLink) {
      matchedLink.classList.add("is-active");
      return;
    }

    if (targetId === "ecosystem" && dropdownToggle) {
      dropdownToggle.classList.add("is-active");
    }

    if (targetId === "footer-legal") {
      const legalLink = document.querySelector('.nav-link[href="#footer-legal"]');
      if (legalLink) legalLink.classList.add("is-active");
    }
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      if (!isOpen) closeDropdown();
    });
  }

  if (navDropdown && dropdownToggle) {
    dropdownToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = navDropdown.classList.toggle("open");
      dropdownToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.addEventListener("click", (e) => {
      if (!navDropdown.contains(e.target)) {
        closeDropdown();
      }
    });
  }

  navMenuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const href = link.getAttribute("href");
      if (href) {
        const targetId = href.replace("#", "");
        setActiveNav(targetId);
      }
      closeMobileMenu();
    });
  });

  /* ---------- ECOSYSTEM TABS ---------- */
  const panels = document.querySelectorAll(".ecosystem-panel");
  const contents = document.querySelectorAll(".ecosystem-content");
  const dropdownLinks = document.querySelectorAll(".dropdown-menu a[data-target]");

  const activatePanel = (target) => {
    if (!target) return;

    panels.forEach((panel) => {
      const isMatch = panel.dataset.target === target;
      panel.classList.toggle("active", isMatch);
      panel.setAttribute("aria-selected", isMatch ? "true" : "false");
    });

    contents.forEach((content) => {
      const isMatch = content.id === target;
      content.classList.toggle("active", isMatch);
      content.hidden = !isMatch;
    });
  };

  panels.forEach((panel) => {
    panel.addEventListener("click", () => {
      const target = panel.dataset.target;
      activatePanel(target);
    });
  });

  dropdownLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const target = link.dataset.target;
      activatePanel(target);
      setActiveNav("ecosystem");
      closeDropdown();
      closeMobileMenu();
    });
  });

  /* ---------- SCROLL ACTIVE NAV ---------- */
  const trackedSections = sectionMap
    .map((item) => ({
      ...item,
      element: document.getElementById(item.id)
    }))
    .filter((item) => item.element && item.link);

  const updateActiveOnScroll = () => {
    const scrollPosition = window.scrollY + 160;
    let currentId = "home";

    trackedSections.forEach((section) => {
      if (section.element.offsetTop <= scrollPosition) {
        currentId = section.id;
      }
    });

    setActiveNav(currentId);
  };

  window.addEventListener("scroll", updateActiveOnScroll, { passive: true });

  /* ---------- HASH / INITIAL STATE ---------- */
  const applyInitialState = () => {
    const hash = window.location.hash.replace("#", "");

    if (hash) {
      if (hash === "about" || hash === "home" || hash === "logic" || hash === "footer-legal") {
        setActiveNav(hash);
      } else if (hash === "ecosystem") {
        setActiveNav("ecosystem");
      }

      const ecosystemTargets = ["academy", "markets", "participation", "token", "labs"];
      if (ecosystemTargets.includes(hash)) {
        activatePanel(hash);
        setActiveNav("ecosystem");
      }
    } else {
      updateActiveOnScroll();
    }
  };

  applyInitialState();

  /* ---------- ESC KEY ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDropdown();
      closeMobileMenu();
    }
  });
});
