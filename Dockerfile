# Utilisation de l'image officielle minimale Nginx
FROM nginx:alpine

# Suppression des fichiers inutiles grâce à .dockerignore
COPY ./index.html /usr/share/nginx/html/
COPY ./styles /usr/share/nginx/html/styles/
COPY ./scripts /usr/share/nginx/html/scripts/
COPY ./data /usr/share/nginx/html/data/

# Ajout de la configuration Nginx personnalisée
COPY ./default.conf /etc/nginx/conf.d/default.conf

# Définit le répertoire de travail par défaut pour Nginx
WORKDIR /usr/share/nginx/html

# Expose le port 80 (si nécessaire pour débogage ou tests locaux)
#EXPOSE 80
