import { ensureDeps, puppeteer, inquirer } from "./deps.js"
import { upd8 } from "./updater.js"
import { fuckingidk } from "./generator.js"
import { check } from "./checker.js"

async function go() {
  console.clear()
  await ensureDeps()
  await upd8()
  await new Promise(z => setTimeout(z, 3000))
  console.clear()

  const q = await inquirer.prompt([
    { type: "list", name: "site", message: "where u wanna check?", choices: [
      { name: "haunt.gg", value: "https://haunt.gg" },
      { name: "guns.lol", value: "https://guns.lol" }
    ]},
    { type: "input", name: "len", message: "how long names", default: 3, validate: v => !isNaN(v) && v > 0 },
    { type: "input", name: "gap", message: "time between checks (ms)", default: 200 },
    { type: "input", name: "wait", message: "wait time when blocked (ms)", default: 2000 },
    { type: "input", name: "file", message: "where to dump names", default: "free.txt" }
  ])

  const stuf = {
    gap: parseInt(q.gap),
    len: parseInt(q.len),
    wait: parseInt(q.wait),
    file: q.file,
    junk: "abcdefghijklmnopqrstuvwxyz0123456789",
    site: q.site
  }

  const b = await puppeteer.launch({ headless: true })
  const p = await b.newPage()
  const all = await fuckingidk(stuf.len, stuf.junk)

  console.log("\nchecking " + all.length + " names on " + stuf.site + "\n")

  for (const n of all) {
    await check(p, stuf.site, n, stuf)
    await new Promise(z => setTimeout(z, stuf.gap))
  }

  console.log("\ndone")
  await b.close()
}

go()
