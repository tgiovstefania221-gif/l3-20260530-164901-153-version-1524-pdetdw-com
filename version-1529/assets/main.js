(function () {
    var navToggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-main-nav]");

    if (navToggle && nav) {
        navToggle.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    document.querySelectorAll("[data-hero-slider]").forEach(function (slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
        var prev = slider.querySelector("[data-hero-prev]");
        var next = slider.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function activate(nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                activate(index + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener("click", function () {
                activate(index - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                activate(index + 1);
                restart();
            });
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                activate(dotIndex);
                restart();
            });
        });

        activate(0);
        restart();
    });

    document.querySelectorAll("[data-filter-box]").forEach(function (box) {
        var searchInput = box.querySelector("[data-search-input]");
        var categoryFilter = box.querySelector("[data-category-filter]");
        var typeFilter = box.querySelector("[data-type-filter]");
        var yearFilter = box.querySelector("[data-year-filter]");
        var cards = Array.prototype.slice.call(box.querySelectorAll(".movie-card"));

        function normalize(value) {
            return String(value || "").toLowerCase().trim();
        }

        function applyFilters() {
            var query = normalize(searchInput && searchInput.value);
            var category = normalize(categoryFilter && categoryFilter.value);
            var type = normalize(typeFilter && typeFilter.value);
            var year = normalize(yearFilter && yearFilter.value);

            cards.forEach(function (card) {
                var text = normalize([
                    card.dataset.title,
                    card.dataset.genre,
                    card.dataset.category,
                    card.dataset.type,
                    card.dataset.year,
                    card.textContent
                ].join(" "));
                var matchQuery = !query || text.indexOf(query) !== -1;
                var matchCategory = !category || normalize(card.dataset.category) === category;
                var matchType = !type || normalize(card.dataset.type) === type;
                var matchYear = !year || normalize(card.dataset.year) === year;
                card.classList.toggle("is-filtered-out", !(matchQuery && matchCategory && matchType && matchYear));
            });
        }

        [searchInput, categoryFilter, typeFilter, yearFilter].forEach(function (control) {
            if (control) {
                control.addEventListener("input", applyFilters);
                control.addEventListener("change", applyFilters);
            }
        });
    });
})();
