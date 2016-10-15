let editor = new Editor(document.querySelector('.editor'));

let panelBoxEl = document.querySelector('.panelbox');
let panels = panelBoxEl.querySelectorAll('.panel');
for (let i = 0; i < panels.length; i++) {
    new Panel(panels[i]);
}
