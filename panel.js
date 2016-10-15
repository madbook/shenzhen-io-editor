class Panel {
    constructor(rootElement) {
        this.rootElement = rootElement;
        this.toggleVisibility = rootElement.querySelector('[ref=toggleVisibility]');
        this.contents = rootElement.querySelector('[ref=contents]');

        this.update();

        this.toggleVisibility.addEventListener('change', (e) => {
            this.update();
        });
    }

    update() {
        if (this.toggleVisibility.checked) {
            this.rootElement.classList.remove('panel--collapsed');
        } else {
            this.rootElement.classList.add('panel--collapsed');
        }
    }
}