document.addEventListener("DOMContentLoaded", () => {
  const panel = document.getElementById("eco-panel-content");
  const cards = document.querySelectorAll(".eco-system-card");
  const isMobile = () => window.innerWidth <= 767;

  const systemData = {
    academy: {
      title: "Zubolaa Academy",
      desc: "A structured learning layer built to support mindset, knowledge flow, discipline, and long-term development.",
      points: [
        "Structured learning pathways",
        "Mindset and development framework",
        "Guided long-term progression"
      ],
      explore: "#",
      access: "#"
    },
    markets: {
      title: "Zubolaa Markets",
      desc: "A focused market layer designed for intelligence, execution awareness, analytical structure, and clearer decision environments.",
      points: [
        "Market intelligence flow",
        "Execution clarity and structure",
        "Decision support environment"
      ],
      explore: "#",
      access: "#"
    },
    participation: {
      title: "Zubolaa Participation",
      desc: "A defined participation layer that helps users move through guided roles, pathways, and structured involvement models.",
      points: [
        "Defined participation paths",
        "Role-based involvement flow",
        "Structured entry guidance"
      ],
      explore: "#",
      access: "#"
    },
    labs: {
      title: "Zubolaa Labs",
      desc: "An evolving layer for tools, experiments, new ideas, structured testing, and capability expansion across the ecosystem.",
      points: [
        "Tools and functional experiments",
        "Capability expansion layer",
        "Iterative system evolution"
      ],
      explore: "#",
      access: "#"
    },
    core: {
      title: "Zubolaa Core",
      desc: "The central alignment layer that holds identity, structure, logic, and overarching directional continuity across the ecosystem.",
      points: [
        "Shared identity and logic",
        "Central alignment framework",
        "Direction continuity layer"
      ],
      explore: "#",
      access: "#"
    },
    infrastructure: {
      title: "Zubolaa Infrastructure",
      desc: "The foundational support layer built for continuity, system stability, architecture support, and scalable ecosystem growth.",
      points: [
        "Support for continuity and scale",
        "Foundational system architecture",
        "Operational stability layer"
      ],
      explore: "#",
      access: "#"
    }
  };

  function panelHTML(data) {
    return `
      <h3>${data.title}</h3>
      <p>${data.desc}</p>
      <ul class="eco-panel-points">
        ${data.points.map((point) => `<li>${point}</li>`).join("")}
      </ul>
      <div class="eco-panel-actions">
        <a href="${data.explore}" class="eco-btn eco-btn-primary">Explore</a>
        <a href="${data.access}" class="eco-btn eco-btn-secondary">Access</a>
      </div>
    `;
  }

  function inlineHTML(data) {
    return `
      <div class="eco-inline-detail">
        <h3>${data.title}</h3>
        <p>${data.desc}</p>
        <ul>
          ${data.points.map((point) => `<li>${point}</li>`).join("")}
        </ul>
        <div class="eco-inline-actions">
          <a href="${data.explore}" class="eco-btn eco-btn-primary">Explore</a>
          <a href="${data.access}" class="eco-btn eco-btn-secondary">Access</a>
        </div>
      </div>
    `;
  }

  function clearInlineDetails() {
    cards.forEach((card) => {
      const oldInline = card.querySelector(".eco-inline-detail");
      if (oldInline) oldInline.remove();
    });
  }

  function setActiveCard(targetCard) {
    const key = targetCard.dataset.system;
    const data = systemData[key];
    if (!data) return;

    cards.forEach((card) => {
      card.classList.remove("active");
      card.setAttribute("aria-selected", "false");
    });

    targetCard.classList.add("active");
    targetCard.setAttribute("aria-selected", "true");

    if (isMobile()) {
      clearInlineDetails();
      targetCard.insertAdjacentHTML("beforeend", inlineHTML(data));
      return;
    }

    if (!panel) return;

    panel.classList.add("is-switching");

    setTimeout(() => {
      panel.innerHTML = panelHTML(data);
      panel.classList.remove("is-switching");
    }, 180);
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => setActiveCard(card));
  });

  window.addEventListener("resize", () => {
    const active = document.querySelector(".eco-system-card.active") || cards[0];
    if (active) setActiveCard(active);
  });

  if (cards.length) {
    setActiveCard(cards[0]);
  }
});
