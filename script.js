import { createJourney } from "./journey.js?v=20260906.14";

const matrix = document.querySelector(".matrix-grid");
for (let i = 0; i < 48; i++) matrix.append(document.createElement("i"));
document
  .querySelectorAll(".waveform i")
  .forEach((bar, i) => bar.style.setProperty("--i", i));
document.getElementById("year").textContent = new Date().getFullYear();

// Motion is optional, and the preference applies to every animation on the page.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(pointer: fine)");
const motionButton = document.getElementById("motion-toggle");
let paused = reducedMotion.matches;
try {
  paused ||= sessionStorage.getItem("portfolio-motion-paused") === "true";
} catch {
  /* Storage can be disabled. */
}
let orbitalScene;
let journey;
let SmoothScroll;
let scrollEngine;
function syncSmoothScroll() {
  if (paused || !SmoothScroll) {
    scrollEngine?.destroy();
    scrollEngine = undefined;
    return;
  }
  if (!scrollEngine) {
    scrollEngine = new SmoothScroll({
      autoRaf: true,
      lerp: 0.09,
      smoothWheel: true,
      syncTouch: false,
      anchors: false,
      prevent: (element) => element.tagName === "TEXTAREA",
    });
  }
}
function applyMotionPreference() {
  document.documentElement.classList.toggle("motion-paused", paused);
  motionButton.setAttribute("aria-pressed", String(paused));
  motionButton.innerHTML = paused
    ? '<span aria-hidden="true">▷</span>'
    : '<span aria-hidden="true">Ⅱ</span>';
  motionButton.setAttribute(
    "aria-label",
    paused ? "Resume motion" : "Pause motion",
  );
  motionButton.title = paused ? "Resume motion" : "Pause motion";
  journey?.refresh();
  orbitalScene?.refresh();
  syncSmoothScroll();
}
applyMotionPreference();
motionButton.addEventListener("click", () => {
  paused = !paused;
  try {
    sessionStorage.setItem("portfolio-motion-paused", String(paused));
  } catch {
    /* Optional preference. */
  }
  applyMotionPreference();
});
reducedMotion.addEventListener("change", (event) => {
  paused = event.matches;
  applyMotionPreference();
});

// Optional enhancement. Native scrolling remains available if loading fails.
import("./vendor/lenis.mjs")
  .then(({ default: Constructor }) => {
    SmoothScroll = Constructor;
    syncSmoothScroll();
  })
  .catch((error) =>
    console.warn("Smooth scrolling could not initialize.", error),
  );

// HTML controls and card decks keep working if WebGL is unavailable.
journey = createJourney(
  () => paused,
  (id, index) => orbitalScene?.select(id, index),
);
// Center the visible chapter content, excluding its outer spacing.
function chapterPosition(section) {
  if (section.id === "home") return 0;
  const content = [...section.children].filter((element) =>
    element.matches(
      ".section-heading, .chapter-layout, .about-intro, .contact-copy, form",
    ),
  );
  if (!content.length) return section.offsetTop;
  const top = Math.min(...content.map((element) => element.offsetTop));
  const bottom = Math.max(
    ...content.map((element) => element.offsetTop + element.offsetHeight),
  );
  const headerHeight = document.querySelector(".site-header").offsetHeight;
  const available = window.innerHeight - headerHeight;
  const breathingRoom = Math.max(14, (available - (bottom - top)) / 2);
  const sectionTop = section.getBoundingClientRect().top + window.scrollY;
  return Math.max(0, sectionTop + top - headerHeight - breathingRoom);
}

function navigateChapter(
  section,
  { updateHistory = true, immediate = false } = {},
) {
  scrollEngine?.resize();
  const target = chapterPosition(section);
  const settle = () => {
    const adjusted = chapterPosition(section);
    if (Math.abs(adjusted - window.scrollY) > 2) {
      if (scrollEngine) scrollEngine.scrollTo(adjusted, { immediate: true });
      else window.scrollTo({ top: adjusted, behavior: "instant" });
    }
    journey.refresh();
  };
  if (scrollEngine) {
    scrollEngine.scrollTo(target, {
      duration: 1.05,
      lerp: 0,
      immediate,
      onComplete: settle,
    });
  } else {
    window.scrollTo({
      top: target,
      behavior: paused || immediate ? "instant" : "smooth",
    });
  }
  if (updateHistory && location.hash !== "#" + section.id) {
    history.pushState(null, "", "#" + section.id);
  }
}

document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (
    !link ||
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return;
  const section = document.getElementById(link.hash.slice(1));
  if (!section?.matches("main > section")) return;
  event.preventDefault();
  navigateChapter(section);
});
window.addEventListener("popstate", () => {
  const section = document.getElementById(location.hash.slice(1) || "home");
  if (section?.matches("main > section"))
    navigateChapter(section, { updateHistory: false, immediate: true });
});

import("./orbital.js?v=20260906.14")
  .then(({ createOrbitalScene }) => {
    orbitalScene = createOrbitalScene(() => paused);
    journey.decks.forEach((deck, id) => orbitalScene.select(id, deck.active));
  })
  .catch(() => {
    document.documentElement.classList.add("graphics-fallback");
  });

if ("IntersectionObserver" in window) {
  const reveals = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove("waiting");
        entry.target.classList.add("visible");
        reveals.unobserve(entry.target);
      });
    },
    { threshold: 0.08 },
  );
  document.querySelectorAll(".reveal").forEach((element) => {
    if (element.getBoundingClientRect().top > window.innerHeight && !paused)
      element.classList.add("waiting");
    reveals.observe(element);
  });
}
const progress = document.querySelector(".scroll-progress");
let scrollFrame = 0;
function updateScroll() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0})`;
  scrollFrame = 0;
}
window.addEventListener(
  "scroll",
  () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
  },
  { passive: true },
);
window.addEventListener("resize", updateScroll, { passive: true });
updateScroll();

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (paused || !finePointer.matches || event.pointerType === "touch") return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    card.style.setProperty("--rx", `${(0.5 - y) * 5}deg`);
    card.style.setProperty("--ry", `${(x - 0.5) * 5}deg`);
    card.style.setProperty("--mx", `${x * 100}%`);
    card.style.setProperty("--my", `${y * 100}%`);
  });
  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  });
});

// Preserve the existing EmailJS service. A message is sent only on visitor submit.
const form = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const submit = form.querySelector('button[type="submit"]');
  if (submit.disabled) return;
  const fields = new FormData(form);
  const data = Object.fromEntries(
    ["name", "email", "message"].map((key) => [
      key,
      String(fields.get(key) || "").trim(),
    ]),
  );
  if (Object.values(data).some((value) => !value)) {
    formStatus.textContent = "Please fill out all three fields before sending.";
    return;
  }
  submit.disabled = true;
  submit.textContent = "Sending…";
  formStatus.textContent = "";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          service_id: "service_h4cc44g",
          template_id: "template_2uics96",
          user_id: "424qbLl1CEmdoa7bU",
          template_params: data,
        }),
      },
    );
    if (!response.ok) throw new Error("Message service unavailable");
    form.reset();
    formStatus.textContent = "Message sent. Thanks for reaching out!";
  } catch {
    formStatus.textContent =
      "Couldn’t send right now. Your message is still here. Please try again or use the email link.";
  } finally {
    clearTimeout(timeout);
    submit.disabled = false;
    submit.innerHTML =
      'Send message <span aria-hidden="true"><svg class="link-arrow" viewBox="0 0 24 24" fill="none"><path d="M6 18L18 6M6 6h12v12"/></svg></span>';
  }
});
