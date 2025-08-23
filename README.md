# guns.lol / haunt.gg Username Sniper

A Node.js tool that checks for available usernames on [guns.lol](https://guns.lol) and [haunt.gg](https://haunt.gg).  
It supports auto-updating from this repository, keeps logs, and automatically installs required dependencies (`puppeteer`, `inquirer`).

---

## Features
- **Auto-updater** – fetches the latest version from this repo.  
- **Changelog sync** – updates `changelogs.txt` when new changes are available.  
- **Username checker** – scans usernames of a given length on `guns.lol` or `haunt.gg`.  
- **Logging** – writes update and runtime logs.  
- **Auto dependency install** – ensures `puppeteer` & `inquirer` are installed before running.  

---

## Requirements
- [Node.js](https://nodejs.org/) (v16+ recommended)  
- Internet connection (for updates & username checks)

---

## Installation
Clone this repo:
```bash
git clone https://github.com/odinong/guns.lol-clone-sniper.git
cd guns.lol-clone-sniper
