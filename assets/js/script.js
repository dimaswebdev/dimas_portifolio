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
  // Gráficos podem repetir a animação sempre que voltam à área visível.
  // Cada gráfico controla seu próprio frame para não acumular animações.
  const animationFrames = new WeakMap();
  const visibleSkills = new WeakSet();

  function resetSkill(skill) {
    const frame = animationFrames.get(skill);
    if (frame !== undefined) {
      cancelAnimationFrame(frame);
      animationFrames.delete(skill);
    }
    const circle = skill.querySelector(".progress-circle");
    const label = skill.querySelector(".skill-percentage");
    if (circle) circle.style.strokeDashoffset = String(circumference);
    if (label) label.textContent = "0%";
  }

  function animateSkill(skill) {
    resetSkill(skill);
    const circle = skill.querySelector(".progress-circle");
    const label = skill.querySelector(".skill-percentage");
    if (!circle || !label) return;
    const target = Number(skill.dataset.percentageValue) || 0;
    const finalOffset = circumference * (1 - target / 100);

    if (reducedMotion) {
      circle.style.strokeDashoffset = String(finalOffset);
      label.textContent = target + "%";
      return;
    }

    const duration = 1200;
    let startTime = null;
    function tick(now) {
      if (startTime === null) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      circle.style.strokeDashoffset = String(circumference - (circumference - finalOffset) * eased);
      label.textContent = Math.round(target * eased) + "%";
      if (progress < 1) {
        animationFrames.set(skill, requestAnimationFrame(tick));
      } else {
        animationFrames.delete(skill);
      }
    }
    animationFrames.set(skill, requestAnimationFrame(tick));
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

  function updateSkillVisibility(skill, isVisible) {
    if (isVisible) {
      if (!visibleSkills.has(skill)) {
        visibleSkills.add(skill);
        animateSkill(skill);
      }
    } else if (visibleSkills.has(skill)) {
      visibleSkills.delete(skill);
      resetSkill(skill);
    }
  }

  if ("IntersectionObserver" in window) {
    const skillObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        // Observação permanente: ao sair, reinicia; ao entrar, anima de novo.
        updateSkillVisibility(entry.target, entry.isIntersecting && entry.intersectionRatio >= 0.15);
      });
    }, { threshold: [0, 0.15, 0.5], rootMargin: "0px" });
    skills.forEach(skill => skillObserver.observe(skill));
  } else {
    // Alternativa para navegadores antigos: checagem leve durante a rolagem.
    let checkPending = false;
    function checkSkills() {
      checkPending = false;
      skills.forEach(skill => {
        const rect = skill.getBoundingClientRect();
        const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
        updateSkillVisibility(skill, rect.height > 0 && visibleHeight / rect.height >= 0.15);
      });
    }
    function scheduleSkillCheck() {
      if (!checkPending) {
        checkPending = true;
        requestAnimationFrame(checkSkills);
      }
    }
    window.addEventListener("scroll", scheduleSkillCheck, { passive: true });
    window.addEventListener("resize", scheduleSkillCheck);
    scheduleSkillCheck();
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
