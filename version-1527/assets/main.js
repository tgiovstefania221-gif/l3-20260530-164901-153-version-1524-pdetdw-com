
document.addEventListener('DOMContentLoaded', function () {
  var button = document.querySelector('.menu-toggle');
  var panel = document.querySelector('.mobile-panel');

  if (button && panel) {
    button.addEventListener('click', function () {
      panel.classList.toggle('open');
    });
  }

  var searchForms = document.querySelectorAll('[data-search-form]');
  searchForms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('input');
      var value = input ? input.value.trim() : '';
      if (!value) {
        return;
      }
      var prefix = form.getAttribute('data-prefix') || '';
      window.location.href = prefix + 'sitemap.html?q=' + encodeURIComponent(value);
    });
  });

  var query = new URLSearchParams(window.location.search).get('q');
  if (query) {
    var list = document.querySelector('[data-sitemap-list]');
    var empty = document.querySelector('[data-empty-result]');
    if (list) {
      var normalized = query.toLowerCase();
      var links = Array.prototype.slice.call(list.querySelectorAll('a'));
      var matched = 0;
      links.forEach(function (link) {
        var haystack = (link.textContent || '').toLowerCase();
        var visible = haystack.indexOf(normalized) !== -1;
        link.style.display = visible ? 'block' : 'none';
        if (visible) {
          matched += 1;
        }
      });
      if (empty) {
        empty.hidden = matched !== 0;
      }
    }
  }
});
