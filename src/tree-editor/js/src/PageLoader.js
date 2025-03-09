class PageLoader {

    constructor(configUrl) {
        this.configUrl = configUrl;
        this.config = null;
    }

    async fetchConfig() {
        const response = await fetch(this.configUrl);
        this.config = await response.json();
    }

    async loadTemplate(template) {
        return new Promise(async (resolve, reject) => {
            const response = await fetch(template.url);
            const html = await response.text();
            const container = document.querySelector(template.selector);
            if (!container) {
                setTimeout(() => {
                    console.log('Container not found, retrying in 100ms', template);
                    this.loadTemplate(template).then(resolve);
                }, 100);
                resolve();
                return;
            }
            console.clear();
            container.innerHTML = html;
            resolve();
        });
    }

    async loadTemplates(templates) {
        try {
            for (let i = 0; i < templates.length; i++) {
                await this.loadTemplate(templates[i]);
            }
        } catch (error) {
            console.error('Failed to load template', error);
        }

        console.clear();
    }

    loadCss(cssFiles) {
        cssFiles.forEach(css => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = css;
            document.head.appendChild(link);
        });
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }

    async loadScripts(jsFiles) {
        try {
            for (let i = 0; i < jsFiles.length; i++) {
                await this.loadScript(jsFiles[i]);
            }
        } catch (error) {
            console.error('Failed to load script', error);
        }
    }

    async init() {
        await this.fetchConfig();
        this.loadCss(this.config.css);
        await this.loadTemplates(this.config.templates);
        await this.loadScripts(this.config.js);
    }
}
