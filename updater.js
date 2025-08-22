import fs from "fs"
import path from "path"
import { spawn } from "child_process"
import { grab, writelog } from "./utils.js"

const ver = "1.0.2"
const repo = "https://suicides.mov/sniper/"
const files = {
  self: path.resolve(process.argv[1]),
  changelog: path.resolve("changelogs.txt"),
  updatelog: path.resolve("update-log.txt")
}

function restart() {
  const absolutePath = path.resolve(files.self)
  if (!fs.existsSync(absolutePath)) {
    writelog(`error: main file not found at ${absolutePath}`)
    process.exit(1)
  }
  console.log("Restarting application...")
  writelog("restarting application")

  const child = spawn("node", [absolutePath], {
    detached: false,
    stdio: "inherit",
    windowsHide: false
  })

  child.on("exit", code => process.exit(code || 0))
  child.on("error", error => process.exit(1))
}

async function updateChangelog() {
  const log = await grab(repo + "changelog.txt")
  if (!log) return
  let oldLog = ""
  if (fs.existsSync(files.changelog)) {
    oldLog = fs.readFileSync(files.changelog, "utf8")
  }
  if (log.trim() !== oldLog.trim()) {
    fs.writeFileSync(files.changelog, log, "utf8")
    console.log("\nchangelog updated:\n")
    console.log(log + "\n")
    writelog("changelog updated")
  } else {
    writelog("changelog same")
  }
}

async function upd8() {
  console.log("checking for updates...")
  writelog(`checking update... local=${ver}`)
  const newer = await grab(repo + "checker.js")
  if (!newer) return false
  const versionMatch = newer.match(/const ver\s*=\s*["'](.*?)["']/)
  if (!versionMatch || !versionMatch[1]) return false
  const remoteVer = versionMatch[1]
  if (remoteVer !== ver) {
    console.log(`new ver ${remoteVer} found (ur on ${ver})`)
    writelog("update found, replacing file")
    const backupFile = files.self + ".backup"
    if (fs.existsSync(files.self)) fs.copyFileSync(files.self, backupFile)
    fs.writeFileSync(files.self, newer, "utf8")
    console.log("quitting\nplease restart after this window closes")
    writelog("update completed, restarting")
    restart()
    return true
  } else {
    console.log(`no update, staying on ${ver}\n`)
    writelog("no update, same ver")
    await updateChangelog()
    return false
  }
}

export { upd8 }
