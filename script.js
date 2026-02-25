// ============================================
// FORCE SCROLL TO TOP IMMEDIATELY
// ============================================
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

function forceScrollTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

// Force scroll at multiple points
forceScrollTop();
setTimeout(forceScrollTop, 0);
setTimeout(forceScrollTop, 50);
setTimeout(forceScrollTop, 100);

// ============================================
// DARK MODE TOGGLE
// ============================================
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', currentTheme);

themeToggle?.addEventListener('click', () => {
  const currentTheme = htmlElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  htmlElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

// ============================================
// AUTONOMOUS EVE ROBOT
// ============================================
const eve = document.getElementById('eveRobot');
const eveMessage = document.getElementById('eveMessage');

let eveX = window.innerWidth / 2;
let eveY = window.innerHeight / 2;
let targetX = eveX;
let targetY = eveY;
let currentBehavior = 'working';
let behaviorTimer = 0;
let isAngry = false;
let isSleeping = false;
let isGoingToSleep = false;
let sleepTimeoutId = null;
let currentTarget = null;
let isWorking = false;
let workingTimer = 0;
let gearTimeoutId = null;
let isWelcoming = true;
let isStartupPhase = true;

const angryMessages = [
  'Leave me alone! 😤',
  "I'm working here! 😠",
  'Stop bothering me! 💢',
  'Go away! 😡',
  "Can't you see I'm busy? 😒",
  'Not now, human! 🙄'
];

const sleepAngryMessage = 'You will not let me rest right? 😠';
const wakeMessage = 'Yaaawn...';
const welcomeMessage = 'Welcome! Explore the page and have fun.';
const viewportPadding = 30;
const robotSize = { width: 42, height: 60 };

// Get all interactive elements EVE can visit (anywhere on page)
function getVisitableElements(viewportOnly = false) {
  let elements = [
    ...document.querySelectorAll('.btn'),
    ...document.querySelectorAll('.mini-card'),
    ...document.querySelectorAll('.stat'),
    ...document.querySelectorAll('.project'),
    ...document.querySelectorAll('.skill'),
    ...document.querySelectorAll('.badge-card'),
    ...document.querySelectorAll('.timeline-item')
  ];
  
  // During startup phase, only return elements in viewport
  if (viewportOnly) {
    elements = elements.filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight * 2 && rect.bottom > 0;
    });
  }
  
  return elements;
}

function setRobotState(state) {
  if (!eve) return;
  eve.classList.remove('working', 'resting', 'hiding', 'moving', 'sleeping', 'waking', 'angry');
  if (state) {
    eve.classList.add(state);
  }
}

function clearRobotHover() {
  if (currentTarget && currentTarget.classList.contains('btn')) {
    currentTarget.classList.remove('robot-hover');
  }
  currentTarget = null;
}

// Choose random behavior
function chooseBehavior() {
  if (isAngry || isSleeping) return;

  const behaviors = ['working', 'resting', 'hiding', 'moving'];
  const weights = [38, 20, 12, 30];

  const random = Math.random() * 100;
  let cumulative = 0;

  for (let i = 0; i < behaviors.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      currentBehavior = behaviors[i];
      break;
    }
  }

  setRobotState(currentBehavior === 'moving' ? null : currentBehavior);
  clearRobotHover();
  
  // Reset working state when changing behavior
  if (gearTimeoutId) clearTimeout(gearTimeoutId);
  eve.classList.remove('showing-gear');
  isWorking = false;

  switch (currentBehavior) {
    case 'working':
      moveToRandomElement();
      behaviorTimer = 3000 + Math.random() * 4000;
      break;
    case 'resting':
      moveToRandomElement();
      behaviorTimer = 4000 + Math.random() * 3000;
      break;
    case 'hiding':
      moveToRandomElement();
      behaviorTimer = 3000 + Math.random() * 2000;
      break;
    case 'moving':
      moveToRandomElement();
      behaviorTimer = 2000 + Math.random() * 3000;
      break;
  }
}

// Move to random element on page
function moveToRandomElement() {
  // During startup, only target visible viewport elements
  const elements = getVisitableElements(isStartupPhase);
  
  // Reset working state when moving to new element
  if (gearTimeoutId) clearTimeout(gearTimeoutId);
  eve.classList.remove('showing-gear');
  isWorking = false;
  
  const maxPageWidth = document.documentElement.scrollWidth;
  const maxPageHeight = document.documentElement.scrollHeight;

  if (elements.length === 0) {
    targetX = Math.random() * (maxPageWidth - viewportPadding * 2) + viewportPadding;
    targetY = Math.random() * (maxPageHeight - viewportPadding * 2) + viewportPadding;
    return;
  }

  const element = elements[Math.floor(Math.random() * elements.length)];
  currentTarget = element;
  const rect = element.getBoundingClientRect();
  
  // Get scroll offsets to convert viewport coords to page coords
  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;
  
  // Calculate element position in page coordinates
  const elementPageX = scrollX + rect.left;
  const elementPageY = scrollY + rect.top;
  
  // Position robot at bottom-right of element (15px below, centered horizontally)
  targetX = elementPageX + rect.width / 2;
  targetY = elementPageY + rect.height + 15;
  
  // Clamp to page bounds (accounting for robot size)
  targetX = Math.max(viewportPadding, Math.min(maxPageWidth - robotSize.width - viewportPadding, targetX));
  targetY = Math.max(viewportPadding, Math.min(maxPageHeight - robotSize.height - viewportPadding, targetY));
}


function moveToCorner() {
  const padding = viewportPadding;
  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;
  
  // Sleep corners positioned in viewport (visible to user), converted to page coords
  const corners = [
    { x: scrollX + padding, y: scrollY + padding },
    { x: scrollX + window.innerWidth - padding - robotSize.width, y: scrollY + padding },
    { x: scrollX + padding, y: scrollY + window.innerHeight - padding - robotSize.height },
    { x: scrollX + window.innerWidth - padding - robotSize.width, y: scrollY + window.innerHeight - padding - robotSize.height }
  ];
  const corner = corners[Math.floor(Math.random() * corners.length)];
  targetX = corner.x;
  targetY = corner.y;
}

// Show message
function showMessage(text, duration = 2000) {
  if (!eveMessage) return;
  eveMessage.textContent = text;
  eveMessage.classList.add('show');

  setTimeout(() => {
    eveMessage.classList.remove('show');
  }, duration);
}

function startSleepCycle() {
  if (isSleeping || isAngry || isGoingToSleep) return;
  isGoingToSleep = true;
  setRobotState('resting');
  clearRobotHover();
  moveToCorner();

  const sleepDuration = 10000;
  sleepTimeoutId = setTimeout(() => {
    if (isGoingToSleep) {
      isSleeping = true;
      setRobotState('sleeping');
    }
  }, sleepDuration);
}

function wakeUp() {
  isSleeping = false;
  isGoingToSleep = false;
  setRobotState('waking');
  showMessage(wakeMessage, 1500);

  setTimeout(() => {
    setRobotState('working');
    chooseBehavior();
  }, 1500);
  
  // Reset sleep interval
  sleepTimeoutId = null;
}

// Handle click on EVE
eve?.addEventListener('click', (e) => {
  e.stopPropagation();

  if (isAngry) return;

  isAngry = true;
  isWelcoming = false;
  clearRobotHover();
  setRobotState('angry');
  
  // Reset working state when clicked
  if (gearTimeoutId) clearTimeout(gearTimeoutId);
  eve.classList.remove('showing-gear');
  isWorking = false;

  if (isSleeping) {
    isSleeping = false;
    isGoingToSleep = false;
    if (sleepTimeoutId) {
      clearTimeout(sleepTimeoutId);
      sleepTimeoutId = null;
    }
    showMessage(sleepAngryMessage, 2200);
  } else {
    const message = angryMessages[Math.floor(Math.random() * angryMessages.length)];
    showMessage(message, 2000);
  }

  const maxPageWidth = document.documentElement.scrollWidth;
  const maxPageHeight = document.documentElement.scrollHeight;
  targetX = Math.random() * (maxPageWidth - robotSize.width - viewportPadding * 2) + viewportPadding;
  targetY = Math.random() * (maxPageHeight - robotSize.height - viewportPadding * 2) + viewportPadding;

  setTimeout(() => {
    isAngry = false;
    chooseBehavior();
  }, 2500);
});

// Update EVE position and behavior
function updateEve() {
  if (!eve) {
    requestAnimationFrame(updateEve);
    return;
  }

  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;
  const maxPageWidth = document.documentElement.scrollWidth;
  const maxPageHeight = document.documentElement.scrollHeight;

  const dx = targetX - eveX;
  const dy = targetY - eveY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (!isSleeping && !isWelcoming) {
    if (distance > 5) {
      eveX += dx * 0.02;
      eveY += dy * 0.02;
      isWorking = false;

      if (Math.abs(dx) > 4) {
        eve.classList.toggle('flip', dx < 0);
      }
    } else if (distance <= 5 && !isWorking && currentBehavior === 'working') {
      isWorking = true;
      workingTimer = 2000 + Math.random() * 2000;
      if (gearTimeoutId) clearTimeout(gearTimeoutId);
      eve.classList.add('showing-gear');
      gearTimeoutId = setTimeout(() => {
        eve.classList.remove('showing-gear');
      }, workingTimer);
    }
  }

  if (isGoingToSleep && distance < 8) {
    isGoingToSleep = false;
    isSleeping = true;
    setRobotState('sleeping');
    
    // Schedule wake up after 10 seconds of sleep
    setTimeout(() => {
      wakeUp();
    }, 10000);
  }

  // Clamp to page bounds (absolute positioning uses page coordinates)
  eveX = Math.max(viewportPadding, Math.min(maxPageWidth - robotSize.width - viewportPadding, eveX));
  eveY = Math.max(viewportPadding, Math.min(maxPageHeight - robotSize.height - viewportPadding, eveY));

  eve.style.left = eveX + 'px';
  eve.style.top = eveY + 'px';

  eve.classList.remove('away');

  if (currentTarget && currentTarget.classList.contains('btn')) {
    if (!isSleeping && distance < 40) {
      currentTarget.classList.add('robot-hover');
    } else {
      currentTarget.classList.remove('robot-hover');
    }
  }

  if (behaviorTimer > 0) {
    behaviorTimer -= 16;
  } else if (!isAngry && !isSleeping && !isGoingToSleep && !isWelcoming) {
    chooseBehavior();
  }

  requestAnimationFrame(updateEve);
}

// Initialize EVE
setTimeout(() => {
  updateEve();
}, 1000);

setTimeout(() => {
  showMessage(welcomeMessage, 2600);
  eve?.classList.add('waving');
  setTimeout(() => {
    eve?.classList.remove('waving');
    isWelcoming = false;
    chooseBehavior();
  }, 2600);
}, 1200);

// End startup phase after 15 seconds to allow full page exploration
setTimeout(() => {
  isStartupPhase = false;
}, 15000);

setInterval(() => {
  if (!isSleeping && !isAngry && !isWelcoming) {
    startSleepCycle();
  }
}, 50000);

// ============================================
// SCROLL PROGRESS BAR
// ============================================
const scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress() {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight - windowHeight;
  const scrolled = window.pageYOffset;
  const progress = (scrolled / documentHeight) * 100;
  
  if (scrollProgress) {
    scrollProgress.style.width = progress + '%';
  }
}

window.addEventListener('scroll', updateScrollProgress);

// ============================================
// SCROLL TO TOP BUTTON
// ============================================
const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    scrollToTopBtn?.classList.add('visible');
  } else {
    scrollToTopBtn?.classList.remove('visible');
  }
});

scrollToTopBtn?.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ============================================
// PARTICLE ANIMATION
// ============================================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas?.getContext('2d');

if (canvas && ctx) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = 50;

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 1 - 0.5;
      this.speedY = Math.random() * 1 - 0.5;
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0) {
        this.reset();
      }
    }

    draw() {
      ctx.fillStyle = `rgba(255, 107, 53, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });

    // Draw connections between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          ctx.strokeStyle = `rgba(11, 114, 133, ${0.15 * (1 - distance / 120)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animateParticles);
  }

  animateParticles();

  // Resize canvas on window resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ============================================
// PARALLAX SCROLLING
// ============================================
const orbOne = document.querySelector('.bg-orb--one');
const orbTwo = document.querySelector('.bg-orb--two');

window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  
  if (orbOne) {
    orbOne.style.transform = `translateY(${scrolled * 0.3}px)`;
  }
  
  if (orbTwo) {
    orbTwo.style.transform = `translateY(${-scrolled * 0.2}px)`;
  }
});

// ============================================
// EASTER EGGS - KONAMI CODE
// ============================================
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      triggerEasterEgg();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

function triggerEasterEgg() {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'easter-egg-overlay';
  
  // Create modal
  const modal = document.createElement('div');
  modal.className = 'easter-egg-modal';
  modal.innerHTML = `
    <h2>🎉 DevOps Achievement Unlocked! 🎉</h2>
    <p>You found the secret Konami code! Here's a special pipeline for you:</p>
    <pre>
#!/bin/bash
echo "🚀 Deploying easter egg..."
terraform init
terraform plan -out=fun.tfplan
terraform apply fun.tfplan
echo "✅ Deployment successful!"
echo "💯 Uptime: 100%"
echo "🎊 You're hired!"
    </pre>
    <button class="btn" onclick="this.parentElement.parentElement.querySelectorAll('.easter-egg-overlay, .easter-egg-modal').forEach(el => {el.classList.remove('show'); setTimeout(() => el.remove(), 300);})">
      Close (and keep the secret!)
    </button>
  `;
  
  document.body.appendChild(overlay);
  document.body.appendChild(modal);
  
  // Trigger animation
  setTimeout(() => {
    overlay.classList.add('show');
    modal.classList.add('show');
  }, 10);
  
  // Close on overlay click
  overlay.addEventListener('click', () => {
    overlay.classList.remove('show');
    modal.classList.remove('show');
    setTimeout(() => {
      overlay.remove();
      modal.remove();
    }, 300);
  });
  
  // Console easter egg
  console.log('%c🎉 KONAMI CODE ACTIVATED! 🎉', 'font-size: 20px; color: #ff6b35; font-weight: bold;');
  console.log('%cWelcome to the secret DevOps club!', 'font-size: 14px; color: #0b7285;');
}

// Console greetings easter egg
console.log('%cHey there, fellow DevOps engineer! 👋', 'font-size: 16px; color: #ff6b35; font-weight: bold;');
console.log('%cLike what you see? Try the Konami code: ↑ ↑ ↓ ↓ ← → ← → B A', 'font-size: 12px; color: #0b7285;');

// ============================================
// 3D TILT EFFECT ON CARDS
// ============================================
const tiltCards = document.querySelectorAll('.mini-card, .project, .skill, .hero-card, .timeline-item');

tiltCards.forEach(card => {
  card.addEventListener('mousemove', handleTilt);
  card.addEventListener('mouseleave', resetTilt);
});

function handleTilt(e) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  const rotateX = ((y - centerY) / centerY) * -10; // Reduced from -15 to -10 for subtlety
  const rotateY = ((x - centerX) / centerX) * 10;
  
  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
}

function resetTilt(e) {
  const card = e.currentTarget;
  card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
}

// ============================================
// ORIGINAL FUNCTIONALITY
// ============================================
const revealItems = document.querySelectorAll("[data-reveal]");
const navLinks = document.querySelectorAll(".nav-links a");
const statValues = document.querySelectorAll(".stat-value");
const chips = document.querySelectorAll(".chip");
const projects = document.querySelectorAll(".project");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      }
    });
  },
  { threshold: 0.2 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const targetId = entry.target.getAttribute("id");
      if (!targetId) return;
      const link = document.querySelector(`.nav-links a[href="#${targetId}"]`);
      if (link && entry.isIntersecting) {
        navLinks.forEach((nav) => nav.classList.remove("is-active"));
        link.classList.add("is-active");
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll("main section[id]").forEach((section) => {
  sectionObserver.observe(section);
});

const statObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = entry.target;
      const endValue = Number(target.dataset.count);
      const isFloat = String(endValue).includes(".");
      let start = 0;
      const step = () => {
        start += endValue / 40;
        if (start >= endValue) {
          target.textContent = endValue.toString();
          observer.unobserve(target);
          return;
        }
        target.textContent = isFloat ? start.toFixed(2) : Math.round(start).toString();
        requestAnimationFrame(step);
      };
      step();
    });
  },
  { threshold: 0.8 }
);

statValues.forEach((stat) => statObserver.observe(stat));

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((item) => item.classList.remove("is-active"));
    chip.classList.add("is-active");

    const filter = chip.dataset.filter;
    projects.forEach((project) => {
      if (filter === "all") {
        project.style.display = "grid";
        return;
      }
      const tags = project.dataset.tags.split(" ");
      project.style.display = tags.includes(filter) ? "grid" : "none";
    });
  });
});
