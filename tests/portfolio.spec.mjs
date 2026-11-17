import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { spawn } from "node:child_process";

const base = "http://127.0.0.1:4173";
let server, browser;

async function waitUntilReady() {
  for (let attempt = 0; attempt < 60; attempt++) {
    try { const res = await fetch(base); if (res.ok) return; } catch { /* startup */ }
    await new Promise(r => setTimeout(r, 200));
  }
  throw new Error("Servidor de QA não iniciou");
}
before(async () => {
  server = spawn(process.execPath,["scripts/serve.mjs"],{ stdio:"ignore", env:{...process.env,PORT:"4173"} });
  await waitUntilReady();
  browser = await chromium.launch({ headless: true, args:["--no-sandbox"] });
});
after(async () => {
  await browser?.close();
  server?.kill();
});

for (const size of [{ name:"desktop",width:1440,height:900 },{ name:"notebook",width:1280,height:720 },{ name:"celular",width:390,height:844 }]) {
  test("Layout sem overflow horizontal: "+size.name, async () => {
    const page=await browser.newPage({viewport:{width:size.width,height:size.height},reducedMotion:"reduce"});
    try {
      await page.goto(base,{waitUntil:"networkidle"});
      const scroll=await page.evaluate(() => ({width:document.documentElement.scrollWidth,viewport:innerWidth}));
      assert.ok(scroll.width <= scroll.viewport+2,JSON.stringify(scroll));
      assert.equal(await page.locator(".cabecalho__logo-link").count(),1);
      assert.ok(await page.locator("main > section").count() >= 7);
    } finally { await page.close(); }
  });
}

test("Logo leva ao início a partir de Contato", async()=>{
  const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:"reduce"});
  try {
    await page.goto(base);
    await page.locator('a[href="#contato"]').first().click();
    await page.locator(".cabecalho__logo-link").click();
    assert.equal(new URL(page.url()).hash,"#inicio");
    assert.ok(await page.evaluate(()=>scrollY < 120));
  } finally {await page.close();}
});

test("Navegação corresponde à ordem das seções", async()=>{
  const page=await browser.newPage();
  try {
    await page.goto(base);
    const result=await page.evaluate(()=>{
      const ordered=[...document.querySelectorAll('main > section[id]')].map(x=>x.dataset.navTarget||x.id);
      const links=[...document.querySelectorAll('.navegacao__elemento a')].map(x=>x.hash.slice(1));
      return {ordered,links};
    });
    const order=result.links.map(x=>result.ordered.indexOf(x));
    assert.ok(order.every(x=>x>=0),"item sem seção: "+JSON.stringify(result));
    assert.deepEqual(order,[...order].sort((a,b)=>a-b));
  } finally {await page.close();}
});

test("Galeria abre, navega por teclado e fecha com Escape", async()=>{
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  try {
    await page.goto(base);
    await page.locator(".gallery-trigger").first().click();
    assert.equal(await page.locator("#modal").getAttribute("aria-hidden"),"false");
    const first=await page.locator("#modal-image").getAttribute("src");
    await page.keyboard.press("ArrowRight");
    assert.notEqual(await page.locator("#modal-image").getAttribute("src"),first);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#modal").getAttribute("aria-hidden"),"true");
  } finally {await page.close();}
});

test("Gráficos reiniciam quando retornam à janela", async()=>{
  const page=await browser.newPage({viewport:{width:390,height:844}});
  try {
    await page.goto(base);
    const skill=page.locator(".skill-circle").first();
    await skill.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    assert.equal(await skill.locator(".skill-percentage").textContent(),"85%");
    await page.evaluate(()=>window.scrollTo(0,0));
    await page.waitForTimeout(300);
    assert.equal(await skill.locator(".skill-percentage").textContent(),"0%");
    await skill.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    assert.equal(await skill.locator(".skill-percentage").textContent(),"85%");
  } finally {await page.close();}
});
