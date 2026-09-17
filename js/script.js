// WPESS site scripts

(function () {
  var preloader = document.getElementById("preloader");
  if (!preloader) return;
  var start = Date.now();
  var minDisplay = 400;
  var hidden = false;

  function hidePreloader() {
    if (hidden) return;
    hidden = true;
    var wait = Math.max(minDisplay - (Date.now() - start), 0);
    window.setTimeout(function () {
      preloader.classList.add("is-hidden");
      window.setTimeout(function () {
        if (preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }, 550);
    }, wait);
  }

  if (document.readyState === "complete") {
    // The load event already fired before this script ran (fast cache hit)
    hidePreloader();
  } else {
    window.addEventListener("load", hidePreloader);
  }
  // Safety net in case the load event never fires (e.g. a broken asset)
  window.setTimeout(hidePreloader, 4000);
})();

function setHeaderHeightVar() {
  var header = document.querySelector(".site-header");
  if (header) {
    document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
  }
}
setHeaderHeightVar();
window.addEventListener("resize", setHeaderHeightVar);
window.addEventListener("load", setHeaderHeightVar);

function updateHeaderScrollState() {
  var header = document.querySelector(".site-header");
  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 10);
  }
}
updateHeaderScrollState();
window.addEventListener("scroll", updateHeaderScrollState, { passive: true });

document.addEventListener("DOMContentLoaded", function () {
  setHeaderHeightVar();
  updateHeaderScrollState();
  var toggle = document.querySelector(".nav-toggle");
  var linksWrap = document.querySelector(".nav-links-wrap");

  function openLinksWrap() {
    linksWrap.classList.add("open");
    linksWrap.style.maxHeight = linksWrap.scrollHeight + "px";
  }

  function closeLinksWrap() {
    linksWrap.classList.remove("open");
    linksWrap.style.maxHeight = "0px";
  }

  if (toggle && linksWrap) {
    toggle.addEventListener("click", function () {
      var isOpen = !linksWrap.classList.contains("open");
      if (isOpen) {
        openLinksWrap();
      } else {
        closeLinksWrap();
      }
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      toggle.classList.toggle("open", isOpen);
    });

    linksWrap.querySelectorAll(".nav-links > li > a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeLinksWrap();
        toggle.setAttribute("aria-expanded", "false");
        toggle.classList.remove("open");
      });
    });

    window.addEventListener("resize", function () {
      if (linksWrap.classList.contains("open")) {
        linksWrap.style.maxHeight = linksWrap.scrollHeight + "px";
      }
    });
  }

  document.querySelectorAll(".mega-toggle").forEach(function (btn) {
    btn.addEventListener("click", function (event) {
      event.preventDefault();
      var item = btn.closest(".has-mega");
      if (!item) return;
      var menu = item.querySelector(".mega-menu");
      var isOpen = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      if (menu) {
        menu.style.maxHeight = isOpen ? menu.scrollHeight + "px" : "0px";
      }
      if (linksWrap && linksWrap.classList.contains("open")) {
        window.requestAnimationFrame(function () {
          linksWrap.style.maxHeight = linksWrap.scrollHeight + "px";
        });
      }
    });
  });

  var searchIndex = [
    { title: "Home", url: "/", keywords: "home wpess women peace envoy south sudan" },
    { title: "About Us", url: "/about/", keywords: "about mission story approach dialogue leadership team magwi county" },
    { title: "Programs", url: "/programs/", keywords: "programs sport for peace football tournament magwi county" },
    { title: "Donate", url: "/donate/", keywords: "donate donation give support bank transfer mobile money" },
    { title: "News & Events", url: "/news/", keywords: "news events updates sport for peace tournament recap newsletter" },
    { title: "Contact", url: "/contact/", keywords: "contact email phone location social media volunteer partner message" }
  ];

  var searchWrap = document.querySelector(".nav-search");
  var searchToggle = document.querySelector(".search-toggle");
  var searchInput = document.querySelector(".nav-search-input");
  var searchResults = document.querySelector(".nav-search-results");

  function renderSearchResults(query) {
    if (!searchResults) return;
    searchResults.innerHTML = "";
    if (!query) return;
    var q = query.trim().toLowerCase();
    if (!q) return;
    var matches = searchIndex.filter(function (page) {
      return page.title.toLowerCase().indexOf(q) !== -1 || page.keywords.indexOf(q) !== -1;
    });
    if (!matches.length) {
      var empty = document.createElement("p");
      empty.className = "nav-search-empty";
      empty.textContent = "No pages found.";
      searchResults.appendChild(empty);
      return;
    }
    matches.forEach(function (page) {
      var a = document.createElement("a");
      a.href = page.url;
      a.textContent = page.title;
      searchResults.appendChild(a);
    });
  }

  if (searchWrap && searchToggle && searchInput) {
    searchToggle.addEventListener("click", function (event) {
      event.stopPropagation();
      var isOpen = searchWrap.classList.toggle("open");
      searchToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      if (isOpen) {
        searchInput.focus();
      }
    });

    searchInput.addEventListener("input", function () {
      renderSearchResults(searchInput.value);
    });

    searchInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        var firstResult = searchResults.querySelector("a");
        if (firstResult) {
          window.location.href = firstResult.getAttribute("href");
        }
      } else if (event.key === "Escape") {
        searchWrap.classList.remove("open");
        searchToggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("click", function (event) {
      if (!searchWrap.contains(event.target)) {
        searchWrap.classList.remove("open");
        searchToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.querySelectorAll("form[data-local-only]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var status = form.querySelector(".form-status");
      if (status) {
        status.textContent = "Thanks! This form isn't connected to a server yet, so nothing was sent — see the code comments for how to wire it up.";
        status.style.color = "#045173";
      }
      form.reset();
    });
  });

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var revealTargets = document.querySelectorAll(
    ".card, .section-heading, .feature-media, .feature-split > div, .news-feature-card, .news-empty-state, .donate-option, .about-value-card, .about-team-card, .about-quote-card, .program-card, .testimonial-card, .partner-logo"
  );

  revealTargets.forEach(function (el) {
    el.classList.add("reveal");
    var siblings = el.parentElement ? Array.from(el.parentElement.children) : [];
    var index = siblings.indexOf(el);
    if (index > 0) {
      el.style.transitionDelay = Math.min(index * 70, 350) + "ms";
    }
  });

  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add("in-view");
    });
  }

  var statNumbers = document.querySelectorAll(".stat-number[data-count]");
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) {
      el.textContent = target.toLocaleString() + suffix;
      return;
    }
    var duration = 1200;
    var start = null;
    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(eased * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }
    window.requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window && statNumbers.length) {
    var countObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    statNumbers.forEach(function (el) {
      countObserver.observe(el);
    });
  } else {
    statNumbers.forEach(animateCount);
  }


  var slideshow = document.querySelector(".hero-slideshow");
  if (slideshow) {
    var slides = Array.prototype.slice.call(slideshow.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(slideshow.querySelectorAll(".hero-slideshow-dots button"));
    var current = 0;
    var slideTimer = null;

    function showSlide(index) {
      slides[current].classList.remove("active");
      if (dots[current]) dots[current].classList.remove("active");
      current = (index + slides.length) % slides.length;
      slides[current].classList.add("active");
      if (dots[current]) dots[current].classList.add("active");
    }

    function startSlideshow() {
      if (reduceMotion || slides.length < 2) return;
      stopSlideshow();
      slideTimer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5000);
    }

    function stopSlideshow() {
      if (slideTimer) {
        window.clearInterval(slideTimer);
        slideTimer = null;
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
        startSlideshow();
      });
    });

    startSlideshow();
  }
});
