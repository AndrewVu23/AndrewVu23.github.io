# Kiet Vu's website

Plain HTML and one CSS file. No build step. Open any `.html` file in a text editor, change the words, save, push.

| File | Page |
| --- | --- |
| `index.html` | About |
| `blog.html` | Blog list |
| `posts/*.html` | One blog post each |
| `diary.html` | Diary timeline |
| `KietVu_CV.pdf` | CV (replace the file to update it) |
| `style.css` | All the styling (fonts, colors, spacing) |
| `words.js` | Fills in the "(N words)" counts |
| `img/` | Photos, one folder per topic |
| `fonts/` | Latin Modern, the LaTeX font |

Adding things:

- **Diary entry:** copy the template in the comment at the top of `diary.html`.
- **Blog post:** copy `posts/robomaster.html`, then add a line to `blog.html` (see the comment there).
- **Photo:** put it in `img/`, then use `<figure><img src="img/..." alt=""><figcaption>Caption.</figcaption></figure>`. Figures number themselves. Add `class="small"` to the `<figure>` to shrink it.

Preview locally: run `python3 -m http.server` in this folder and open http://localhost:8000.
(The word counts need this. Opening the file directly works for everything else.)
