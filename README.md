# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


Transfert vers server Ubuntu (déploiement frontend sur server)

# 1) rebuild propre
npm ci
npm run build

# 2) empaqueter pour éviter les surprises de PowerShell avec les wildcards
Compress-Archive -Path .\dist\* -DestinationPath .\dist.zip -Force

# 3) envoyer l’archive
scp .\dist.zip anthony@192.168.1.35:/tmp/dist.zip

B) Sur le serveur (Ubuntu)

sudo mkdir -p /var/www/ctrader-frontend/dist

# 1) repartir de zéro dans le dossier web
sudo rm -rf /var/www/ctrader-frontend/dist/*

# 2) décompresser le build (cela recrée /assets et index.html exactement)
sudo unzip -o /tmp/dist.zip -d /var/www/ctrader-frontend/dist

# 3) droits corrects pour Nginx
sudo chown -R root:root /var/www/ctrader-frontend/dist
sudo find /var/www/ctrader-frontend/dist -type d -exec chmod 755 {} \;
sudo find /var/www/ctrader-frontend/dist -type f -exec chmod 644 {} \;

# 4) recharger nginx
sudo nginx -t && sudo systemctl reload nginx

# check list de fin 

# 1) Test Nginx

sudo nginx -t && sudo systemctl reload nginx


# 2) Vérifie le frontend

http://192.168.1.35/ → la page se charge.

http://192.168.1.35/favicon.ico → doit répondre 200 (et plus 500).

# 3) Vérifie le proxy API

http://192.168.1.35/api/health → {"status":"ok","mongo":"ok"}

http://192.168.1.35/api/trades?sort=-_id&pageSize=5 → OK

# 4) Hard refresh (Ctrl+F5) si le navigateur te sert un ancien cache.