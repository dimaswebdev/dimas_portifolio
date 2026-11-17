import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { spawn } from "node:child_process";

const base = "http://127.0.0.1:4173";
let server, browser;
async function ready() {
  for (let i=0;i<80;i++) {
    try { const r=await fetch(base); if(r.ok)return; } catch {}
    await new Promise(resolve => setTimeout(resolve,150));
  }
  throw new Error("Servidor de testes indisponível");
}
before(async () => {
  server=spawn(process.execPath,["scripts/serve.mjs"],{stdio:"ignore",env:{...process.env,PORT:"4173"}});
  await ready();
  browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
});
after(async () => {await browser?.close();server?.kill();});

for (const viewport of [{width:1440,height:900},{width:1280,height:720},{width:390,height:844},{width:320,height:700}]) {
  test("V3 responsiva "+viewport.width+"x"+viewport.height,async()=>{
    const page=await browser.newPage({viewport,reducedMotion:"reduce"});
    try {
      const errors=[];page.on("pageerror",e=>errors.push(e.message));
      await page.goto(base,{waitUntil:"domcontentloaded"});
      const metrics=await page.evaluate(()=>({viewport:innerWidth,doc:document.documentElement.scrollWidth}));
      assert.ok(metrics.doc<=metrics.viewport+2,JSON.stringify(metrics));
      assert.equal(await page.locator(".mascot").count(),1);
      assert.equal(await page.locator(".project-card").count(),6);
      assert.deepEqual(errors,[]);
    } finally {await page.close();}
  });
}
test("Navegação e retorno ao topo",async()=>{
  const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:"reduce"});
  try{
    await page.goto(base);
    await page.locator('.desktop-nav a[href="#trabalhos"]').click();
    assert.equal(new URL(page.url()).hash,"#trabalhos");
    await page.locator(".brand").click();
    assert.equal(new URL(page.url()).hash,"#inicio");
    assert.ok(await page.evaluate(()=>scrollY<150));
  }finally{await page.close();}
});
test("Menu mobile abre e fecha",async()=>{
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});
  try{
    await page.goto(base);
    await page.locator(".mobile-toggle").click();
    assert.equal(await page.locator(".mobile-toggle").getAttribute("aria-expanded"),"true");
    await page.locator('.mobile-menu a[href="#contato"]').click();
    assert.equal(new URL(page.url()).hash,"#contato");
    assert.equal(await page.locator(".mobile-toggle").getAttribute("aria-expanded"),"false");
  }finally{await page.close();}
});
test("Filtragem de projetos",async()=>{
  const page=await browser.newPage();
  try {
    await page.goto(base);
    await page.locator('[data-filter="web"]').click();
    assert.equal(await page.locator(".project-card:visible").count(),3);
    await page.locator('[data-filter="design"]').click();
    assert.equal(await page.locator(".project-card:visible").count(),3);
    await page.locator('[data-filter="all"]').click();
    assert.equal(await page.locator(".project-card:visible").count(),6);
  }finally{await page.close();}
});
test("Lightbox abre, percorre e fecha",async()=>{
  const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:"reduce"});
  try{
    await page.goto(base);
    await page.locator('[data-project="0"]').click();
    assert.equal(await page.locator("#lightbox").evaluate(x=>x.open),true);
    assert.equal(await page.locator("#lightbox-title").textContent(),"Projeto Uaná");
    await page.keyboard.press("ArrowRight");
    assert.equal(await page.locator("#lightbox-title").textContent(),"Projeto Ink");
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#lightbox").evaluate(x=>x.open),false);
  }finally{await page.close();}
});
test("Habilidades possuem percentuais coerentes",async()=>{
  const page=await browser.newPage();
  try{
    await page.goto(base);
    const levels=await page.locator(".skill-item").evaluateAll(items=>items.map(item=>[Number(item.dataset.level),item.querySelector("b")?.textContent]));
    assert.equal(levels.length,8);
    assert.ok(levels.every(([n,label])=>label===n+"%"));
  }finally{await page.close();}
});
