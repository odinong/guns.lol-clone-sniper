import fs from "fs"
import https from "https"
import path from "path"

const files = {
  updatelog: path.resolve("update-log.txt")
}

async function grab(url) {
  return new Promise(ok => {
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

export { grab, writelog }
 