"""
run.py — One-command launcher for Vero Health (backend + frontend).
Usage: python run.py
"""
import os
import sys
import subprocess
import webbrowser
import threading

ROOT = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(ROOT, "backend")
FRONTEND_DIR = os.path.join(ROOT, "frontend")

IS_WINDOWS = sys.platform == "win32"

if IS_WINDOWS:
    PYTHON_EXE = os.path.join(BACKEND_DIR, "venv", "Scripts", "python.exe")
    NPM_CMD = "npm.cmd"
else:
    PYTHON_EXE = os.path.join(BACKEND_DIR, "venv", "bin", "python")
    NPM_CMD = "npm"

if not os.path.isfile(PYTHON_EXE):
    print("\n❌  Virtual environment not found.")
    print("    Run this first:\n")
    print("        cd backend")
    if IS_WINDOWS:
        print("        python -m venv venv")
        print("        venv\\Scripts\\activate")
    else:
        print("        python3 -m venv venv")
        print("        source venv/bin/activate")
    print("        pip install -r requirements.txt")
    print("        python seed.py\n")
    sys.exit(1)

print("\U0001f680  Starting Vero Health...")
print("    Backend  → http://127.0.0.1:8000")
print("    Frontend → http://localhost:5173")
print("    Press Ctrl+C to stop both servers.\n")

backend_proc = subprocess.Popen(
    [PYTHON_EXE, "-m", "uvicorn", "main:app", "--reload", "--port", "8000"],
    cwd=BACKEND_DIR,
)

frontend_proc = subprocess.Popen(
    [NPM_CMD, "run", "dev"],
    cwd=FRONTEND_DIR,
)

threading.Timer(3.0, lambda: webbrowser.open("http://localhost:5173")).start()

try:
    backend_proc.wait()
    frontend_proc.wait()
except KeyboardInterrupt:
    print("\n\n\U0001f6d1  Shutting down...")
    backend_proc.terminate()
    frontend_proc.terminate()
    backend_proc.wait()
    frontend_proc.wait()
    print("    Both servers stopped. Goodbye!")
