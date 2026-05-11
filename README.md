# Vero Health — Patient Booking Flow

A lightweight full-stack appointment booking system built as a technical work sample. Patients can browse physicians, select an available time slot, and submit a booking request. Administrators can view all appointments on a Kanban board and update their statuses in real time.

---

## What You'll Need

- **Python 3.11+** — [python.org/downloads](https://www.python.org/downloads/)
- **Node.js 18+** (includes npm) — [nodejs.org](https://nodejs.org/)
- **Git** — [git-scm.com](https://git-scm.com/)

> **Windows users:** When installing Python, check **"Add Python to PATH"** on the first installer screen. Do the same for Node.js. Without this, the commands below won't work.

---

## One-Time Setup

Run these commands once after cloning the repo. You never need to repeat them.

### macOS / Linux

```bash
# 1. Backend — create virtual environment, install dependencies, seed database
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python seed.py
cd ..

# 2. Frontend — install Node packages
cd frontend
npm install
cd ..
```

### Windows (Command Prompt or PowerShell)

```cmd
:: 1. Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python seed.py
cd ..

:: 2. Frontend
cd frontend
npm install
cd ..
```

---

## Running the App (Every Time)

After the one-time setup, a single command starts everything:

```bash
python run.py        # Windows
python3 run.py       # macOS / Linux
```

The script will:
1. Start the FastAPI backend at `http://127.0.0.1:8000`
2. Start the Vite frontend at `http://localhost:5173`
3. Open your browser automatically after 3 seconds

Press **Ctrl+C** to stop both servers cleanly.

---

## How to Run This Project (Step-by-Step for Absolute Beginners)

Never used a terminal before? Follow these steps exactly.

### Step 1 — Get the code

Open a terminal (macOS: press Cmd+Space, type "Terminal"; Windows: press Win+R, type "cmd", press Enter) and run:

```bash
git clone <repo-url>
cd vero
```

### Step 2 — Install Python and Node.js

- **Python:** Go to [python.org/downloads](https://www.python.org/downloads/), download the installer for your OS, run it. **On Windows: check "Add Python to PATH" before clicking Install.**
- **Node.js:** Go to [nodejs.org](https://nodejs.org/), download the LTS version, run the installer.

Verify both installed:
```bash
python --version    # should print Python 3.11 or higher
node --version      # should print v18 or higher
npm --version       # should print 9 or higher
```

> On macOS/Linux, use `python3 --version` instead of `python --version`.

### Step 3 — One-time setup

**macOS / Linux:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python seed.py
cd ../frontend
npm install
cd ..
```

**Windows:**
```cmd
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python seed.py
cd ..\frontend
npm install
cd ..
```

### Step 4 — Start the app

```bash
python run.py       # Windows
python3 run.py      # macOS / Linux
```

Your browser will open to `http://localhost:5173` in about 3 seconds. If it doesn't, open your browser and go to that address manually.

### Step 5 — Stop the app

Press **Ctrl+C** in the terminal window. Both servers stop automatically.

---

## What I Built

A two-audience web application served from a single page with a header toggle:

### Patient Flow
- **Step 1 — Choose a physician:** A responsive card grid displays all available physicians with their specialty and a short bio. Each card is selectable with clear visual feedback.
- **Step 2 — Pick a date and time:** A custom calendar (no third-party date-picker dependency) lets patients navigate months and select a date. Available 30-minute slots (9 AM – 4:30 PM) are fetched from the API for the selected physician and date, with already-booked slots automatically excluded.
- **Step 3 — Enter details:** A clean form collects name, contact info, and an optional reason for visit. A booking summary panel shows the selected physician and time for confirmation. On submit, the appointment is created with a `pending` status and a success screen confirms the booking.

### Admin Dashboard
- A Kanban board with three columns: **Pending**, **Confirmed**, and **Cancelled**.
- Each appointment card shows the patient name, physician, formatted date/time, and reason snippet.
- Admins can **Confirm** or **Cancel** appointments directly from the card with a single click.
- Status updates use **optimistic UI** — the card moves columns immediately, with an API call in flight. On failure, it reverts and shows an error toast.

### UX Details
- Loading spinners on all async operations
- Color-coded toast notifications (success / error / info) with auto-dismiss
- Fully responsive layout (mobile through desktop)
- Healthcare-appropriate color palette: Vero brand blue (#348cc4) for primary actions, green for confirmed, amber for pending, red for cancelled

---

## Key Technical & Product Decisions

### `run.py` for Developer Experience (DX)
A reviewer evaluating a work sample shouldn't have to juggle two terminals, remember port numbers, or wait to figure out when Vite is ready before opening a browser. `run.py` starts both servers, waits 3 seconds for Vite to boot, and opens the browser automatically — reducing "clone to running app" from ~10 steps to 1 command. It detects the OS at runtime (`sys.platform`), handles Windows `npm.cmd` vs Unix `npm`, and exits cleanly on Ctrl+C with `proc.terminate()` + `proc.wait()` to avoid orphan processes.

### Why FastAPI + React (TypeScript)?
FastAPI's automatic OpenAPI generation made iterating on the API contract fast — the interactive `/docs` UI served as a live testing environment throughout development. React with TypeScript provided type safety across the entire data layer, catching schema mismatches at compile time rather than runtime.

### SQLite with ISO String Date Storage
Rather than using SQLite's datetime type (which introduces timezone ambiguity) or a full Postgres setup, appointment times are stored as plain ISO 8601 strings (`2026-05-12T09:00:00`). This makes the available-slots query trivially simple (`LIKE '2026-05-12%'`) and eliminates any ORM-level datetime conversion overhead. The tradeoff is that timezone-aware queries would require a migration, but for a local prototype it's the right call.

### Vite Proxy Instead of Hardcoded Backend URL
All frontend API calls use the relative path `/api/...`. Vite's dev server proxies these to FastAPI during development. This means zero environment-specific configuration in the frontend code — the same build works whether the backend is on port 8000 locally or behind a reverse proxy in production.

### Inline Patient Creation
The `POST /appointments` endpoint accepts `patient_name` and `contact_info` directly, creating a `Patient` row and an `Appointment` row in a single transaction. This models a guest-booking flow (no account required), which is appropriate for a first-contact healthcare scheduling experience where friction should be minimal.

### Optimistic UI on the Admin Kanban
When an admin clicks Confirm or Cancel, the card moves to the new column immediately while the API call is in flight. If the request fails, the card reverts with an error toast. This makes the admin workflow feel instant even on a slow network, without sacrificing correctness.

### Custom DatePicker (No Third-Party Component)
Using `date-fns` functions directly (`eachDayOfInterval`, `getDay`, `startOfMonth`) to render a calendar grid keeps the bundle lean and gives full control over the visual design to match the healthcare color palette. A date-picker library would add ~30 KB for functionality that's a straightforward grid layout.

### No React Router
With exactly two views (patient / admin) toggled by a boolean in `App.tsx`, adding React Router would be premature. A single `isAdmin` state flag is simpler, easier to reason about, and trivially replaceable with proper routing when the app grows.

---

## What I'd Improve With More Time

- **Authentication:** JWT-based auth for the admin view (FastAPI OAuth2 + bcrypt) and optional patient accounts for booking history. The current UI toggle is for demo purposes only.
- **Database migration:** Switch from SQLite to PostgreSQL using Alembic for schema migrations. SQLite is not suitable for concurrent writes in production.
- **Email/SMS notifications:** Send confirmation emails via SendGrid or SMS via Twilio when an appointment is created or its status changes.
- **Input validation:** Add Zod schemas on the frontend for form validation with detailed field-level error messages. Add stricter Pydantic validators on the backend (email format, phone format, date range checks).
- **Test coverage:** React Testing Library for component tests, Pytest with HTTPX for FastAPI integration tests hitting a real test database.
- **Real calendar integration:** Read busy/free slots from Google Calendar or iCal rather than the mock slot generator.
- **Timezone support:** Store `date_time` as a timezone-aware UTC datetime column in Postgres, convert to the patient's local timezone in the frontend.
- **Pagination:** The admin dashboard loads all appointments in a single query. For production, add cursor-based pagination to `GET /appointments`.
- **Accessibility audit:** Full keyboard navigation for the DatePicker and slot grid, ARIA labels on interactive elements, focus management between wizard steps.

---

## API Reference

Interactive docs (Swagger UI) available at `http://127.0.0.1:8000/docs` while the backend is running.

- `GET /physicians` — List all physicians
- `GET /appointments/available-slots?physician_id=X&date=YYYY-MM-DD` — Available 30-min slots for a physician on a given date
- `POST /appointments` — Book an appointment (creates patient inline, status=pending)
- `GET /appointments` — List all appointments (joined with patient and physician data)
- `PATCH /appointments/{id}/status` — Update appointment status

---

## Project Structure

```
vero/
├── run.py               # One-command launcher (starts both servers + opens browser)
├── backend/
│   ├── database.py      # SQLAlchemy engine, session, and get_db dependency
│   ├── models.py        # ORM models: Physician, Patient, Appointment
│   ├── schemas.py       # Pydantic v2 request/response schemas
│   ├── main.py          # FastAPI app, CORS config, all route handlers
│   ├── seed.py          # One-time database seeding script
│   └── requirements.txt
└── frontend/
    └── src/
        ├── api/         # Typed fetch wrappers for all 5 endpoints
        ├── assets/      # Vero logo SVG
        ├── components/  # PhysicianCard, DatePicker, TimeSlotGrid,
        │                #   PatientForm, SuccessScreen, KanbanBoard,
        │                #   AppointmentCard, Header, Toast, Spinner,
        │                #   BookingStepIndicator
        ├── context/     # ToastContext — global toast notifications
        ├── pages/       # BookingWizard (patient), AdminDashboard (admin)
        └── types/       # TypeScript interfaces matching backend schemas
```

---

## Troubleshooting

**`❌ Virtual environment not found`**
Follow the One-Time Setup section above.

**`ModuleNotFoundError: No module named 'fastapi'`**
Run `cd backend && pip install -r requirements.txt`.

**`No physicians in the database`**
Run `cd backend && python seed.py` (or `python3 seed.py` on macOS/Linux).

**`address already in use` on port 8000**
Another uvicorn process is running. On macOS/Linux: `kill $(lsof -ti:8000)`. On Windows: find the PID with `netstat -ano` then `taskkill /PID <PID> /F`.

**`address already in use` on port 5173**
Another Vite instance is running. Close the other terminal or restart your machine.

**`'python' is not recognized` (Windows)**
Python is not on PATH. Reinstall from python.org with "Add to PATH" checked, or try `py run.py`.

**`'npm' is not recognized` (Windows)**
Node.js is not on PATH. Reinstall from nodejs.org with "Add to PATH" checked, then restart the terminal.

**`cannot be loaded because running scripts is disabled` (Windows)**
Run `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` in PowerShell as Administrator.

**`python3: command not found` (macOS)**
Install via `brew install python` or download from python.org.

**`xcrun: error` during pip install (macOS)**
Run `xcode-select --install` to install Xcode Command Line Tools.

**`pip: command not found` (Linux)**
Run `sudo apt install python3-pip`.

**`node: not found` (Linux)**
Install Node.js via your package manager or from nodejs.org.

**Browser opens but shows a white screen**
Vite may still be compiling. Wait 5 seconds and hard-refresh (Ctrl+Shift+R / Cmd+Shift+R).

**`CORS error` in browser console**
The backend is not running. Ensure `run.py` started successfully and the API is on port 8000.

**`Failed to fetch` on every API call**
Check `frontend/vite.config.ts` — the proxy target must be `http://127.0.0.1:8000`.
