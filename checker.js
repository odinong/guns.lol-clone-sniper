import fs from "fs"
import https from "https"
import { exec } from "child_process"
import path from "path"
import puppeteer from "puppeteer"
import inquirer from "inquirer"

const ver = "0.0.4"
const repo = "https://raw.githubusercontent.com/odinong/guns.lol-clone-sniper/refs/heads/main/"
const files = {
  self: path.resolve(process.argv[1]),
  changelog: path.resolve("changelogs.txt"),
  updatelog: path.resolve("update-log.txt")
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

function writelog(msg) {
  const stamp = new Date().toISOString()
  fs.appendFileSync(files.updatelog, `[${stamp}] ${msg}\n`)
}

function restart() {
  const cmd = `timeout /t 1 >nul && node "${files.self}"`
  spawn("cmd", ["/c", cmd], {
    detached: true,
    stdio: "ignore"
  }).unref()
  process.exit(0)
}
async function upd8() {
  console.log("checking for updates...")
  writelog("checking update... local=" + ver)
  const newer = await grab(repo + "checker.js")
  if (newer) {
    const m = newer.match(/const ver\s*=\s*"(.*?)"/)
    if (m && m[1]) {
      const remoteVer = m[1]
      writelog("remote=" + remoteVer)

      if (remoteVer !== ver) {
        console.log(`new ver ${remoteVer} found (ur on ${ver})`)
        writelog("update found, replacing file")
        fs.writeFileSync(files.self, newer, "utf8")
        console.log("restarting...\n")
        restart()
      } else {
        console.log("no update, staying on " + ver + "\n")
        writelog("no update, same ver")
      }
    } else {
      writelog("couldn't read remote ver")
    }
  } else {
    writelog("failed to grab remote file")
  }

  const log = await grab(repo + "changelog.txt")
  if (log) {
    let old = ""
    if (fs.existsSync(files.changelog)) old = fs.readFileSync(files.changelog, "utf8")
    if (log.trim() !== old.trim()) {
      fs.writeFileSync(files.changelog, log, "utf8")
      console.log("\nchangelog updated:\n")
      console.log(log + "\n")
      writelog("changelog updated")
    } else {
      writelog("changelog same")
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



