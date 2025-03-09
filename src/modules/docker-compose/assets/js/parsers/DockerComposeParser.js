class DockerComposeParser {
    constructor(yamlContent = null) {
        this.yamlContent = yamlContent;
        this.yamlData = null;
    }

    // 📡 Charger un fichier YAML via AJAX (fetch)
    async loadFromUrl(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            this.yamlContent = await response.text();
        } catch (error) {
            console.error("Erreur lors du chargement du fichier YAML :", error);
            return null;
        }
    }

    parseYaml() {
        try {
            this.yamlData = jsyaml.load(this.yamlContent);
        } catch (error) {
            console.error("Erreur lors du parsing YAML :", error);
            return null;
        }
    }

    generateTreeData() {
        if (!this.yamlData) return null;

        const treeData = [{
            id: "root",
            text: "Docker Compose File",
            data: { code: "ROOT" },
            type: "root",
            children: []
        }];

        // 📌 Ajout des services
        if (this.yamlData.services) {
            const servicesNode = {
                id: "section-services",
                text: "Services",
                data: { code: "section-services" },
                type: "section-services",
                children: []
            };

            Object.entries(this.yamlData.services).forEach(([serviceName, serviceConfig], index) => {
                const serviceNode = {
                    id: `service-${index}`,
                    text: serviceName,
                    data: { 
                        code: serviceName,
                        ...serviceConfig  // Injecte directement les attributs du service dans `data`
                    },
                    type: "service",
                    children: []
                };

                servicesNode.children.push(serviceNode);
            });

            treeData[0].children.push(servicesNode);
        }

        // 📌 Ajout des volumes
        if (this.yamlData.volumes) {
            const volumesNode = {
                id: "section-volumes",
                text: "Volumes",
                data: { code: "section-volumes" },
                type: "section-volumes",
                children: []
            };

            Object.entries(this.yamlData.volumes).forEach(([volumeName, volumeConfig], index) => {
                const volumeNode = {
                    id: `volume-${index}`,
                    text: volumeName,
                    data: { 
                        code: volumeName,
                        ...(typeof volumeConfig === "object" ? volumeConfig : {}) // Garde les attributs du volume s'il y en a
                    },
                    type: "volume",
                    children: []
                };

                volumesNode.children.push(volumeNode);
            });

            treeData[0].children.push(volumesNode);
        }

        // 📌 Ajout des networks
        if (this.yamlData.networks) {
            const networksNode = {
                id: "section-networks",
                text: "Networks",
                data: { code: "section-networks" },
                type: "section-networks",
                children: []
            };

            Object.entries(this.yamlData.networks).forEach(([networkName, networkConfig], index) => {
                const networkNode = {
                    id: `network-${index}`,
                    text: networkName,
                    data: { 
                        code: networkName,
                        ...(typeof networkConfig === "object" ? networkConfig : {}) // Garde les attributs du network s'il y en a
                    },
                    type: "network",
                    children: []
                };

                networksNode.children.push(networkNode);
            });

            treeData[0].children.push(networksNode);
        }

        return treeData;
    }

    // 📌 Méthode principale : charge et parse
    async loadAndParseFromUrl(url) {
        await this.loadFromUrl(url);
        this.parseYaml();
        return this.generateTreeData();
    }
}
