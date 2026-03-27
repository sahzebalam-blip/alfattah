document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navDropdown = document.querySelector(".nav-dropdown");
  const dropdownToggle = document.querySelector(".dropdown-toggle");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      const isOpen = navMenu.classList.contains("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  if (navDropdown && dropdownToggle) {
    dropdownToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      navDropdown.classList.toggle("open");
      const isOpen = navDropdown.classList.contains("open");
      dropdownToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.addEventListener("click", (e) => {
      if (!navDropdown.contains(e.target)) {
        navDropdown.classList.remove("open");
        dropdownToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const panels = document.querySelectorAll(".ecosystem-panel");
  const contents = document.querySelectorAll(".ecosystem-content");

  panels.forEach((panel) => {
    panel.addEventListener("click", () => {
      const target = panel.dataset.target;

      panels.forEach((p) => {
        p.classList.remove("active");
        p.setAttribute("aria-selected", "false");
      });

      contents.forEach((content) => {
        content.classList.remove("active");
        content.hidden = true;
      });

      panel.classList.add("active");
      panel.setAttribute("aria-selected", "true");

      const targetContent = document.getElementById(target);
      if (targetContent) {
        targetContent.hidden = false;
        targetContent.classList.add("active");
      }
    });
  });

  const dropdownLinks = document.querySelectorAll(".dropdown-menu a[data-target]");
  dropdownLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const target = link.dataset.target;
      const matchingPanel = document.querySelector(`.ecosystem-panel[data-target="${target}"]`);
      if (matchingPanel) matchingPanel.click();
      if (navDropdown) navDropdown.classList.remove("open");
      if (dropdownToggle) dropdownToggle.setAttribute("aria-expanded", "false");
    });
  });
});
