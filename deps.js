import { execSync } from "child_process"

let puppeteer, inquirer

async function ensureDeps() {
  const deps = ["puppeteer", "inquirer"]
  for (const dep of deps) {
    try {
      await import(dep)
    } catch {
      console.log(`Missing dependency: ${dep}, installing...`)
      execSync(`npm install ${dep}`, { stdio: "inherit" })
    }
  }
  puppeteer = (await import("puppeteer")).default
  inquirer = (await import("inquirer")).default
}

export { ensureDeps, puppeteer, inquirer }
