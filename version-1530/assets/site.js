(function () {
  var menuToggle = document.querySelector("[data-menu-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
  var currentSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("active", slideIndex === currentSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("active", dotIndex === currentSlide);
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(currentSlide + 1);
    }, 5200);
  }

  var globalSearch = document.querySelector("[data-global-search]");
  var globalSearchInput = document.querySelector("[data-global-search-input]");

  if (globalSearch && globalSearchInput) {
    globalSearch.addEventListener("submit", function (event) {
      event.preventDefault();
      var keyword = globalSearchInput.value.trim();
      if (keyword) {
        window.location.href = "search.html?q=" + encodeURIComponent(keyword);
      }
    });
  }

  var pageSearch = document.querySelector("[data-page-search]");
  var yearFilter = document.querySelector("[data-filter-year]");
  var typeFilter = document.querySelector("[data-filter-type]");
  var categoryFilter = document.querySelector("[data-filter-category]");
  var list = document.querySelector("[data-filter-list]");

  function applyFilters() {
    if (!list) {
      return;
    }

    var keyword = pageSearch ? pageSearch.value.trim().toLowerCase() : "";
    var minYear = yearFilter && yearFilter.value ? Number(yearFilter.value) : 0;
    var typeValue = typeFilter ? typeFilter.value : "";
    var categoryValue = categoryFilter ? categoryFilter.value : "";
    var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));

    cards.forEach(function (card) {
      var text = [
        card.getAttribute("data-title"),
        card.getAttribute("data-region"),
        card.getAttribute("data-type"),
        card.getAttribute("data-genre")
      ].join(" ").toLowerCase();
      var year = Number(card.getAttribute("data-year")) || 0;
      var type = card.getAttribute("data-type") || "";
      var categoryText = card.querySelector(".card-meta a") ? card.querySelector(".card-meta a").textContent : "";
      var visible = true;

      if (keyword && text.indexOf(keyword) === -1) {
        visible = false;
      }

      if (minYear && year < minYear) {
        visible = false;
      }

      if (typeValue && type.indexOf(typeValue) === -1) {
        visible = false;
      }

      if (categoryValue && categoryText !== categoryValue) {
        visible = false;
      }

      card.style.display = visible ? "" : "none";
    });
  }

  [pageSearch, yearFilter, typeFilter, categoryFilter].forEach(function (control) {
    if (control) {
      control.addEventListener("input", applyFilters);
      control.addEventListener("change", applyFilters);
    }
  });

  if (pageSearch) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q");
    if (query) {
      pageSearch.value = query;
    }
    applyFilters();
  }
}());
