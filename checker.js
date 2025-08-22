import fs from "fs"

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

export { check }
