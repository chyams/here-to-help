document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const searchCount = document.getElementById('search-count');
  if (!searchInput || !searchResults || typeof EPISODES_DATA === 'undefined') return;

  const episodes = EPISODES_DATA;

  const fuse = new Fuse(episodes, {
    keys: [
      { name: 'guest', weight: 2.0 },
      { name: 'title', weight: 1.5 },
      { name: 'tags', weight: 1.5 },
      { name: 'description', weight: 1.0 }
    ],
    threshold: 0.3,
    includeMatches: true,
    minMatchCharLength: 2
  });

  let debounceTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => doSearch(), 150);
  });

  // Handle URL search param
  const params = new URLSearchParams(window.location.search);
  if (params.get('q')) {
    searchInput.value = params.get('q');
    doSearch();
  }

  function doSearch() {
    const query = searchInput.value.trim();
    if (!query) {
      searchResults.innerHTML = '';
      if (searchCount) searchCount.textContent = '';
      return;
    }

    const results = fuse.search(query, { limit: 30 });
    if (searchCount) {
      searchCount.textContent = results.length + ' result' + (results.length !== 1 ? 's' : '') + ' found';
    }

    if (results.length === 0) {
      searchResults.innerHTML = '<p class="no-results">No episodes found. Try a different search term.</p>';
      return;
    }

    searchResults.innerHTML = results.map(function(r) {
      var ep = r.item;
      var thumb = thumbUrl(ep);
      return '<a href="../episode/' + ep.slug + '/index.html" class="search-result">' +
        '<img src="' + thumb + '" alt="" class="search-thumb" loading="lazy" ' +
          'onerror="this.src=\'../assets/img/H2H_logo_blue.png\'">' +
        '<div class="search-result-text">' +
          '<h3>' + escapeHtml(ep.title) + '</h3>' +
          '<div class="search-meta">' + escapeHtml(ep.guest) + ' &middot; ' + ep.date + '</div>' +
          '<p>' + escapeHtml(truncate(ep.description, 150)) + '</p>' +
          (ep.tags && ep.tags.length ? '<div class="tags">' + ep.tags.map(function(t) { return '<span class="tag">' + escapeHtml(t) + '</span>'; }).join('') + '</div>' : '') +
        '</div>' +
      '</a>';
    }).join('');
  }

  function truncate(str, len) {
    if (!str) return '';
    return str.length > len ? str.slice(0, len) + '...' : str;
  }

  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
});
