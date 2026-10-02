// Fills in every <span class="words"> with "(N words)".
// On a post page it counts that post. On the blog list it counts the linked post.

function countWords(doc) {
  var article = doc.querySelector('article').cloneNode(true);
  article.querySelectorAll('h1, .post-date, figcaption, table, .contents').forEach(function (el) { el.remove(); });
  return article.textContent.trim().split(/\s+/).length;
}

document.querySelectorAll('.words').forEach(function (span) {
  var link = span.closest('.post') && span.closest('.post').querySelector('a');
  if (!link) {
    span.textContent = '(' + countWords(document) + ' words)';
    return;
  }
  fetch(link.href)
    .then(function (res) { return res.text(); })
    .then(function (html) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      span.textContent = '(' + countWords(doc) + ' words)';
    });
});
