"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const motion = reduceMotion ? "instant" : "smooth";
  const mobileToggle = document.querySelector(".mobile-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const header = document.querySelector(".site-header");
  const pageLinks = [...document.querySelectorAll('a[href^="#"]')];
  const mainLinks = [...document.querySelectorAll('.desktop-nav a')];

  function closeMobileMenu() {
    if (!mobileMenu || !mobileToggle) return;
    mobileMenu.hidden = true;
    mobileToggle.setAttribute("aria-expanded", "false");
    mobileToggle.setAttribute("aria-label", "Abrir menu");
  }
  mobileToggle?.addEventListener("click", () => {
    if (!mobileMenu) return;
    const opening = mobileMenu.hidden;
    mobileMenu.hidden = !opening;
    mobileToggle.setAttribute("aria-expanded", String(opening));
    mobileToggle.setAttribute("aria-label", opening ? "Fechar menu" : "Abrir menu");
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !mobileMenu?.hidden) {
      closeMobileMenu();
      mobileToggle?.focus();
    }
  });
  document.addEventListener("click", event => {
    if (!mobileMenu?.hidden && !mobileMenu.contains(event.target) && !header?.contains(event.target)) closeMobileMenu();
  });
  pageLinks.forEach(link => {
    link.addEventListener("click", event => {
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.getElementById(hash.slice(1));
      if (!target) return;
      event.preventDefault();
      closeMobileMenu();
      target.scrollIntoView({ behavior: motion, block: "start" });
      if (location.hash !== hash) history.pushState(null, "", hash);
    });
  });
  window.addEventListener("popstate", () => {
    const target = location.hash && document.getElementById(location.hash.slice(1));
    (target || document.getElementById("inicio"))?.scrollIntoView({ behavior: motion, block: "start" });
  });

  const sections = [...document.querySelectorAll("main > section[id]")];
  let scrollFrame = 0;
  function updateActive() {
    scrollFrame = 0;
    const probe = innerHeight * .36;
    const active = sections.find(section => {
      const r = section.getBoundingClientRect();
      return r.top <= probe && r.bottom > probe;
    });
    mainLinks.forEach(link => {
      if (active && link.hash === "#" + active.id) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }
  addEventListener("scroll", () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateActive); }, { passive:true });
  addEventListener("resize", updateActive);
  updateActive();

  const revealElements = [...document.querySelectorAll("[data-reveal]")];
  if ("IntersectionObserver" in window && !reduceMotion) {
    document.body.classList.add("motion-enabled");
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .07, rootMargin: "0px 0px 20px 0px" });
    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add("is-visible"));
  }
  const skills = [...document.querySelectorAll(".skill-item")];
  skills.forEach(skill => {
    const value = Math.max(0, Math.min(100, Number(skill.dataset.level) || 0));
    skill.setAttribute("aria-label", skill.querySelector("span")?.textContent + ": " + value + "%");
    skill.querySelector(".skill-track")?.setAttribute("aria-hidden", "true");
  });
  if ("IntersectionObserver" in window) {
    const skillObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const value = Math.max(0, Math.min(100, Number(entry.target.dataset.level) || 0));
        entry.target.style.setProperty("--progress", entry.isIntersecting ? value + "%" : "0%");
      });
    }, { threshold:.2 });
    skills.forEach(skill => skillObserver.observe(skill));
  } else {
    skills.forEach(skill => skill.style.setProperty("--progress", skill.dataset.level + "%"));
  }

  const filterButtons = [...document.querySelectorAll(".filter")];
  const cards = [...document.querySelectorAll(".project-card")];
  const featured = document.querySelector(".project-featured");
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter;
      filterButtons.forEach(item => {
        const current = item === button;
        item.classList.toggle("is-active", current);
        item.setAttribute("aria-pressed", String(current));
      });
      cards.forEach(card => { card.hidden = category !== "all" && card.dataset.category !== category; });
      // Evita uma grade vazia ou desproporcional quando o visitante filtra os projetos.
      featured?.classList.toggle("project-featured", category === "all");
    });
  });

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxCounter = document.getElementById("lightbox-counter");
  const previews = [...document.querySelectorAll("[data-project]")];
  let activeProject = 0, lastFocus = null;
  function renderProject(index) {
    if (!lightboxImage || !previews.length) return;
    activeProject = (index + previews.length) % previews.length;
    const item = previews[activeProject];
    const img = item.querySelector("img");
    lightboxImage.src = img.currentSrc || img.src;
    lightboxImage.alt = img.alt;
    lightboxTitle.textContent = item.closest(".project-card")?.querySelector("h3")?.textContent || "Projeto";
    lightboxCounter.textContent = String(activeProject + 1).padStart(2,"0") + " / " + String(previews.length).padStart(2,"0");
  }
  previews.forEach((preview, index) => preview.addEventListener("click", () => {
    lastFocus = document.activeElement;
    renderProject(index);
    if (typeof lightbox?.showModal === "function") lightbox.showModal();
  }));
  function closeLightbox() { lightbox?.close(); }
  document.getElementById("lightbox-close")?.addEventListener("click", closeLightbox);
  document.getElementById("lightbox-prev")?.addEventListener("click", () => renderProject(activeProject - 1));
  document.getElementById("lightbox-next")?.addEventListener("click", () => renderProject(activeProject + 1));
  lightbox?.addEventListener("click", event => {
    if (event.target === lightbox) closeLightbox();
  });
  lightbox?.addEventListener("close", () => {
    lightboxImage?.removeAttribute("src");
    lastFocus?.focus?.();
  });
  document.addEventListener("keydown", event => {
    if (!lightbox?.open) return;
    if (event.key === "ArrowRight") { event.preventDefault(); renderProject(activeProject + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); renderProject(activeProject - 1); }
  });
});
