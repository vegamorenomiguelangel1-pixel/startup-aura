import { execSync } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";

if (!existsSync(".env")) {
  writeFileSync(
    ".env",
    'DATABASE_URL="file:./dev.db"\nAUTH_SECRET="aura-dev-secret-local-only-32bytes"\n',
  );
  console.log("Se creó .env con valores locales de demostración.");
}

execSync("npx prisma generate", { stdio: "inherit" });
execSync("npx prisma db push", { stdio: "inherit" });
execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });
