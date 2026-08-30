# Imports
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import subprocess


app = FastAPI()
@app.get("/api/status")
def status():
    return {"status": "ok"}



@app.get("/api/ping/{host}")
def ping_host(host: str):
    result = subprocess.run(
        ["ping", "-c", "1", "-W", "2", host],
        capture_output=True, text=True
    )
    return {"host": host, "reachable": result.returncode == 0}


BASE_DIR = Path(__file__).resolve().parent.parent
app.mount("/", StaticFiles(directory=BASE_DIR / "Frontend", html=True), name="frontend")