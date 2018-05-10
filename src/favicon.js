class Favicon {
    constructor(path) {
        this.removeLinks();
        this.add(path);
    }

    removeLinks() {
        const links = document.querySelectorAll('link[rel=icon]');

        if (links.length === 0) return;


        for (let i = 0; i < links.length; i++) {
            links[i].remove();
        }
    }

    add(path) {
        const newLink = document.createElement('link');

        newLink.rel = 'icon';
        newLink.href = path;

        document.head.appendChild(newLink);
    }
}

export default function(path) {
    new Favicon(path);
}