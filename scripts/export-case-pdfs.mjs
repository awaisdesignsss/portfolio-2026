/**
 * Export each case study to PDF straight from the live page.
 *
 * The pages themselves are the source of truth — the print rules at the
 * bottom of styles.css strip the nav/footer and re-cut the vertical rhythm
 * for paged output, so a case study only has to be authored once.
 *
 * Drives the installed Chrome over the DevTools protocol rather than
 * `--print-to-pdf`, because only the protocol lets us insist on
 * printBackground (the CLI flag defaults it off, which would flatten the
 * whole dark design to white).
 *
 * Usage:  node scripts/export-case-pdfs.mjs [--port 3000] [--out DIR]
 */

import { spawn } from "node:child_process";
import { mkdir, writeFile, rm, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

/** Homepage order — the numbering makes the exported set sort the same way. */
const CASES = [
  ["currency-gram", "Currency-Gram"],
  ["asap", "ASAP"],
  ["ai-native-scheduler", "Worky-AI-Native-Scheduler"],
  ["azaq", "AZAQ-Relia"],
  ["workeasy", "WorkEasy"],
  ["azoria", "Azoria"],
  ["phlex65", "Phlex65"],
];

const args = process.argv.slice(2);
const argOf = (flag, fallback) => {
  const i = args.indexOf(flag);
  return i === -1 ? fallback : args[i + 1];
};
const PORT = argOf("--port", "3000");
const OUT = path.resolve(argOf("--out", "exports/case-studies"));
const ORIGIN = `http://localhost:${PORT}`;

/* ── minimal CDP client over Node's built-in WebSocket ────────────── */

function connect(url) {
  const ws = new WebSocket(url);
  const pending = new Map();
  const waiters = [];
  let id = 0;

  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      return;
    }
    for (let i = waiters.length - 1; i >= 0; i--) {
      if (waiters[i].match(msg)) waiters.splice(i, 1)[0].resolve(msg);
    }
  });

  const ready = new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });

  return {
    ready,
    send(method, params = {}, sessionId) {
      const message = { id: ++id, method, params };
      if (sessionId) message.sessionId = sessionId;
      return new Promise((resolve, reject) => {
        pending.set(message.id, { resolve, reject });
        ws.send(JSON.stringify(message));
      });
    },
    once(method, sessionId, timeout = 45000) {
      return new Promise((resolve, reject) => {
        const waiter = {
          match: (m) => m.method === method && (!sessionId || m.sessionId === sessionId),
          resolve,
        };
        waiters.push(waiter);
        setTimeout(() => {
          const i = waiters.indexOf(waiter);
          if (i !== -1) {
            waiters.splice(i, 1);
            reject(new Error(`timed out waiting for ${method}`));
          }
        }, timeout);
      });
    },
    close: () => ws.close(),
  };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Resolve everything that would otherwise paint late: webfonts, and the
 * cover/gallery artwork, which is applied as CSS backgrounds and so is not
 * covered by the load event.
 */
const SETTLE = `(async () => {
  document.querySelectorAll('nextjs-portal').forEach(el => el.remove());
  try { await document.fonts.ready; } catch (e) {}
  document.documentElement.classList.remove('fonts-pending');
  const urls = new Set();
  document.querySelectorAll('*').forEach(el => {
    const bg = getComputedStyle(el).backgroundImage;
    if (!bg || bg === 'none') return;
    for (const m of bg.matchAll(/url\\("?([^")]+)"?\\)/g)) {
      if (!m[1].startsWith('data:')) urls.add(m[1]);
    }
  });
  const results = await Promise.all([...urls].map(src => new Promise(res => {
    const img = new Image();
    img.onload = () => res(true);
    img.onerror = () => res(src);
    img.src = src;
  })));
  return JSON.stringify({ images: urls.size, failed: results.filter(r => r !== true) });
})()`;

/* ── launch a throwaway Chrome so the user's own profile is untouched ── */

const profile = path.join(tmpdir(), `pdf-export-${process.pid}`);
const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--no-first-run",
  "--no-default-browser-check",
  `--user-data-dir=${profile}`,
  "--remote-debugging-port=0",
  "about:blank",
]);
chrome.stderr.on("data", () => {});

const portFile = path.join(profile, "DevToolsActivePort");
let devtoolsPort;
for (let i = 0; i < 100 && !devtoolsPort; i++) {
  await sleep(100);
  if (existsSync(portFile)) devtoolsPort = (await readFile(portFile, "utf8")).split("\n")[0].trim();
}
if (!devtoolsPort) throw new Error("Chrome never reported a DevTools port");

const { webSocketDebuggerUrl } = await (
  await fetch(`http://127.0.0.1:${devtoolsPort}/json/version`)
).json();

const cdp = connect(webSocketDebuggerUrl);
await cdp.ready;
await mkdir(OUT, { recursive: true });

let failures = 0;
for (const [i, [slug, label]] of CASES.entries()) {
  const name = `${String(i + 1).padStart(2, "0")}-${label}.pdf`;
  const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });

  await cdp.send("Page.enable", {}, sessionId);
  // Print rules change the layout (media gets its own centred sheet), so
  // emulate print *before* settling and measuring.
  await cdp.send("Emulation.setEmulatedMedia", { media: "print" }, sessionId);

  const loaded = cdp.once("Page.loadEventFired", sessionId);
  await cdp.send("Page.navigate", { url: `${ORIGIN}/work/${slug}` }, sessionId);
  await loaded;

  const settled = await cdp.send(
    "Runtime.evaluate",
    { expression: SETTLE, awaitPromise: true, returnByValue: true },
    sessionId,
  );
  const report = JSON.parse(settled.result.value);
  await sleep(400); // let the decoded artwork paint

  const { data } = await cdp.send(
    "Page.printToPDF",
    {
      printBackground: true,
      preferCSSPageSize: true,
      landscape: true,
      paperWidth: 11.69,
      paperHeight: 8.27,
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
    },
    sessionId,
  );

  await writeFile(path.join(OUT, name), Buffer.from(data, "base64"));
  await cdp.send("Target.closeTarget", { targetId });

  const bad = report.failed.length;
  if (bad) failures += bad;
  console.log(
    `${name.padEnd(36)} ${report.images} images${bad ? `  ⚠ ${bad} failed: ${report.failed.join(", ")}` : ""}`,
  );
}

cdp.close();
chrome.kill();
// Chrome keeps writing to its profile for a moment after the signal, so a
// straight rm races it and trips on a directory that refilled mid-walk.
await new Promise((r) => chrome.once("exit", r));
for (let i = 0; i < 5; i++) {
  try {
    await rm(profile, { recursive: true, force: true });
    break;
  } catch {
    await sleep(200);
  }
}
console.log(`\n${CASES.length} PDFs → ${OUT}`);
if (failures) {
  console.error(`${failures} image(s) failed to load — the PDFs will show gradients there.`);
  process.exit(1);
}
