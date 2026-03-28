document.addEventListener("DOMContentLoaded", () => {
  const panels = Array.from(document.querySelectorAll(".ecosystem-panel"));
  const contents = Array.from(document.querySelectorAll(".ecosystem-content"));
  const openTriggers = Array.from(document.querySelectorAll("[data-open]"));
  const display = document.querySelector(".ecosystem-display");
  const layersSection = document.getElementById("ecosystem-layers");

  if (!panels.length || !contents.length) return;

  const contentMap = new Map(contents.map((content) => [content.id, content]));

  function setPanelState(activeTarget) {
    panels.forEach((panel) => {
      const isActive = panel.dataset.target === activeTarget;
      panel.classList.toggle("active", isActive);
      panel.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    contents.forEach((content) => {
      const isActive = content.id === activeTarget;
      content.classList.toggle("active", isActive);
      content.hidden = !isActive;
    });
  }

  function scrollDisplayIntoView() {
    if (!display || window.innerWidth > 900) return;

    const header = document.querySelector(".site-header");
    const headerOffset = header ? header.offsetHeight + 20 : 100;
    const top = display.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  }

  function scrollLayersIntoView() {
    if (!layersSection) return;

    const header = document.querySelector(".site-header");
    const headerOffset = header ? header.offsetHeight + 20 : 100;
    const top = layersSection.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  }

  function activateTarget(target, options = {}) {
    if (!target || !contentMap.has(target)) return;

    setPanelState(target);

    if (options.scrollToLayers) {
      scrollLayersIntoView();
      window.setTimeout(() => {
        scrollDisplayIntoView();
      }, 240);
      return;
    }

    if (options.scrollDisplay) {
      scrollDisplayIntoView();
    }
  }

  panels.forEach((panel) => {
    panel.addEventListener("click", () => {
      activateTarget(panel.dataset.target, { scrollDisplay: true });
    });

    panel.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activateTarget(panel.dataset.target, { scrollDisplay: true });
      }
    });
  });

  openTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      const target = trigger.dataset.open;
      if (!target) return;

      event.preventDefault();
      activateTarget(target, { scrollToLayers: true });
    });
  });

  const initialActivePanel =
    panels.find((panel) => panel.classList.contains("active")) || panels[0];

  if (initialActivePanel) {
    setPanelState(initialActivePanel.dataset.target);
  }
});
