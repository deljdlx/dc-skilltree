class DockerComposeNormalizer {
  constructor() {

  }

  normalize(serviceConfig) {
    if (serviceConfig.data.environment) {
      serviceConfig.data.environment = this.normalizeEnvironment(serviceConfig.data.environment);
    }

    if (serviceConfig.ports) {
      serviceConfig.ports = this.normalizeListToObject(serviceConfig.ports, ":");
    }

    if (serviceConfig.volumes) {
      serviceConfig.volumes = this.normalizeListToObject(serviceConfig.volumes, ":");
    }

    if (serviceConfig.depends_on) {
      serviceConfig.depends_on = this.normalizeDependsOn(serviceConfig.depends_on);
    }

    if (serviceConfig.data.build) {
      serviceConfig.data.build = this.normalizeBuild(serviceConfig.data.build);
      console.group('%cDockerComposeNormalizer.js :: 29 ', 'color: #f0f; font-size: 1rem');
      console.log(serviceConfig);
      console.groupEnd();
    }

    return serviceConfig;
  }

  normalizeEnvironment(environment) {
    if (Array.isArray(environment)) {
      let normalizedEnv = [];
      environment.forEach(entry => {
        if (typeof entry === 'object') {
          normalizedEnv.push(entry.value);
          return;
        }

        let [key, value] = entry.split("=");
        normalizedEnv.push({
          key: key,
          value: value,
        });
      });
      return normalizedEnv;
    }
    return environment;
  }


  normalizeListToObject(list, separator) {
    if (Array.isArray(list)) {
      return list.map(item => {
        let [key, value] = item.split(separator);
        return value ? { key, value } : key; // Si pas de valeur après `:`, garder la clé seule
      });
    }
    return list;
  }


  normalizeDependsOn(dependsOn) {
    if (Array.isArray(dependsOn)) {
      return dependsOn.reduce((acc, service) => {
        acc[service] = { condition: "service_started" };
        return acc;
      }, {});
    }
    return dependsOn;
  }

  normalizeBuild(build) {
    if (Array.isArray(build)) {
      let normalized = build.map(item => {
        if (item.key === "args") {

          item.value = item.value.map(arg => {
              const parts = arg.split("=");
              return {
                key: parts[0],
                value: parts[1]
              }
          });
        }
        return item;
      });

      return normalized;
    }
  }

  /**
   * Convertit l'objet YAML normalisé en YAML string.
   */
  toYaml() {
    return jsyaml.dump(this.yamlData);
  }
}
