(function () {
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealItems.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
    );
    revealItems.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealItems.forEach(function (el) {
      el.classList.add("is-in");
    });
  }

  var navToggle = document.getElementById("nav-toggle");
  if (navToggle) {
    document.querySelectorAll(".site-nav a").forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.checked = false;
      });
    });
  }

  var track = document.querySelector("[data-slider]");
  if (track) {
    var slides = Array.prototype.slice.call(track.querySelectorAll(".home-slide"));
    var dotsWrap = document.querySelector("[data-slider-dots]");
    var index = 0;
    var timer;

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (slide, n) {
        slide.classList.toggle("is-active", n === index);
      });
      if (dotsWrap) {
        Array.prototype.forEach.call(dotsWrap.children, function (dot, n) {
          dot.classList.toggle("is-active", n === index);
        });
      }
    }

    function next() {
      goTo(index + 1);
    }

    function prev() {
      goTo(index - 1);
    }

    function restart() {
      clearInterval(timer);
      timer = setInterval(next, 5500);
    }

    if (dotsWrap) {
      slides.forEach(function (_slide, n) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("aria-label", "Go to slide " + (n + 1));
        if (n === 0) btn.classList.add("is-active");
        btn.addEventListener("click", function () {
          goTo(n);
          restart();
        });
        dotsWrap.appendChild(btn);
      });
    }

    var nextBtn = document.querySelector("[data-slider-next]");
    var prevBtn = document.querySelector("[data-slider-prev]");
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        next();
        restart();
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        prev();
        restart();
      });
    }

    restart();
  }

  var lightboxTriggers = Array.prototype.slice.call(
    document.querySelectorAll(".lightbox-trigger")
  );
  if (lightboxTriggers.length) {
    var overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.setAttribute("hidden", "");
    overlay.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Close">&times;</button>' +
      '<button type="button" class="lightbox-nav lightbox-prev" aria-label="Previous image">‹</button>' +
      '<button type="button" class="lightbox-nav lightbox-next" aria-label="Next image">›</button>' +
      '<img class="lightbox-image" alt="" />' +
      '<p class="lightbox-count" aria-live="polite"></p>';
    document.body.appendChild(overlay);

    var lightboxImg = overlay.querySelector(".lightbox-image");
    var lightboxCount = overlay.querySelector(".lightbox-count");
    var closeBtn = overlay.querySelector(".lightbox-close");
    var prevBtn = overlay.querySelector(".lightbox-prev");
    var nextBtn = overlay.querySelector(".lightbox-next");
    var currentIndex = 0;
    var total = lightboxTriggers.length;

    function showAt(index) {
      currentIndex = (index + total) % total;
      var link = lightboxTriggers[currentIndex];
      var img = link.querySelector("img");
      lightboxImg.src = link.getAttribute("href");
      lightboxImg.alt = img ? img.alt : "";
      lightboxCount.textContent = currentIndex + 1 + " of " + total;
    }

    function openLightbox(index) {
      showAt(index);
      overlay.removeAttribute("hidden");
      document.body.classList.add("lightbox-open");
      closeBtn.focus();
    }

    function closeLightbox() {
      overlay.setAttribute("hidden", "");
      document.body.classList.remove("lightbox-open");
      lightboxImg.removeAttribute("src");
      lightboxImg.alt = "";
    }

    lightboxTriggers.forEach(function (link, index) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        openLightbox(index);
      });
    });

    closeBtn.addEventListener("click", closeLightbox);
    prevBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      showAt(currentIndex - 1);
    });
    nextBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      showAt(currentIndex + 1);
    });
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (overlay.hasAttribute("hidden")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showAt(currentIndex - 1);
      if (e.key === "ArrowRight") showAt(currentIndex + 1);
    });
  }
})();
