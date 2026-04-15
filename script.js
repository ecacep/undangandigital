const loader = document.getElementById("loader");
const openingScreen = document.getElementById("openingScreen");
const openInvitationBtn = document.getElementById("openInvitation");
const musicToggle = document.getElementById("musicToggle");
const bgMusic = document.getElementById("bgMusic");
const revealItems = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".floating-nav a");
const wishForm = document.getElementById("wishForm");
const wishList = document.getElementById("wishList");
const copyButtons = document.querySelectorAll(".copy-btn");
const guestName = document.getElementById("guestName");

let musicPlaying = false;

window.addEventListener("load", () => {
  window.scrollTo(0, 0);

  if (loader) {
    setTimeout(() => {
      loader.classList.add("hide");
    }, 1200);
  }

  setupGuestName();
  revealOnScroll();
  updateCountdown();
  updateActiveNav();
});

function setupGuestName() {
  if (!guestName) return;

  const params = new URLSearchParams(window.location.search);
  const to = params.get("to");

  if (to && to.trim() !== "") {
    guestName.textContent = decodeURIComponent(to.replace(/\+/g, " "));
  }
}

if (openInvitationBtn && openingScreen) {
  openInvitationBtn.addEventListener("click", async () => {
    window.scrollTo(0, 0);

    openingScreen.classList.add("hidden");
    openingScreen.style.pointerEvents = "none";

    setTimeout(() => {
      openingScreen.style.display = "none";
    }, 700);

    try {
      if (bgMusic) {
        await bgMusic.play();
        musicPlaying = true;
        if (musicToggle) musicToggle.textContent = "Pause Musik";
      }
    } catch (error) {
      if (musicToggle) musicToggle.textContent = "Putar Musik";
    }
  });
}

window.addEventListener("pageshow", () => {
  window.scrollTo(0, 0);
});

if (musicToggle && bgMusic) {
  musicToggle.addEventListener("click", async () => {
    try {
      if (musicPlaying) {
        bgMusic.pause();
        musicPlaying = false;
        musicToggle.textContent = "Putar Musik";
      } else {
        await bgMusic.play();
        musicPlaying = true;
        musicToggle.textContent = "Pause Musik";
      }
    } catch (error) {
      musicToggle.textContent = "Musik Gagal";
    }
  });
}

function revealOnScroll() {
  const triggerBottom = window.innerHeight * 0.88;

  revealItems.forEach((item, index) => {
    const rect = item.getBoundingClientRect();

    if (rect.top < triggerBottom) {
      setTimeout(() => {
        item.classList.add("show");
      }, index * 45);
    }
  });
}

window.addEventListener("scroll", () => {
  revealOnScroll();
  updateActiveNav();
  parallaxOrbs();
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (event) {
    const href = this.getAttribute("href");
    if (!href || href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

function updateActiveNav() {
  const sections = document.querySelectorAll("main section, header.hero");

  sections.forEach((section) => {
    const top = window.scrollY;
    const offset = section.offsetTop - 180;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");

    if (top >= offset && top < offset + height) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${id}`) {
          link.classList.add("active");
        }
      });
    }
  });
}

function parallaxOrbs() {
  const scrolled = window.scrollY;
  const orb1 = document.querySelector(".orb-1");
  const orb2 = document.querySelector(".orb-2");
  const orb3 = document.querySelector(".orb-3");

  if (orb1) orb1.style.transform = `translateY(${scrolled * 0.08}px)`;
  if (orb2) orb2.style.transform = `translateY(${scrolled * -0.05}px)`;
  if (orb3) orb3.style.transform = `translateY(${scrolled * 0.04}px)`;
}

const targetDate = new Date("May 20, 2026 08:00:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetDate - now;

  const days = document.getElementById("days");
  const hours = document.getElementById("hours");
  const minutes = document.getElementById("minutes");
  const seconds = document.getElementById("seconds");

  if (!days || !hours || !minutes || !seconds) return;

  if (distance <= 0) {
    days.textContent = "00";
    hours.textContent = "00";
    minutes.textContent = "00";
    seconds.textContent = "00";
    return;
  }

  const d = Math.floor(distance / (1000 * 60 * 60 * 24));
  const h = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const m = Math.floor((distance / (1000 * 60)) % 60);
  const s = Math.floor((distance / 1000) % 60);

  days.textContent = String(d).padStart(2, "0");
  hours.textContent = String(h).padStart(2, "0");
  minutes.textContent = String(m).padStart(2, "0");
  seconds.textContent = String(s).padStart(2, "0");
}


setInterval(updateCountdown, 1000);

if (wishForm && wishList) {
  wishForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const attendance = document.getElementById("attendance")?.value;
    const message = document.getElementById("message")?.value.trim();

    if (!name || !attendance || !message) return;

    const item = document.createElement("article");
    item.className = "wish-item";
    item.innerHTML = `
      <h4>${escapeHtml(name)}</h4>
      <small>${escapeHtml(attendance)}</small>
      <p>${escapeHtml(message)}</p>
    `;

    wishList.prepend(item);
    wishForm.reset();
  });
}

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy;

    try {
      await navigator.clipboard.writeText(value);
      const originalText = button.textContent;
      button.textContent = "Tersalin";
      setTimeout(() => {
        button.textContent = originalText;
      }, 1500);
    } catch (error) {
      button.textContent = "Gagal Salin";
      setTimeout(() => {
        button.textContent = "Salin Nomor";
      }, 1500);
    }
  });
});

function escapeHtml(text) {
  const div = document.createElement("div");
  div.innerText = text;
  return div.innerHTML;
}

const autoScrollToggle = document.getElementById("autoScrollToggle");
let autoScrollInterval = null;
let autoScrolling = false;

function startAutoScroll() {
  stopAutoScroll();

  autoScrolling = true;
  if (autoScrollToggle) autoScrollToggle.textContent = "Stop Scroll";

  autoScrollInterval = setInterval(() => {
    const atBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 4;

    if (atBottom) {
      stopAutoScroll();
      return;
    }

    window.scrollBy({
      top: 2,
      left: 0,
      behavior: "auto",
    });
  }, 16);
}

function stopAutoScroll() {
  autoScrolling = false;
  if (autoScrollToggle) autoScrollToggle.textContent = "Auto Scroll";

  if (autoScrollInterval) {
    clearInterval(autoScrollInterval);
    autoScrollInterval = null;
  }
}

if (autoScrollToggle) {
  autoScrollToggle.addEventListener("click", () => {
    if (autoScrolling) {
      stopAutoScroll();
    } else {
      startAutoScroll();
    }
  });
}