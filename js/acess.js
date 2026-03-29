// ACCESS PAGE INTERACTIONS

document.addEventListener("DOMContentLoaded", () => {
  // ===== Reveal Animation =====
  const revealElements = document.querySelectorAll("[data-reveal]");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("access-reveal", "is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });

  // ===== Smooth anchor scroll =====
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // ===== Path cards hover (subtle emphasis) =====
  const pathCards = document.querySelectorAll(".access-path-card");

  pathCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      pathCards.forEach((c) => c.classList.remove("is-active"));
      card.classList.add("is-active");
    });
  });

  // ===== Hero panel micro interaction =====
  const panel = document.querySelector(".access-hero-panel");

  if (panel && window.innerWidth > 900) {
    panel.addEventListener("mousemove", (e) => {
      const rect = panel.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      panel.style.transform = `
        perspective(1400px)
        rotateY(${x * 6}deg)
        rotateX(${y * -4}deg)
        translateY(-2px)
      `;
    });

    panel.addEventListener("mouseleave", () => {
      panel.style.transform =
        "perspective(1400px) rotateY(-5deg) rotateX(2deg)";
    });
  }
});
