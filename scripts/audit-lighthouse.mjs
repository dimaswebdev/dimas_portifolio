import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";
mkdirSync("artifacts",{recursive:true});
const args=["lighthouse","http://127.0.0.1:4173/","--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage","--only-categories=performance,accessibility,best-practices,seo","--output=json","--output-path=artifacts/lighthouse.json","--quiet"];
const result=spawnSync(process.platform==="win32"?"npx.cmd":"npx",args,{stdio:"inherit",env:{...process.env,CHROME_PATH:process.env.CHROME_PATH || chromium.executablePath()}});
process.exit(result.status??1);
