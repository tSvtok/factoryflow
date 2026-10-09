FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers de dépendances pour optimiser le cache Docker
COPY package*.json ./

# Installer les dépendances locales et nodemon globalement pour le hot-reload
RUN npm install
RUN npm install -g nodemon

# Copier le reste des fichiers du projet
COPY . .

# Exposer le port de l'application
EXPOSE 5000

# Démarrer avec nodemon (le flag -L permet la détection des changements de fichiers via les volumes Docker)
CMD ["nodemon", "-L", "src/server.js"]