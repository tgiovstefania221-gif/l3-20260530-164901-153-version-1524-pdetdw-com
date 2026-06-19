(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var menuButton = document.querySelector(".menu-toggle");
        var navLinks = document.querySelector(".nav-links");
        if (menuButton && navLinks) {
            menuButton.addEventListener("click", function () {
                navLinks.classList.toggle("open");
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === current);
            });
        }

        function startTimer() {
            if (slides.length < 2) {
                return;
            }
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5600);
        }

        var prev = document.querySelector("[data-hero-prev]");
        var next = document.querySelector("[data-hero-next]");
        if (prev) {
            prev.addEventListener("click", function () {
                showSlide(current - 1);
                startTimer();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                showSlide(current + 1);
                startTimer();
            });
        }
        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                showSlide(index);
                startTimer();
            });
        });
        startTimer();

        var searchInput = document.getElementById("searchInput");
        var yearFilter = document.getElementById("yearFilter");
        var regionFilter = document.getElementById("regionFilter");
        var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
        var emptyResult = document.getElementById("emptyResult");
        var activeCategory = "";

        function normalize(value) {
            return String(value || "").toLowerCase().trim();
        }

        function applyFilters() {
            if (!cards.length) {
                return;
            }
            var query = normalize(searchInput && searchInput.value);
            var year = normalize(yearFilter && yearFilter.value);
            var region = normalize(regionFilter && regionFilter.value);
            var visible = 0;
            cards.forEach(function (card) {
                var text = normalize(card.getAttribute("data-search"));
                var cardYear = normalize(card.getAttribute("data-year"));
                var cardRegion = normalize(card.getAttribute("data-region"));
                var cardCategory = normalize(card.getAttribute("data-category"));
                var matched = true;
                if (query && text.indexOf(query) === -1) {
                    matched = false;
                }
                if (year && cardYear !== year) {
                    matched = false;
                }
                if (region && cardRegion !== region) {
                    matched = false;
                }
                if (activeCategory && cardCategory !== activeCategory) {
                    matched = false;
                }
                card.style.display = matched ? "" : "none";
                if (matched) {
                    visible += 1;
                }
            });
            if (emptyResult) {
                emptyResult.classList.toggle("show", visible === 0);
            }
        }

        [searchInput, yearFilter, regionFilter].forEach(function (element) {
            if (element) {
                element.addEventListener("input", applyFilters);
                element.addEventListener("change", applyFilters);
            }
        });

        Array.prototype.slice.call(document.querySelectorAll("[data-category-filter]")).forEach(function (button) {
            button.addEventListener("click", function () {
                activeCategory = normalize(button.getAttribute("data-category-filter"));
                Array.prototype.slice.call(document.querySelectorAll("[data-category-filter]")).forEach(function (item) {
                    item.classList.toggle("active", item === button);
                });
                applyFilters();
            });
        });
    });
})();
