# Spectre 

A personal home lab dashboard. FastAPI backend serving a static HTML/CSS/JS frontend, hosted on Proxmox and accessible via Tailscale remotely. 


## Overview

Spectre is a single-pane dashboard for quick access to homelab services and daily info — dark purple ghost-themed UI with amber/gold accents. 

## Layout:
- Header: "SPECTRE" title + Tailscale button (links to Tailscale admin console)
- Top row: merged date/time + weather card (live location, color-coded current temperature, forecast description), Link out to Domovoy, 2×2 link tile grid (Gmail, YouTube, Crunchyroll, Claude)
- Bottom row: My Hallam (uni), Proxmox link, OPNsense link
  
## Stack:
- Backend: Python, FastAPI
- Frontend: HTML/CSS/JS (static, served by the backend)
- Weather: Open-Meteo API, live geolocation, hourly refresh
- Hosting: Proxmox LXC container (Debian 12), running as a systemd service (Restart=always, enabled on boot), static LAN IP
- Remote access: Tailscale — private access only, reachable from any device on the tailnet regardless of network

  
## Project Structure:  
```
Dashboard - Spectre/
├── Backend/
│   └── main.py
└── Frontend/
    ├── index.html
    ├── script.js
    ├── style.css
    └── SpectreBackground.jpg
```
    

## Related projects:
Task Tracker (Domovoy) — separate FastAPI + HTML/CSS/JS project, own port, also hosted on the homelab Proxmox box. Spectre's Daily Tasks card links out to it in a new tab.

## Status:
Complete and hosted on Proxmox — running continuously, accessible from anywhere via Tailscale.

## Domovoy:
https://github.com/Oliver-Tay23/Task-Tracker-Domovoy
