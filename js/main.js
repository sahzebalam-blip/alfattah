document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const currentPage = body.dataset.page || "";

  // =========================
  // NAVBAR INCLUDE SAFETY
  // =========================
  const initNav = () => {
    const navToggle = document.querySelector(".nav-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const dropdownToggle = document.querySelector(".dropdown-toggle");
    const navDropdown = document.querySelector(".nav-dropdown");
    const navLinks = document.querySelectorAll(".nav-link");
    const header = document.querySelector(".site-header");

    if (navToggle && navMenu) {
      navToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });

      document.addEventListener("click", (e) => {
        const clickedInsideMenu = navMenu.contains(e.target);
        const clickedToggle = navToggle.contains(e.target);

        if (!clickedInsideMenu && !clickedToggle && navMenu.classList.contains("open")) {
          navMenu.classList.remove("open");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    if (dropdownToggle && navDropdown) {
      dropdownToggle.addEventListener("click", (e) => {
        if (window.innerWidth <= 900) {
          e.preventDefault();
          const expanded =
            dropdownToggle.getAttribute("aria-expanded") === "true";
          dropdownToggle.setAttribute("aria-expanded", expanded ? "false" : "true");
          navDropdown.classList.toggle("open");
        }
      });

      document.addEventListener("click", (e) => {
        const insideDropdown = navDropdown.contains(e.target);
        if (!insideDropdown) {
          dropdownToggle.setAttribute("aria-expanded", "false");
          navDropdown.classList.remove("open");
        }
      });
    }

    navLinks.forEach((link) => {
      const linkPage = link.dataset.page;
      if (linkPage && linkPage === currentPage) {
        link.classList.add("active");
      }

      link.addEventListener("click", () => {
        if (navMenu && navMenu.classList.contains("open")) {
          navMenu.classList.remove("open");
          navToggle?.setAttribute("aria-expanded", "false");
        }
      });
    });

    const handleHeaderScroll = () => {
      if (!header) return;
      if (window.scrollY > 12) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };

    handleHeaderScroll();
    window.addEventListener("scroll", handleHeaderScroll, { passive: true });
  };

  // =========================
  // SMOOTH SCROLL
  // =========================
  const initSmoothScroll = () => {
    const internalLinks = document.querySelectorAll('a[href^="#"], a[href*="index.html#"]');

    internalLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href) return;

        let targetId = null;

        if (href.startsWith("#")) {
          targetId = href;
        } else if (href.includes("#")) {
          const split = href.split("#");
          if (split[0] === "index.html" || split[0] === window.location.pathname.split("/").pop()) {
            targetId = `#${split[1]}`;
          }
        }

        if (!targetId) return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        const header = document.querySelector(".site-header");
        const headerHeight = header ? header.offsetHeight : 0;
        const top =
          target.getBoundingClientRect().top + window.scrollY - headerHeight - 18;

        window.scrollTo({
          top,
          behavior: "smooth",
        });
      });
    });
  };

  // =========================
  // REVEAL ON SCROLL
  // =========================
  const initReveal = () => {
    const revealItems = document.querySelectorAll("[data-reveal]");

    if (!revealItems.length) return;

    revealItems.forEach((item) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(26px)";
      item.style.transition =
        "opacity 0.8s ease, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  };

  // =========================
  // ACTIVE SECTION NAV
  // =========================
  const initSectionSpy = () => {
    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll('.nav-link[href^="index.html#"], .nav-link[href^="#"]');

    if (!sections.length || !navLinks.length) return;

    const linkMap = new Map();

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;
      const id = href.includes("#") ? href.split("#")[1] : "";
      if (id) linkMap.set(id, link);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const id = entry.target.getAttribute("id");
          if (!id) return;

          navLinks.forEach((link) => link.classList.remove("active-section"));
          const activeLink = linkMap.get(id);
          if (activeLink) activeLink.classList.add("active-section");
        });
      },
      {
        threshold: 0.34,
        rootMargin: "-20% 0px -55% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));
  };

  // =========================
  // PANEL PARALLAX LIGHT
  // =========================
  const initPanelTilt = () => {
    if (window.innerWidth <= 900) return;

    const panels = document.querySelectorAll(".ecosystem-panel, .hero-signal-panel, .transition-line");

    panels.forEach((panel) => {
      panel.addEventListener("mousemove", (e) => {
        const rect = panel.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rx = ((y / rect.height) - 0.5) * -3;
        const ry = ((x / rect.width) - 0.5) * 4;

        panel.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      });

      panel.addEventListener("mouseleave", () => {
        panel.style.transform = "";
      });
    });
  };

  // =========================
  // INIT AFTER INCLUDE LOAD
  // =========================
  const safeInit = () => {
    initNav();
    initSmoothScroll();
    initReveal();
    initSectionSpy();
    initPanelTilt();
  };

  // small delay so includes.js has time to inject navbar/footer
  setTimeout(safeInit, 120);
});
