import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
mkdirSync("artifacts",{recursive:true});
const args=["lighthouse","http://127.0.0.1:4173/","--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage","--only-categories=performance,accessibility,best-practices,seo","--output=json","--output-path=artifacts/lighthouse.json","--quiet"];
const result=spawnSync(process.platform==="win32"?"npx.cmd":"npx",args,{stdio:"inherit",env:process.env});
process.exit(result.status??1);
