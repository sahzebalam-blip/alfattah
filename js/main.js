document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navDropdown = document.querySelector(".nav-dropdown");
  const dropdownToggle = document.querySelector(".dropdown-toggle");
  const dropdownMenu = document.querySelector(".dropdown-menu");

  const navLinks = document.querySelectorAll(".nav-link");
  const panels = document.querySelectorAll(".ecosystem-panel");
  const contents = document.querySelectorAll(".ecosystem-content");
  const dropdownLinks = document.querySelectorAll(".dropdown-menu a[data-target]");

  const isHomePage =
    document.getElementById("home") &&
    document.getElementById("about") &&
    document.getElementById("ecosystem");

  const PANEL_IDS = ["academy", "markets", "participation", "token", "labs"];
  const SECTION_IDS = ["home", "about", "ecosystem", "logic", "footer-legal"];

  function setAriaExpanded(element, value) {
    if (element) element.setAttribute("aria-expanded", value ? "true" : "false");
  }

  function closeMobileMenu() {
    if (!navMenu) return;
    navMenu.classList.remove("open");
    setAriaExpanded(navToggle, false);
    body.classList.remove("nav-open");
  }

  function openMobileMenu() {
    if (!navMenu) return;
    navMenu.classList.add("open");
    setAriaExpanded(navToggle, true);
    body.classList.add("nav-open");
  }

  function toggleMobileMenu() {
    if (!navMenu) return;
    const isOpen = navMenu.classList.contains("open");
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function closeDropdown() {
    if (!navDropdown) return;
    navDropdown.classList.remove("open");
    if (dropdownMenu) dropdownMenu.classList.remove("open");
    setAriaExpanded(dropdownToggle, false);
  }

  function openDropdown() {
    if (!navDropdown) return;
    navDropdown.classList.add("open");
    if (dropdownMenu) dropdownMenu.classList.add("open");
    setAriaExpanded(dropdownToggle, true);
  }

  function toggleDropdown() {
    if (!navDropdown) return;
    const isOpen = navDropdown.classList.contains("open");
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }

  function clearActiveNav() {
    navLinks.forEach((link) => link.classList.remove("is-active"));
    if (dropdownToggle) dropdownToggle.classList.remove("is-active");
  }

  function setActiveNav(targetId) {
    clearActiveNav();

    if (targetId === "ecosystem") {
      if (dropdownToggle) dropdownToggle.classList.add("is-active");
      return;
    }

    const directMatch = document.querySelector(`.nav-link[href="#${targetId}"]`);
    if (directMatch) {
      directMatch.classList.add("is-active");
      return;
    }

    const fileMatch = document.querySelector(`.nav-link[href$="#${targetId}"]`);
    if (fileMatch) {
      fileMatch.classList.add("is-active");
    }
  }

  function activatePanel(target) {
    if (!target || !PANEL_IDS.includes(target) || !panels.length || !contents.length) {
      return;
    }

    panels.forEach((panel) => {
      const isMatch = panel.dataset.target === target;
      panel.classList.toggle("active", isMatch);
      panel.setAttribute("aria-selected", isMatch ? "true" : "false");
      panel.setAttribute("tabindex", isMatch ? "0" : "-1");
    });

    contents.forEach((content) => {
      const isMatch = content.id === target;
      content.classList.toggle("active", isMatch);
      content.hidden = !isMatch;
    });
  }

  function getHashTarget(href) {
    if (!href) return "";
    const hashIndex = href.indexOf("#");
    if (hashIndex === -1) return "";
    return href.slice(hashIndex + 1);
  }

  function isSamePageHashLink(link) {
    const href = link.getAttribute("href");
    if (!href) return false;

    if (href.startsWith("#")) return true;

    try {
      const url = new URL(href, window.location.href);
      const current = new URL(window.location.href);
      return (
        url.origin === current.origin &&
        url.pathname === current.pathname &&
        !!url.hash
      );
    } catch {
      return false;
    }
  }

  function smoothScrollToId(targetId) {
    const element = document.getElementById(targetId);
    if (!element) return false;

    const header = document.querySelector(".site-header");
    const headerOffset = header ? header.offsetHeight + 18 : 90;
    const top = element.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top,
      behavior: "smooth",
    });

    return true;
  }

  function handleNavLinkClick(link, event) {
    const href = link.getAttribute("href");
    const targetId = getHashTarget(href);

    if (!targetId) {
      closeDropdown();
      closeMobileMenu();
      return;
    }

    if (isSamePageHashLink(link) && document.getElementById(targetId)) {
      event.preventDefault();
      smoothScrollToId(targetId);
      setActiveNav(targetId === "ecosystem" ? "ecosystem" : targetId);

      if (targetId === "ecosystem") {
        closeDropdown();
      }

      closeMobileMenu();
      return;
    }

    closeDropdown();
    closeMobileMenu();
  }

  if (navToggle) {
    navToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleMobileMenu();
    });
  }

  if (dropdownToggle) {
    dropdownToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleDropdown();
    });
  }

  document.addEventListener("click", (event) => {
    const clickedInsideNav =
      (navMenu && navMenu.contains(event.target)) ||
      (navToggle && navToggle.contains(event.target));

    const clickedInsideDropdown =
      (navDropdown && navDropdown.contains(event.target)) ||
      (dropdownToggle && dropdownToggle.contains(event.target));

    if (!clickedInsideDropdown) {
      closeDropdown();
    }

    if (!clickedInsideNav && window.innerWidth <= 960) {
      closeMobileMenu();
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      handleNavLinkClick(link, event);
    });
  });

  const allMenuAnchors = document.querySelectorAll(".nav-menu a[href]");
  allMenuAnchors.forEach((link) => {
    if (link.classList.contains("nav-link")) return;

    link.addEventListener("click", (event) => {
      handleNavLinkClick(link, event);
    });
  });

  panels.forEach((panel) => {
    panel.addEventListener("click", () => {
      const target = panel.dataset.target;
      activatePanel(target);
      setActiveNav("ecosystem");
    });

    panel.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const target = panel.dataset.target;
        activatePanel(target);
        setActiveNav("ecosystem");
      }
    });
  });

  dropdownLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const panelTarget = link.dataset.target;
      const hrefTarget = getHashTarget(link.getAttribute("href"));

      if (isHomePage) {
        event.preventDefault();

        if (hrefTarget && document.getElementById(hrefTarget)) {
          smoothScrollToId(hrefTarget);
        }

        activatePanel(panelTarget || "academy");
        setActiveNav("ecosystem");
        closeDropdown();
        closeMobileMenu();
        return;
      }

      closeDropdown();
      closeMobileMenu();
    });
  });

  const trackedSections = SECTION_IDS
    .map((id) => ({
      id,
      element: document.getElementById(id),
    }))
    .filter((item) => item.element);

  function updateActiveOnScroll() {
    if (!trackedSections.length) return;

    const scrollPosition = window.scrollY + 160;
    let currentId = trackedSections[0].id;

    trackedSections.forEach((section) => {
      if (section.element.offsetTop <= scrollPosition) {
        currentId = section.id;
      }
    });

    setActiveNav(currentId === "ecosystem" ? "ecosystem" : currentId);
  }

  function applyInitialState() {
    const hash = window.location.hash.replace("#", "");

    if (PANEL_IDS.includes(hash)) {
      if (isHomePage) {
        activatePanel(hash);
      }
      setActiveNav("ecosystem");
      return;
    }

    if (SECTION_IDS.includes(hash)) {
      setActiveNav(hash === "ecosystem" ? "ecosystem" : hash);
      return;
    }

    if (document.body.classList.contains("about-page")) {
      setActiveNav("about");
      return;
    }

    if (isHomePage) {
      updateActiveOnScroll();
      return;
    }

    clearActiveNav();
  }

  if (isHomePage) {
    window.addEventListener("scroll", updateActiveOnScroll, { passive: true });
  }

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

  applyInitialState();
});
