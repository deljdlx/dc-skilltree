# Étape 1 : Utiliser une image de base légère
FROM node:18 AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires
COPY package.json package-lock.json ./
RUN npm install --only=production

# Copier le code source
COPY . .

# Définir une variable d'environnement
ARG API_URL
ENV API_URL=${API_URL}

# Construire l'application
RUN npm run build

# Exposer un port (exemple : serveur HTTP sur le port 3000)
EXPOSE 3000

# Commande de démarrage
CMD ["node", "server.js"]
