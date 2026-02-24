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
