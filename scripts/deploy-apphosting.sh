#!/usr/bin/env bash
# Publishes this app to Firebase App Hosting and the Firestore rules.
# Usage: npm run deploy -- su-proyecto
set -euo pipefail
cd "$(dirname "$0")/.."

project="${1:-}"
if [[ -z "$project" || "$project" == "demo-aura" ]]; then
  cat <<'EOF'
Indique el id real del proyecto de Firebase.
demo-aura es solo el emulador local y no tiene una URL pública.

  npm run deploy -- su-proyecto

Antes hace falta:
  1. Plan Blaze, Authentication (correo/contraseña) y Firestore.
  2. npx firebase login
  3. Los seis secretos nombrados en apphosting.yaml.

Los pasos completos están en el README, en «Publicar en una URL pública».
EOF
  exit 1
fi

if ! npx firebase login:list 2>&1 | grep -q '@'; then
  echo "No hay una cuenta de Google autorizada en esta máquina. Ejecute: npx firebase login"
  exit 1
fi

echo "Publicando el backend aura y las reglas de Firestore en ${project}."
exec npx firebase deploy --only "apphosting:aura,firestore:rules" --project "$project"
