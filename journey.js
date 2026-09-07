// Progressive enhancement: the original content remains the no-JavaScript view.
export function createJourney(isPaused, notifyScene) {
  const decks = new Map();
  const pad = (value) => String(value).padStart(2, "0");
  const create = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  };

  function buildDeck(section, cards, names, title, instruction) {
    const id = section.id;
    const layout = create("div", `chapter-layout chapter-${id}`);
    const map = create("div", "scene-slot chapter-map");
    map.dataset.scene = id;
    map.setAttribute("aria-label", `${title} selector`);
    const caption = create("div", "scene-caption");
    caption.append(
      create("span", "", title),
      create("span", "scene-count", `01 / ${pad(cards.length)}`),
    );
    const links = create("div", "scene-links");
    map.append(caption, links, create("p", "scene-instruction", instruction));
    const deck = create("div", "spatial-deck");
    deck.setAttribute("role", "region");
    deck.setAttribute("aria-roledescription", "carousel");
    deck.setAttribute("aria-label", title);
    const track = create("div", "deck-track");
    track.tabIndex = 0;
    track.setAttribute(
      "aria-label",
      `${title}. Use left and right arrow keys to browse.`,
    );
    const controls = create("div", "deck-controls");
    const previous = create("button", "deck-arrow", "←");
    const next = create("button", "deck-arrow", "→");
    [previous, next].forEach((button) => (button.type = "button"));
    previous.setAttribute(
      "aria-label",
      `Previous ${id === "work" ? "experience" : id === "projects" ? "project" : "toolkit area"}`,
    );
    next.setAttribute(
      "aria-label",
      `Next ${id === "work" ? "experience" : id === "projects" ? "project" : "toolkit area"}`,
    );
    const counter = create("p", "deck-counter");
    counter.setAttribute("aria-live", "polite");
    counter.setAttribute("aria-atomic", "true");
    const controlButtons = create("div", "deck-buttons");
    controlButtons.append(previous, next);
    controls.append(counter, controlButtons);
    const tabs = names.map((name, index) => {
      const button = create("button", "scene-node");
      button.type = "button";
      button.dataset.node = index;
      button.textContent = name;
      button.setAttribute("aria-controls", `${id}-card-${index}`);
      button.addEventListener("click", () => select(index));
      links.append(button);
      return button;
    });
    cards.forEach((card, index) => {
      card.classList.remove("reveal", "visible", "waiting", "tilt-card");
      card.classList.add("deck-card");
      card.id = `${id}-card-${index}`;
      card.setAttribute("role", "group");
      card.setAttribute("aria-roledescription", "slide");
      card.setAttribute(
        "aria-label",
        `${index + 1} of ${cards.length}: ${names[index]}`,
      );
      track.append(card);
    });
    deck.append(track, controls);
    layout.append(map, deck);
    section.append(layout);
    let active = 0;
    function setHeight() {
      // Read the layout height, not the transformed bounds of a moving card.
      track.style.height = `${Math.max(...cards.map((card) => card.offsetHeight))}px`;
    }
    function select(index, announce = true) {
      active = (index + cards.length) % cards.length;
      cards.forEach((card, i) => {
        let offset = i - active;
        if (offset > cards.length / 2) offset -= cards.length;
        if (offset < -cards.length / 2) offset += cards.length;
        card.style.setProperty("--offset", offset);
        card.style.setProperty("--distance", Math.abs(offset));
        card.classList.toggle("is-selected", i === active);
        card.classList.toggle("is-nearby", Math.abs(offset) === 1);
        card.inert = i !== active;
        card.setAttribute("aria-hidden", String(i !== active));
        tabs[i].setAttribute("aria-pressed", String(i === active));
      });
      counter.textContent = `${pad(active + 1)} / ${pad(cards.length)} · ${names[active]}`;
      caption.lastElementChild.textContent = `${pad(active + 1)} / ${pad(cards.length)}`;
      setHeight();
      if (announce) notifyScene(id, active);
    }
    previous.addEventListener("click", () => select(active - 1));
    next.addEventListener("click", () => select(active + 1));
    deck.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
        return;
      if (event.target.closest("input,textarea,select")) return;
      event.preventDefault();
      select(
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? cards.length - 1
            : active + (event.key === "ArrowRight" ? 1 : -1),
      );
    });
    let start;
    track.addEventListener("pointerdown", (event) => {
      if (event.target.closest("a,button") || !event.isPrimary) return;
      start = { x: event.clientX, y: event.clientY, id: event.pointerId };
    });
    track.addEventListener("pointerup", (event) => {
      if (!start || start.id !== event.pointerId) return;
      const dx = event.clientX - start.x,
        dy = event.clientY - start.y;
      start = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4)
        select(active + (dx < 0 ? 1 : -1));
    });
    track.addEventListener("pointercancel", () => {
      start = null;
    });
    track.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "mouse") start = null;
    });
    const observer = new ResizeObserver(setHeight);
    cards.forEach((card) => observer.observe(card));
    decks.set(id, {
      select,
      get active() {
        return active;
      },
      tabs,
      map,
    });
    select(0, false);
  }

  const work = document.getElementById("work");
  const featured = work.querySelector(".featured-work");
  const roles = [...work.querySelectorAll(".experience-row")];
  const experienceCards = [featured];
  const experienceNames = ["Intuit"];
  // Distinct illustrations share the card rhythm, not the same diagram.
  const roleArt = [
    {
      label:
        "A service graph highlights an incident and traces its dependencies.",
      art: `<path class="art-line" d="M90 30L210 62L340 24M210 62L350 106M90 114L210 62M210 62L450 64"/>
        <g class="art-node"><path d="M68 20l22-12 22 12v25L90 57 68 45z"/><path d="M68 105l22-12 22 12v25l-22 12-22-12z"/><path d="M320 14l22-12 22 12v25l-22 12-22-12z"/><path d="M328 95l22-12 22 12v25l-22 12-22-12z"/><path d="M430 54l22-12 22 12v25l-22 12-22-12z"/></g>
        <path class="art-shadow" d="M172 44l38-22 38 22v44l-38 22-38-22z"/>
        <path class="art-solid" d="M172 34l38-22 38 22v44l-38 22-38-22z"/>
        <path class="art-highlight art-heartbeat" d="M192 55h11l7-16 9 30 7-14h10"/><path class="art-signal" d="M90 30L210 62L340 24M90 114L210 62L450 64"/>`,
    },
    {
      label:
        "Three synchronized experimental spaces connect participants around a shared environment.",
      art: `<g class="art-planes"><path class="art-shadow" d="M150 90l100-48 100 48-100 48z"/><path class="art-node" d="M150 72l100-48 100 48-100 48z"/><path class="art-solid" d="M150 48L250 0l100 48-100 48z"/><path class="art-highlight" d="M184 48l66-31 66 31-66 31z"/></g>
        <g class="art-participants"><circle cx="90" cy="49" r="12"/><path d="M67 85v-9a23 23 0 0146 0v9z"/><circle cx="420" cy="49" r="12"/><path d="M397 85v-9a23 23 0 0146 0v9z"/></g>
        <path class="art-line" stroke-dasharray="5 6" d="M120 69L173 69M329 69h60"/><circle class="art-sync" cx="124" cy="69" r="4"/><circle class="art-sync art-sync-second" cx="333" cy="69" r="4"/>`,
    },
    {
      label:
        "Documentation cards feed a conversational assistant with contextual answers.",
      art: `<g class="art-documents"><rect class="art-shadow" x="94" y="22" width="100" height="106" rx="5"/><rect class="art-node" x="83" y="13" width="100" height="106" rx="5"/><rect class="art-solid" x="72" y="4" width="100" height="106" rx="5"/><path class="art-highlight" d="M93 28h56M93 45h43M93 62h52M93 79h32"/></g>
        <path class="art-line" stroke-dasharray="5 6" d="M190 62h67"/>
        <path class="art-shadow" d="M284 30h135v66h-78l-26 21V96h-31z"/>
        <path class="art-solid" d="M275 19h135v66h-78l-26 21V85h-31z"/>
        <path class="art-highlight" d="M298 41h88M298 59h60"/>
        <path class="art-highlight" d="M443 21v22M432 32h22"/><path class="art-scan" d="M82 28h80"/><g class="art-typing"><circle cx="308" cy="73" r="3"/><circle cx="323" cy="73" r="3"/><circle cx="338" cy="73" r="3"/></g>`,
    },
    {
      label:
        "A raised hospital operations dashboard shows staffing and resource availability.",
      art: `<g class="art-dashboard"><rect class="art-shadow" x="120" y="12" width="280" height="117" rx="7"/><rect class="art-solid" x="108" y="1" width="280" height="117" rx="7"/><path class="art-line" d="M108 25h280M174 25v93"/>
        <path class="art-highlight" d="M124 13h21M125 44h31M125 60h23M125 76h28"/>
        <g class="art-bars"><path d="M198 91V65h21v26z"/><path d="M230 91V48h21v43z"/><path d="M262 91V35h21v56z"/></g><circle class="art-live" cx="372" cy="13" r="4"/>
        <path class="art-highlight" d="M307 51h53M307 68h35M307 85h45"/>
        <path class="art-node" d="M70 42h18v17h17v18H88v17H70V77H53V59h17z"/></g>`,
    },
  ];
  roles.forEach((row, index) => {
    const article = create("article", "featured-work experience-panel");
    const summary = row.querySelector("summary");
    const name = summary.querySelector("h3").textContent;
    const role = summary.querySelector("div > span").textContent;
    const copy = create("div", "featured-copy");
    copy.append(
      create("p", "eyebrow", "EXPERIENCE"),
      create("h3", "", name),
      create("h4", "", role),
      row.querySelector(".experience-detail > p"),
      row.querySelector(".tags"),
    );
    const visual = create(
      "div",
      "role-illustration role-illustration-" + index,
    );
    visual.setAttribute("role", "img");
    visual.setAttribute("aria-label", roleArt[index].label);
    visual.innerHTML = `<svg viewBox="0 0 500 145" aria-hidden="true"><defs><linearGradient id="role-surface-${index}" x2="1" y2="1"><stop stop-color="#477dff"/><stop offset="1" stop-color="#383795"/></linearGradient></defs>${roleArt[index].art}</svg>`;
    visual.style.setProperty("--art-fill", `url(#role-surface-${index})`);
    article.append(copy, visual);
    experienceCards.push(article);
    experienceNames.push(name);
  });
  buildDeck(
    work,
    experienceCards,
    experienceNames,
    "EXPERIENCE ATLAS",
    "Select a station to explore my experience.",
  );
  work.querySelector(".experience-list").remove();

  const projects = document.getElementById("projects");
  const projectCards = [...projects.querySelectorAll(".project-card")];
  buildDeck(
    projects,
    projectCards,
    projectCards.map((card) => card.querySelector("h3").textContent),
    "PROJECT CONSTELLATION",
    "Select a project, or swipe through the deck.",
  );
  projects.querySelector(".project-grid").remove();

  const about = document.getElementById("about");
  const toolkit = about.querySelector(".toolkit");
  const descriptions = [
    "The vocabulary I use to turn an idea into working software, from low-level systems to data pipelines.",
    "Where an implementation becomes an experience. I care about the details people see, feel, and interact with.",
    "The tools behind my work in retrieval, intelligent assistants, recommendation systems, and analytics.",
    "The foundations that move code from an experiment into something people can actually use.",
  ];
  const skills = [...toolkit.querySelectorAll(".skill-row")];
  const skillNames = ["Languages", "Interfaces", "AI & data", "Infrastructure"];
  const skillCards = skills.map((row, i) => {
    const article = create("article", "skill-panel");
    const tokens = create("div", "skill-tokens");
    row
      .querySelector("p")
      .textContent.split(" · ")
      .forEach((value) => tokens.append(create("span", "", value.trim())));
    article.append(
      create("p", "eyebrow", `TOOLKIT / ${pad(i + 1)}`),
      create("h3", "", skillNames[i]),
      create("p", "skill-description", descriptions[i]),
      tokens,
    );
    return article;
  });
  buildDeck(
    about,
    skillCards,
    skillNames,
    "THE WORKING TOOLKIT",
    "Explore the different sides of how I build.",
  );
  toolkit.remove();

  const chapters = [...document.querySelectorAll("main > section[id]")];
  const dockLinks = [...document.querySelectorAll("[data-chapter]")];
  const dock = document.querySelector(".journey-dock");
  let pending = false;
  function updateChapter() {
    pending = false;
    const line = window.innerHeight * 0.4;
    let current = chapters[0];
    chapters.forEach((section) => {
      if (section.getBoundingClientRect().top < line) current = section;
    });
    dockLinks.forEach((link) => {
      if (link.dataset.chapter === current.id)
        link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    dock.dataset.active = current.id;
    // A chapter approaches the visitor in depth as it enters the viewport.
    document.querySelectorAll(".chapter-layout").forEach((layout) => {
      const top = layout.getBoundingClientRect().top;
      const arrival = Math.max(0, Math.min(1, 1 - top / window.innerHeight));
      layout.style.setProperty("--arrival", isPaused() ? 1 : arrival);
    });
  }
  window.addEventListener(
    "scroll",
    () => {
      if (!pending) {
        pending = true;
        requestAnimationFrame(updateChapter);
      }
    },
    { passive: true },
  );
  window.addEventListener("resize", updateChapter, { passive: true });
  document.documentElement.classList.add("spatial-ready");
  updateChapter();
  return {
    select(id, index) {
      decks.get(id)?.select(index);
    },
    refresh: updateChapter,
    decks,
  };
}
