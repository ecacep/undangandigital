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
const autoScrollToggle = document.getElementById("autoScrollToggle");

let musicPlaying = false;
let autoScrolling = false;
let autoScrollFrame = null;
let autoScrollLastTime = 0;

window.addEventListener("load", () => {
  if (loader) {
    setTimeout(() => {
      loader.classList.add("hide");
      loader.style.pointerEvents = "none";
    }, 800);
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
    openingScreen.classList.add("hidden");
    openingScreen.style.pointerEvents = "none";

    setTimeout(() => {
      openingScreen.style.display = "none";
    }, 500);

    try {
      if (bgMusic) {
        await bgMusic.play();
        musicPlaying = true;
        if (musicToggle) {
          musicToggle.textContent = "Pause Musik";
        }
      }
    } catch (error) {
      if (musicToggle) {
        musicToggle.textContent = "Putar Musik";
      }
    }
  });
}

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
  const triggerBottom = window.innerHeight * 0.92;

  revealItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    if (rect.top < triggerBottom) {
      item.classList.add("show");
    }
  });
}

window.addEventListener(
  "scroll",
  () => {
    revealOnScroll();
    updateActiveNav();
  },
  { passive: true }
);

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
  if (!navLinks.length) return;

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

updateCountdown();
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

/* AUTO SCROLL */
function autoScrollStep(timestamp) {
  if (!autoScrolling) return;

  if (!autoScrollLastTime) {
    autoScrollLastTime = timestamp;
  }

  const delta = timestamp - autoScrollLastTime;

  // ⬇️ kontrol kecepatan (ubah di sini)
  const speed = 1; // semakin kecil = semakin lambat (0.3 - 1)
  const interval = 20; // semakin besar = semakin santai (20 - 50)

  if (delta >= interval) {
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;

    const currentScroll = window.scrollY || window.pageYOffset;

    if (currentScroll >= maxScroll - 2) {
      stopAutoScroll();
      return;
    }


    window.scrollTo(0, currentScroll + 1);
    autoScrollLastTime = timestamp;
  }

  autoScrollFrame = requestAnimationFrame(autoScrollStep);
}

function startAutoScroll() {
  if (autoScrolling) return;

  autoScrolling = true;
  autoScrollLastTime = 0;

  if (autoScrollToggle) {
    autoScrollToggle.textContent = "Auto Scroll";
  }

  autoScrollFrame = requestAnimationFrame(autoScrollStep);
}

function stopAutoScroll() {
  autoScrolling = false;
  autoScrollLastTime = 0;

  if (autoScrollFrame !== null) {
    cancelAnimationFrame(autoScrollFrame);
    autoScrollFrame = null;
  }

  if (autoScrollToggle) {
    autoScrollToggle.textContent = "Auto Scroll";
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

window.addEventListener("touchstart", stopAutoScroll, { passive: true });
window.addEventListener("wheel", stopAutoScroll, { passive: true });
window.addEventListener("mousedown", stopAutoScroll);
window.addEventListener("keydown", stopAutoScroll);