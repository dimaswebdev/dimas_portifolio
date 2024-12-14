document.addEventListener("DOMContentLoaded", function() {

    // Funções auxiliares para os gráficos de habilidade
    function configurarGraficosIniciais() {
      const skills = document.querySelectorAll(".skill-circle");
      skills.forEach(skill => {
        const skillName = skill.getAttribute("data-skill");
        skill.innerHTML = `
          <h2>${skillName}</h2>
          <div class="circle-wrapper">
            <svg>
              <circle class="background-circle" cx="80" cy="80" r="70"></circle>
              <circle class="progress-circle" cx="80" cy="80" r="70" style="stroke-dashoffset: 0;"></circle>
            </svg>
            <div class="skill-percentage">0%</div>
          </div>
        `;
      });
    }
  
    function carregarGraficos() {
      const skills = document.querySelectorAll(".skill-circle");
      skills.forEach(skill => {
        const percentage = skill.getAttribute("data-percentage");
        const color = skill.getAttribute("data-color");
        const progressCircle = skill.querySelector(".progress-circle");
        const skillPercentage = skill.querySelector(".skill-percentage");
        const radius = 70;
        const circumference = 2 * Math.PI * radius;
        progressCircle.style.stroke = color;
        progressCircle.style.strokeDasharray = circumference;
        progressCircle.style.strokeDashoffset = circumference; 
        let progress = 0;
        const interval = setInterval(() => {
          if (progress >= percentage) {
            clearInterval(interval); 
          } else {
            progress++;
            const offset = circumference - (progress / 100) * circumference;
            progressCircle.style.strokeDashoffset = offset;
            skillPercentage.textContent = `${progress}%`;
          }
        }, 30); 
      });
    }
  
    // Rolagem suave para as seções
    document.querySelectorAll('.navegacao__elemento a').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  
    // Botão "Voltar ao Topo"
    const botaoTopo = document.querySelector("#botao-voltar-topo");
    window.addEventListener('scroll', function() {
      botaoTopo.style.display = window.scrollY > 300 ? "flex" : "none"; 
    });
    botaoTopo.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  
    // Validação do Formulário de Contato
    const formulario = document.querySelector(".contato__formulario");
    if (formulario) {
      const nomeCampo = formulario.querySelector("input[placeholder='Nome']");
      const emailCampo = formulario.querySelector("input[placeholder='E-mail']");
      const mensagemCampo = formulario.querySelector("textarea[placeholder='Mensagem']");
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
      formulario.addEventListener("submit", function(event) {
        let formValido = true;
        formulario.querySelectorAll(".contato__mensagem-erro").forEach(el => el.remove());
        formulario.querySelectorAll(".contato__campo").forEach(el => el.classList.remove("contato__campo--erro"));
  
        const campos = [
          { campo: nomeCampo, mensagem: "Por favor, preencha o seu nome." },
          { campo: emailCampo, mensagem: "Por favor, preencha o seu e-mail.", regex: regexEmail },
          { campo: mensagemCampo, mensagem: "Por favor, escreva uma mensagem." }
        ];
  
        campos.forEach(({ campo, mensagem, regex }) => {
          if (campo.value.trim() === "" || (regex && !regex.test(campo.value))) {
            formValido = false;
            mostrarErro(campo, mensagem);
          }
        });
  
        if (!formValido) event.preventDefault();
      });
  
      function mostrarErro(campo, mensagem) {
        campo.classList.add("contato__campo--erro");
        const mensagemErro = document.createElement("div");
        mensagemErro.classList.add("contato__mensagem-erro");
        mensagemErro.textContent = mensagem;
        campo.parentNode.insertBefore(mensagemErro, campo.nextSibling);
      }
    }
  
    // Gráficos de Círculo de Progresso (Snap.svg)
    function drawCircle(container, id, progress, parent) {
      const svgElement = document.querySelector(container); 
      if (!svgElement) return;
  
      const paper = Snap(svgElement);
      const prog = paper.path("M5,50 A45,45,0 1 1 95,50 A45,45,0 1 1 5,50");
      const lineL = prog.getTotalLength();
      const oneUnit = lineL / 100;
      const toOffset = lineL - oneUnit * progress; 
      const myID = 'circle-graph-' + id;
  
      prog.attr({
        'stroke-dashoffset': lineL,
        'stroke-dasharray': lineL,
        'id': myID,
        stroke: '#f5c14a',
        strokeWidth: 5,
        fill: 'transparent',
      });
  
      const animTime = 1300;
      prog.animate({ 'stroke-dashoffset': toOffset }, animTime, mina.easein);
  
      function countCircle(animTime, parent, progress) {
        const textContainer = document.querySelector(parent).querySelector('.circle-percentage');
        if (!textContainer) return;
        let i = 0;
        const intervalTime = Math.abs(animTime / progress);
        const timerID = setInterval(function() {
          i++;
          textContainer.textContent = i;
          if (i === progress) clearInterval(timerID);
        }, intervalTime);
      }
      countCircle(animTime, parent, progress);
    }
  
    window.addEventListener('load', function() {
      const charts = [
        { selector: '#chart-html', id: 1, progress: 85, parent: '#circle-html' },
        { selector: '#chart-css', id: 2, progress: 80, parent: '#circle-css' },
        { selector: '#chart-js', id: 3, progress: 75, parent: '#circle-js' },
        { selector: '#chart-react', id: 4, progress: 70, parent: '#circle-react' },
        { selector: '#chart-php', id: 5, progress: 65, parent: '#circle-php' },
        { selector: '#chart-ai', id: 6, progress: 85, parent: '#circle-ai' },
        { selector: '#chart-photoshop', id: 7, progress: 80, parent: '#circle-photoshop' }
      ];
      charts.forEach(chart => {
        drawCircle(chart.selector, chart.id, chart.progress, chart.parent);
      });
    });
  
    // Modal para exibir imagens da galeria
    const galleryElements = document.querySelectorAll('.gallery, .gallery-web');
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const closeModal = document.querySelector('.close');
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');
  
    let currentIndex = 0;
    let currentGallery = null;
  
    function openModal(event) {
      const img = event.target;
      if (img.tagName === 'IMG') {
        currentGallery = img.closest('.gallery, .gallery-web');
        const images = currentGallery.querySelectorAll('img');
        currentIndex = Array.from(images).indexOf(img);
        showImage();
        modal.style.display = 'flex';
      }
    }
  
    function showImage() {
      const images = currentGallery.querySelectorAll('img');
      modalImage.src = images[currentIndex].src;
    }
  
    function navigateGallery(step) {
      const images = currentGallery.querySelectorAll('img');
      currentIndex = (currentIndex + step + images.length) % images.length;
      showImage();
    }
  
    galleryElements.forEach(gallery => {
      gallery.addEventListener('click', openModal);
    });
  
    closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  
    prev.addEventListener('click', () => {
      navigateGallery(-1);
    });
  
    next.addEventListener('click', () => {
      navigateGallery(1);
    });
  
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  
    // Menu Hambúrguer
    const toggleButton = document.querySelector('.navegacao__toggle');
    const nav = document.querySelector('.navegacao');
    toggleButton.addEventListener('click', () => {
      nav.classList.toggle('aberto');
    });
  
    // Gráficos de Habilidades com Intersection Observer
    const habilidadesSection = document.querySelector("#habilidades-web");
    configurarGraficosIniciais(); // Configuração inicial dos gráficos
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(carregarGraficos, 1000); // Inicia a animação após 1 segundo
          observer.disconnect(); // Desconecta o observer 
        }
      });
    }, { threshold: 0.5 }); // Ativa quando 50% da seção está visível
  
    observer.observe(habilidadesSection);
  });