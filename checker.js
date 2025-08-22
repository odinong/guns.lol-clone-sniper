import fs from "fs"
import https from "https"
import { exec } from "child_process"
import path from "path"
import puppeteer from "puppeteer"
import inquirer from "inquirer"

const repo = "https://raw.githubusercontent.com/YOURNAME/YOURREPO/main/"
const files = {
  self: path.resolve(process.argv[1]),
  changelog: path.resolve("changelog.txt")
}

async function grab(url) {
  return new Promise((ok, bad) => {
    https.get(url, res => {
      if (res.statusCode !== 200) return ok(null)
      let buf = ""
      res.on("data", x => buf += x)
      res.on("end", () => ok(buf))
    }).on("error", () => ok(null))
  })
}

async function upd8() {
  const newer = await grab(repo + "checker.js")
  if (newer) {
    const now = fs.readFileSync(files.self, "utf8")
    if (newer.trim() !== now.trim()) {
      console.log("\nnew ver found, downloading")
      fs.writeFileSync(files.self, newer, "utf8")
      console.log("rebootin...\n")
      exec(`node ${files.self}`)
      process.exit(0)
    }
  }

  const log = await grab(repo + "changelog.txt")
  if (log) {
    let old = ""
    if (fs.existsSync(files.changelog)) old = fs.readFileSync(files.changelog, "utf8")
    if (log.trim() !== old.trim()) {
      fs.writeFileSync(files.changelog, log, "utf8")
      console.log("\nchangelogs updated:\n")
      console.log(log + "\n")
    }
  }

  const extras = ["config.json", "readme.txt"] 
  for (const f of extras) {
    const got = await grab(repo + f)
    if (got) {
      const loc = path.resolve(f)
      if (!fs.existsSync(loc) || fs.readFileSync(loc, "utf8").trim() !== got.trim()) {
        fs.writeFileSync(loc, got, "utf8")
        console.log("synced " + f)
      }
    }
  }
}

async function fuckingidk(n, junk, pre = "", bag = []) {
  if (pre.length === n) {
    bag.push(pre)
    return
  }
  for (const x of junk) {
    await fuckingidk(n, junk, pre + x, bag)
  }
  return bag
}

async function check(p, u, nam, stuf) {
  const link = `${u}/${nam}`
  try {
    const go = await p.goto(link, { waitUntil: "domcontentloaded" })
    if (go && go.status() === 429) {
      console.log("ratelimit..")
      await new Promise(z => setTimeout(z, stuf.wait))
      return null
    }
    const txt = await p.evaluate(() => document.body.innerText)
    if (txt.includes("This user is not claimed") || txt.includes("The profile you are looking")) {
      console.log("free: " + nam)
      fs.appendFileSync(stuf.file, nam + "\n")
      return true
    } else {
      console.log("taken: " + nam)
      return false
    }
  } catch (e) {
    console.log("oops: " + e.message)
    await new Promise(z => setTimeout(z, stuf.wait))
    return null
  }
}

async function go() {
  console.clear()
  await upd8()

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

