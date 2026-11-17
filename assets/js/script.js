"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".navegacao");
  const toggle = document.querySelector(".navegacao__toggle");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scrollBehavior = reducedMotion ? "instant" : "smooth";

  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("aberto");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });
  document.querySelectorAll(".navegacao__elemento a").forEach(link => {
    link.addEventListener("click", event => {
      const selector = link.getAttribute("href");
      const target = selector && document.querySelector(selector);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: scrollBehavior, block: "start" });
      nav?.classList.remove("aberto");
      toggle?.setAttribute("aria-expanded", "false");
      toggle?.setAttribute("aria-label", "Abrir menu");
    });
  });

  const topButton = document.getElementById("botao-voltar-topo");
  const syncTop = () => { if (topButton) topButton.hidden = window.scrollY <= 300; };
  window.addEventListener("scroll", syncTop, { passive: true });
  syncTop();
  topButton?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: scrollBehavior }));

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const skills = [...document.querySelectorAll(".skill-circle")];
  skills.forEach(skill => {
    const name = skill.dataset.skill || "Habilidade";
    const percentage = Math.max(0, Math.min(100, Number(skill.dataset.percentage) || 0));
    skill.setAttribute("role", "img");
    skill.setAttribute("aria-label", name + ": nível ilustrativo de " + percentage + "%");
    skill.innerHTML = `<h3>${name}</h3><div class="circle-wrapper"><svg viewBox="0 0 160 160" aria-hidden="true" focusable="false"><circle class="background-circle" cx="80" cy="80" r="70"></circle><circle class="progress-circle" cx="80" cy="80" r="70"></circle></svg><div class="skill-percentage">${percentage}%</div></div>`;
    const circle = skill.querySelector(".progress-circle");
    circle.style.strokeDasharray = String(circumference);
    circle.style.strokeDashoffset = String(circumference);
    circle.style.stroke = skill.dataset.color || "#fff";
    skill.dataset.target = String(circumference * (1 - percentage / 100));
  });
  const reveal = () => skills.forEach(skill => {
    const circle = skill.querySelector(".progress-circle");
    if (circle) circle.style.strokeDashoffset = skill.dataset.target;
  });
  if ("IntersectionObserver" in window) {
    const section = document.getElementById("habilidades-web");
    if (section) {
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) { reveal(); observer.disconnect(); }
      }, { threshold: 0.15 });
      observer.observe(section);
    }
  } else reveal();

  const modal = document.getElementById("modal");
  const modalImage = document.getElementById("modal-image");
  const close = modal?.querySelector(".close");
  const previous = document.getElementById("prev");
  const next = document.getElementById("next");
  const images = [...document.querySelectorAll(".gallery-item img")];
  let activeIndex = 0;
  let previousFocus = null;
  function show(index) {
    if (!images.length || !modalImage) return;
    activeIndex = (index + images.length) % images.length;
    modalImage.src = images[activeIndex].src;
    modalImage.alt = images[activeIndex].alt;
  }
  function open(index) {
    if (!modal) return;
    previousFocus = document.activeElement;
    show(index);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    close?.focus();
  }
  function dismiss() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    modalImage?.removeAttribute("src");
    previousFocus?.focus?.();
  }
  images.forEach((img, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery-trigger";
    button.setAttribute("aria-label", "Ampliar: " + img.alt);
    img.parentNode.insertBefore(button, img);
    button.appendChild(img);
    button.addEventListener("click", () => open(index));
  });
  close?.addEventListener("click", dismiss);
  previous?.addEventListener("click", () => show(activeIndex - 1));
  next?.addEventListener("click", () => show(activeIndex + 1));
  modal?.addEventListener("click", event => { if (event.target === modal) dismiss(); });
  document.addEventListener("keydown", event => {
    if (!modal?.classList.contains("is-open")) return;
    if (event.key === "Escape") dismiss();
    if (event.key === "ArrowRight") show(activeIndex + 1);
    if (event.key === "ArrowLeft") show(activeIndex - 1);
    if (event.key === "Tab") {
      const buttons = [close, previous, next].filter(Boolean);
      const first = buttons[0], last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
});
