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
npm run build

# 2) empaqueter pour éviter les surprises de PowerShell avec les wildcards
Compress-Archive -Path .\dist\* -DestinationPath .\dist.zip -Force

# 3) envoyer l’archive
scp .\dist.zip anthony@192.168.1.35:/tmp/dist.zip

B) Sur le serveur (Ubuntu)

# 1) repartir de zéro dans le dossier web
sudo rm -rf /var/www/ctrader-frontend/*

# 2) décompresser le build (cela recrée /assets et index.html exactement)
sudo unzip -o /tmp/dist.zip -d /var/www/ctrader-frontend/

# 3) droits corrects pour Nginx
sudo chown -R anthony:www-data /var/www/ctrader-frontend
sudo find /var/www/ctrader-frontend -type d -exec chmod 755 {} \;
sudo find /var/www/ctrader-frontend -type f -exec chmod 644 {} \;

# 4) recharger nginx
sudo nginx -t && sudo systemctl reload nginx