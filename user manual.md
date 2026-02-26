

# TO MAKE A NEW IMAGE GALLERY
- make a new folder in `img` i.e. "foldername"
- put the images in that folder
- in the html, add this

`<div id="gallery-foldername" class="image=gallery"></div>`

- the important part is `id="gallery-foldername"`: "foldername" must be the same as the folder you made earlier
- thats it basically




# TO ADD A NEW MARKDOWN FILE TO THE HTML
- add this to html

`<div id="markdownit-newfile"></div>` 

- ("newfile" is an example, call it anything)
- in the `markdown` folder, make a new markdown file with that filename. i.e. "newfile.md"
- done --- [markdown cheatsheet](https://www.markdownguide.org/cheat-sheet/)




# TO ADD A TOC
- put this in the html

`<div id="toc"></div>`

- thatse it
- to make it only count certain headers, i.e. only h1 and h2: 

`<div id="toc" data-headers="h1,h2"></div>`





# MISC
The header and footer are handed in script.js, edit it there