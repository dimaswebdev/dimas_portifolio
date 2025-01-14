document.addEventListener("DOMContentLoaded", function () {
  const RADIUS = 70;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  function configurarGraficosIniciais() {
    document.querySelectorAll(".skill-circle").forEach((skill) => {
      const skillName = skill.getAttribute("data-skill");
      skill.innerHTML = `
        <h2>${skillName}</h2>
        <div class="circle-wrapper">
          <svg>
            <circle class="background-circle" cx="80" cy="80" r="${RADIUS}"></circle>
            <circle class="progress-circle" cx="80" cy="80" r="${RADIUS}" style="stroke-dashoffset: ${CIRCUMFERENCE};"></circle>
          </svg>
          <div class="skill-percentage">0%</div>
        </div>
      `;
    });
  }

  function carregarGraficos() {
    document.querySelectorAll(".skill-circle").forEach((skill) => {
      const percentage = skill.getAttribute("data-percentage");
      const color = skill.getAttribute("data-color");
      const progressCircle = skill.querySelector(".progress-circle");
      const skillPercentage = skill.querySelector(".skill-percentage");

      progressCircle.style.stroke = color;
      progressCircle.style.strokeDasharray = CIRCUMFERENCE;
      progressCircle.style.strokeDashoffset = CIRCUMFERENCE;

      let progress = 0;
      const interval = setInterval(() => {
        if (progress >= percentage) {
          clearInterval(interval);
        } else {
          progress++;
          const offset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;
          progressCircle.style.strokeDashoffset = offset;
          skillPercentage.textContent = `${progress}%`;
        }
      }, 30);
    });
  }

  // Rolagem suave
  document.querySelectorAll(".navegacao__elemento a").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetElement = document.querySelector(this.getAttribute("href"));
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Botão "Voltar ao Topo"
  const botaoTopo = document.querySelector("#botao-voltar-topo");
  window.addEventListener("scroll", function () {
    botaoTopo.style.display = window.scrollY > 300 ? "flex" : "none";
  });
  botaoTopo.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Menu Hambúrguer
  const toggleButton = document.querySelector(".navegacao__toggle");
  const nav = document.querySelector(".navegacao");
  toggleButton.addEventListener("click", () => {
    nav.classList.toggle("aberto");
  });

  // Gráficos de Habilidades
  configurarGraficosIniciais();

  const habilidadesSection = document.querySelector("#habilidades-web");
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(carregarGraficos, 1000);
          observer.disconnect();
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(habilidadesSection);
});
