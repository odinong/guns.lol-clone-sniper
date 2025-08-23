# guns.lol / haunt.gg Username Sniper

A Node.js tool that checks for available usernames on [guns.lol](https://guns.lol) and [haunt.gg](https://haunt.gg).  
It supports auto-updating from this repository, keeps logs, and automatically installs required dependencies (`puppeteer`, `inquirer`).

---

## Features
- Auto-updater – fetches the latest version from this repo  
- Changelog sync – updates `changelogs.txt` when new changes are available  
- Username checker – scans usernames of a given length on `guns.lol` or `haunt.gg`  
- Logging – writes update and runtime logs  
- Auto dependency install – ensures `puppeteer` & `inquirer` are installed before running  

---

## Requirements
- [Node.js](https://nodejs.org/) (v16+ recommended)  
- Internet connection (for updates & username checks)

---

## Installation
Simply download the latest release, and open `run.bat`.
---

## Usage
When started, you’ll be prompted for:
1. Site – choose between `guns.lol` or `haunt.gg`  
2. Length – how many characters long the usernames should be  
3. Gap – time between each request in milliseconds  
4. Wait – wait time when rate-limited  
5. Output file – where free usernames will be saved  

---

## Example Screenshots

- [Prompt Example](https://raw.github.com/odinong/guns.lol-clone-sniper/blob/main/examples/prompt.png)  
- [Sample free.txt Output](https://raw.github.com/odinong/guns.lol-clone-sniper/blob/main/examples/notepad.png)  

---

## Example Output File (free.txt)

```
abc
qwe
9kz
lol
7up
m88
```

---

## Logs
- `update-log.txt` → keeps update history  
- `changelogs.txt` → fetched changelog from the repo  
- `free.txt` → list of free usernames found (customizable)  

---

## Disclaimer
This tool is for educational purposes only.  
Use responsibly and respect the terms of service of the websites you interact with.
