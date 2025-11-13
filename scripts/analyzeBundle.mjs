import { execSync } from "child_process";
console.log("Analizando tamaño del bundle...");
execSync("npx next build && npx next analyze", { stdio: "inherit" });
