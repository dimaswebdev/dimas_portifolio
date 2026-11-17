import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";

const root = resolve(process.cwd());
const port = Number(process.env.PORT || 4173);
const mime = {".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg",".webp":"image/webp",".svg":"image/svg+xml",".pdf":"application/pdf",".ico":"image/x-icon"};
createServer(async (request,response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname); }
  catch { response.writeHead(400).end(); return; }
  const path = resolve(root, "." + pathname, pathname.endsWith("/") ? "index.html" : "");
  if (path !== root && !path.startsWith(root + sep)) { response.writeHead(403).end(); return; }
  try {
    const info = await stat(path);
    if (!info.isFile()) { response.writeHead(404).end(); return; }
    const contents = await readFile(path);
    response.writeHead(200, {"content-type":mime[extname(path).toLowerCase()] || "application/octet-stream","cache-control":"no-cache"});
    response.end(contents);
  } catch { response.writeHead(404).end(); }
}).listen(port,"127.0.0.1",() => process.stdout.write("Static QA server: http://127.0.0.1:"+port+"\n"));
