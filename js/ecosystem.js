document.addEventListener("DOMContentLoaded", () => {
  const ecosystemData = {
    academy: {
      kicker: "Selected System",
      title: "Zubolaa Academy",
      text: "Most people consume information. Very few build clarity. The Academy is designed to structure your thinking, sharpen your understanding, and guide your execution — so decisions are not driven by noise, but by direction.",
      tags: ["Structured Learning", "Clarity", "Direction"],
      explore: "#",
      access: "#"
    },
    markets: {
      kicker: "Selected System",
      title: "Zubolaa Markets",
      text: "Markets reward discipline, not excitement. This system focuses on structure, context, and controlled execution — helping you move away from random entries and toward intelligent participation.",
      tags: ["Structure", "Risk Awareness", "Execution"],
      explore: "#",
      access: "#"
    },
    labs: {
      kicker: "Selected System",
      title: "Zubolaa Labs",
      text: "Speed without structure creates chaos. Labs is where AI bots and intelligent systems are built for controlled execution — turning ideas into usable, scalable systems.",
      tags: ["AI Bots", "Automation", "Systems"],
      explore: "#",
      access: "#"
    },
    infrastructure: {
      kicker: "Selected System",
      title: "Zubolaa Infrastructure",
      text: "Without structure, nothing scales. Infrastructure provides the backbone — from systems to delivery layers — ensuring everything inside Zubolaa operates with stability and precision.",
      tags: ["Architecture", "Foundation", "Scalability"],
      explore: "#",
      access: "#"
    },
    consultancy: {
      kicker: "Selected System",
      title: "Zubolaa Consultancy",
      text: "Most problems are not lack of effort. They are lack of direction. Consultancy exists to bring clarity into decisions, structure into plans, and alignment into execution.",
      tags: ["Guidance", "Strategy", "Alignment"],
      explore: "#",
      access: "#"
    },
    participation: {
      kicker: "Selected System",
      title: "Zubolaa Participation",
      text: "Growth is faster when it is aligned. Participation connects individuals to the ecosystem through structured involvement — not randomness, not hype, but controlled collaboration.",
      tags: ["Alignment", "Growth", "Collaboration"],
      explore: "#",
      access: "#"
    },
    access: {
      kicker: "Selected System",
      title: "Zubolaa Access",
      text: "Access defines movement. This layer controls identity, routing, and system entry — ensuring the ecosystem stays clean, secure, and scalable.",
      tags: ["Identity", "Routing", "Control"],
      explore: "#",
      access: "#"
    }
  };

  const cards = document.querySelectorAll(".ecosystem-card");
  const kickerEl = document.getElementById("ecosystem-detail-kicker");
  const titleEl = document.getElementById("ecosystem-detail-title");
  const textEl = document.getElementById("ecosystem-detail-text");
  const tagsEl = document.getElementById("ecosystem-detail-tags");
  const exploreEl = document.getElementById("ecosystem-detail-explore");
  const accessEl = document.getElementById("ecosystem-detail-access");

  function renderSystem(key) {
    const data = ecosystemData[key];
    if (!data) return;

    kickerEl.textContent = data.kicker;
    titleEl.textContent = data.title;
    textEl.textContent = data.text;
    tagsEl.innerHTML = data.tags.map(tag => `<span>${tag}</span>`).join("");
    exploreEl.href = data.explore;
    accessEl.href = data.access;
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      cards.forEach((item) => {
        item.classList.remove("is-active");
        item.setAttribute("aria-selected", "false");
      });

      card.classList.add("is-active");
      card.setAttribute("aria-selected", "true");
      renderSystem(card.dataset.system);
    });
  });
});
