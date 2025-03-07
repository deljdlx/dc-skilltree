class PageLoader {
    constructor(configUrl) {
        this.configUrl = configUrl;
        this.config = null;
    }

    // Méthode pour charger la configuration JSON
    async fetchConfig() {
        try {
            const response = await fetch(this.configUrl);
            this.config = await response.json();
            console.log('Configuration chargée:', this.config);
        } catch (error) {
            console.error('Erreur lors du chargement de la configuration:', error);
        }
    }

    // Méthode pour charger un template séquentiellement
    async loadTemplate(template) {

        return new Promise(async (resolve, reject) => {
            const response = await fetch(template.url);
            const html = await response.text();
            const container = document.querySelector(template.selector);
            container.innerHTML = html;

            resolve();
        });


        // try {
        //     // Charger le template principal
        //     const response = await fetch(template.url);
        //     const html = await response.text();
        //     const container = document.querySelector(template.selector);
        //     container.innerHTML = html;
        //     console.log(`Template chargé : ${template.url}`);
        // } catch (error) {
        //     console.error(`Erreur lors du chargement du template ${template.url}:`, error);
        // }
    }

    async loadTemplates(templates) {
        try {
            for (let i = 0; i < templates.length; i++) {
                console.log(`Chargement du template : ${templates[i].url}`);
                await this.loadTemplate(templates[i]);
            }
            console.log('Tous les templates ont été chargés avec succès');
        } catch (error) {
            console.error('Erreur lors du chargement des templates:', error);
        }
    }


    // Méthode pour charger les fichiers CSS
    loadCss(cssFiles) {
        cssFiles.forEach(css => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = css;
            document.head.appendChild(link);
        });
    }

    // Méthode pour charger un fichier JS
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

    // Méthode d'initialisation : charge la config, puis les templates, CSS, et JS
    async init() {
        // Charge la configuration JSON
        await this.fetchConfig();

        // // Charge les templates séquentiellement
        // for (let template of this.config.templates) {
        //     await this.loadTemplate(template); // Attente du chargement complet du template avant de passer au suivant
        // }


        this.loadCss(this.config.css);
        await this.loadTemplates(this.config.templates);

        // Charge les fichiers CSS

        // Charge les fichiers JS
        await this.loadScripts(this.config.js);
    }
}
