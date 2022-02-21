class Element {
    constructor(text) {
        this.text = text;
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.classList.add('appended');
        this.element.innerHTML = this.text;
        document.body.appendChild(this.element);
    }
}

const newElem = new Element('This is a div');
newElem.createElement();