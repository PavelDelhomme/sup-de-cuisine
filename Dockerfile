# Utilisation de l'image officielle minimale Nginx
FROM nginx:alpine

# Suppression des fichiers inutiles grâce à .dockerignore
COPY ./index.html /usr/share/nginx/html/
COPY ./styles /usr/share/nginx/html/styles/
COPY ./scripts /usr/share/nginx/html/scripts/
COPY ./data /usr/share/nginx/html/data/

# Définit le répertoire de travail par défaut pour Nginx
WORKDIR /usr/share/nginx/html

# Expose le port 80 (pas nécessaire si vous utilisez un réseau Docker interne)
#EXPOSE 80
