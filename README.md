# Vero Health — Patient Booking Flow

A lightweight full-stack appointment booking system built as a technical work sample. Patients can browse physicians, select an available time slot, and submit a booking request. Administrators can view all appointments on a Kanban board and update their statuses in real time.

---

## Quick Start

### Prerequisites

- **Python 3.11+** (tested on 3.14)
- **Node.js 18+** and npm

### 1. Backend

```bash
cd backend

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate          # macOS/Linux
venv\Scripts\activate             # Windows

# Install dependencies
pip install -r requirements.txt

# Seed the database with physician data (run once)
python seed.py

# Start the API server
uvicorn main:app --reload --port 8000
```

The API will be available at `http://127.0.0.1:8000`.  
Interactive docs (Swagger UI) at `http://127.0.0.1:8000/docs`.

### 2. Frontend

In a **separate terminal**:

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

> Both servers must run simultaneously. The Vite dev server proxies `/api/*` requests to the FastAPI backend, so no CORS configuration is needed in the browser.

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
- Healthcare-appropriate color palette: calming sky blue for primary actions, green for confirmed, amber for pending, red for cancelled

---

## Key Technical & Product Decisions

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

## API Reference

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/physicians` | List all physicians |
| `GET` | `/appointments/available-slots?physician_id=X&date=YYYY-MM-DD` | Available 30-min slots for a physician on a given date |
| `POST` | `/appointments` | Book an appointment (creates patient inline, status=pending) |
| `GET` | `/appointments` | List all appointments (joined with patient and physician data) |
| `PATCH` | `/appointments/{id}/status` | Update appointment status |

---

## Project Structure

```
vero/
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
        ├── components/  # PhysicianCard, DatePicker, TimeSlotGrid,
        │                #   PatientForm, SuccessScreen, KanbanBoard,
        │                #   AppointmentCard, Header, Toast, Spinner,
        │                #   BookingStepIndicator
        ├── context/     # ToastContext — global toast notifications
        ├── pages/       # BookingWizard (patient), AdminDashboard (admin)
        └── types/       # TypeScript interfaces matching backend schemas
```

---

## Future Improvements

Given more time, these are the highest-priority additions for a production deployment:

- **Authentication:** JWT-based auth for the admin view (FastAPI OAuth2 + bcrypt) and optional patient accounts for booking history. The current UI toggle is for demo purposes only.
- **Database migration:** Switch from SQLite to PostgreSQL using Alembic for schema migrations. SQLite is not suitable for concurrent writes in production.
- **Email/SMS notifications:** Send confirmation emails via SendGrid or SMS via Twilio when an appointment is created or its status changes.
- **Input validation:** Add Zod schemas on the frontend for form validation with detailed field-level error messages. Add stricter Pydantic validators on the backend (email format, phone format, date range checks).
- **Test coverage:** React Testing Library for component tests, Pytest with HTTPX for FastAPI integration tests hitting a real test database.
- **Real calendar integration:** Read busy/free slots from Google Calendar or iCal rather than the mock slot generator.
- **Timezone support:** Store `date_time` as a timezone-aware UTC datetime column in Postgres, convert to the patient's local timezone in the frontend.
- **Pagination:** The admin dashboard loads all appointments in a single query. For production, add cursor-based pagination to `GET /appointments`.
- **Accessibility audit:** Full keyboard navigation for the DatePicker and slot grid, ARIA labels on interactive elements, focus management between wizard steps.
