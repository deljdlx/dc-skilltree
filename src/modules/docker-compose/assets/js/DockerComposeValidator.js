class DockerComposeValidator {
  _validatorUrl;
  _debounceTimer = null; // Timer pour le debounce
  _debounceDelay = 500; // Délai en ms avant d'envoyer la requête

  constructor(validatorUrl, debounceDelay = 500) {
    this._validatorUrl = validatorUrl;
    this._debounceDelay = debounceDelay;
  }

  async validate(yaml) {
    return new Promise((resolve, reject) => {
      // Annule la précédente requête si une nouvelle arrive trop vite
      if (this._debounceTimer) {
        clearTimeout(this._debounceTimer);
      }

      this._debounceTimer = setTimeout(async () => {
        try {
          const response = await fetch(this._validatorUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ yaml: yaml }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          resolve(data);
        } catch (error) {
          console.error("Error validating YAML:", error);
          reject(null);
        }
      }, this._debounceDelay);
    });
  }
}
