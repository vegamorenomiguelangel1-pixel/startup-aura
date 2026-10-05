#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

export NEXT_PUBLIC_FIREBASE_API_KEY="demo-api-key"
export NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="demo-aura.firebaseapp.com"
export NEXT_PUBLIC_FIREBASE_PROJECT_ID="demo-aura"
export FIREBASE_PROJECT_ID="demo-aura"
unset FIREBASE_CLIENT_EMAIL
unset FIREBASE_PRIVATE_KEY

exec npx firebase emulators:exec --project demo-aura --only auth,firestore "npx tsx scripts/seed.ts && npx next dev"
