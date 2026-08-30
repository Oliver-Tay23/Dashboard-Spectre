# Spectre 

A personal homelab dashboard. FastAPI backend serving a static HTML/CSS/JS frontend, hosted on Proxmox and exposed via Cloudflare Tunnel. 


## Overview

Spectre is a single-pane dashboard for quick access to homelab services and daily info — dark purple ghost-themed UI with amber/gold accents. 

## Layout:
- Header: "SPECTRE" title + Tailscale button (links to Tailscale admin console)
- Top row: date/time + weather card, Daily Tasks card, 2x2 link tile grid (Gmail, YouTube, Crunchyroll, Claude)
- Bottom row: My Hallam (uni), Proxmox link, OPNsense link
  
## Stack:
- Backend: Python, FastAPI
- Frontend: HTML/CSS/JS (static, served by the backend)
- Weather: Open-Meteo API, live geolocation, hourly refresh
- Hosting: Proxmox (likely LXC container), exposed externally via Cloudflare Tunnel (works around Starlink CGNAT)

## Project Structure:
Dashboard - Spectre/
├── Backend/
│  └── main.py
└── Frontend/
    ├── index.html
    ├── script.js
    ├── style.css
    └── SpectreBackground.jpg

## Related projects:
Daily Tasks — separate FastAPI + HTML/CSS/JS project, own port, also hosted on the homelab Proxmox box. Spectre's Daily Tasks card links out to it in a new tab.

## Status:
🚧 In progress — homelab dashboard project, not yet deployed.

