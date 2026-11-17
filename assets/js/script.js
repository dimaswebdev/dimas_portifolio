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

  // Cada gráfico é observado separadamente: em celulares a seção completa
  // pode ser maior que a viewport, impedindo thresholds relativos à seção.
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const skills = [...document.querySelectorAll(".skill-circle")];
  const initialized = new WeakSet();

  function animateSkill(skill) {
    if (initialized.has(skill)) return;
    initialized.add(skill);
    const circle = skill.querySelector(".progress-circle");
    const percentageLabel = skill.querySelector(".skill-percentage");
    const target = Number(skill.dataset.percentageValue) || 0;
    if (!circle || !percentageLabel) return;
    const finalOffset = circumference * (1 - target / 100);

    // Com movimento reduzido, apresentar diretamente o valor correto.
    if (reducedMotion) {
      circle.style.strokeDashoffset = String(finalOffset);
      percentageLabel.textContent = target + "%";
      return;
    }

    // Início no próximo ciclo de pintura, garantindo a transição até mesmo
    // quando o usuário chega à seção imediatamente após o carregamento.
    const duration = 1200;
    let startTime = null;
    function tick(now) {
      if (startTime === null) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      circle.style.strokeDashoffset = String(circumference - (circumference - finalOffset) * easeOut);
      percentageLabel.textContent = Math.round(target * easeOut) + "%";
      if (progress < 1) window.requestAnimationFrame(tick);
    }
    window.requestAnimationFrame(tick);
  }

  skills.forEach(skill => {
    const name = skill.dataset.skill || "Habilidade";
    const percentage = Math.max(0, Math.min(100, Number(skill.dataset.percentage) || 0));
    skill.dataset.percentageValue = String(percentage);
    skill.setAttribute("role", "img");
    skill.setAttribute("aria-label", name + ": nível ilustrativo de " + percentage + "%");
    skill.innerHTML = `<h3>${name}</h3><div class="circle-wrapper"><svg viewBox="0 0 160 160" aria-hidden="true" focusable="false"><circle class="background-circle" cx="80" cy="80" r="70"></circle><circle class="progress-circle" cx="80" cy="80" r="70"></circle></svg><div class="skill-percentage">0%</div></div>`;
    const circle = skill.querySelector(".progress-circle");
    circle.style.strokeDasharray = String(circumference);
    circle.style.strokeDashoffset = String(circumference);
    circle.style.stroke = skill.dataset.color || "#fff";
  });

  if ("IntersectionObserver" in window) {
    const skillObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateSkill(entry.target);
        skillObserver.unobserve(entry.target);
      });
    }, { threshold: 0.01, rootMargin: "0px 0px 40px 0px" });
    skills.forEach(skill => skillObserver.observe(skill));
  } else {
    // Fallback para navegadores sem IntersectionObserver.
    skills.forEach(animateSkill);
  }

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
