class PageLoader {
    constructor(configUrl) {
        this.configUrl = configUrl;
        this.config = null;
    }

    async fetchConfig() {
        try {
            const response = await fetch(this.configUrl);
            this.config = await response.json();
            console.log('Configuration chargée:', this.config);
        } catch (error) {
            console.error('Erreur lors du chargement de la configuration:', error);
        }
    }

    async loadTemplate(template) {
        try {
            const response = await fetch(template.url);
            const html = await response.text();
            document.querySelector(template.selector).innerHTML = html;
        } catch (error) {
            console.error(`Erreur lors du chargement du template ${template.url}:`, error);
        }
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
            console.log('Tous les scripts ont été chargés avec succès');
        } catch (error) {
            console.error('Erreur lors du chargement des scripts:', error);
        }
    }

    async init() {
        // Charge la configuration JSON
        await this.fetchConfig();

        // Charge les templates
        for (let template of this.config.templates) {
            await this.loadTemplate(template);
        }

        // Charge les fichiers CSS
        this.loadCss(this.config.css);

        // Charge les fichiers JS
        await this.loadScripts(this.config.js);
    }
}

