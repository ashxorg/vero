from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from typing import List

import models
import schemas
from database import engine, get_db, Base

app = FastAPI(title="Vero Health API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "OPTIONS"],
    allow_headers=["Content-Type", "Accept"],
)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)


def generate_slots(date: str) -> list[str]:
    slots = []
    for hour in range(9, 17):
        for minute in (0, 30):
            slots.append(f"{date}T{hour:02d}:{minute:02d}:00")
    return slots


@app.get("/physicians", response_model=List[schemas.PhysicianOut])
def get_physicians(db: Session = Depends(get_db)):
    return db.query(models.Physician).all()


@app.get("/appointments/available-slots")
def get_available_slots(physician_id: int, date: str, db: Session = Depends(get_db)):
    physician = db.query(models.Physician).filter(models.Physician.id == physician_id).first()
    if not physician:
        raise HTTPException(status_code=404, detail="Physician not found")

    all_slots = generate_slots(date)

    booked = (
        db.query(models.Appointment.date_time)
        .filter(
            models.Appointment.physician_id == physician_id,
            models.Appointment.date_time.like(f"{date}%"),
            models.Appointment.status != "cancelled",
        )
        .all()
    )
    booked_set = {row.date_time for row in booked}

    available = [s for s in all_slots if s not in booked_set]
    return {"slots": available}


@app.post("/appointments", response_model=schemas.AppointmentOut, status_code=status.HTTP_201_CREATED)
def create_appointment(body: schemas.AppointmentCreate, db: Session = Depends(get_db)):
    physician = db.query(models.Physician).filter(models.Physician.id == body.physician_id).first()
    if not physician:
        raise HTTPException(status_code=404, detail="Physician not found")

    existing = (
        db.query(models.Appointment)
        .filter(
            models.Appointment.physician_id == body.physician_id,
            models.Appointment.date_time == body.date_time,
            models.Appointment.status != "cancelled",
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=409, detail="This time slot is already booked")

    patient = models.Patient(name=body.patient_name, contact_info=body.contact_info)
    db.add(patient)
    db.flush()

    appointment = models.Appointment(
        patient_id=patient.id,
        physician_id=body.physician_id,
        date_time=body.date_time,
        status="pending",
        reason=body.reason,
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    return (
        db.query(models.Appointment)
        .options(joinedload(models.Appointment.patient), joinedload(models.Appointment.physician))
        .filter(models.Appointment.id == appointment.id)
        .first()
    )


@app.get("/appointments", response_model=List[schemas.AppointmentOut])
def get_appointments(db: Session = Depends(get_db)):
    return (
        db.query(models.Appointment)
        .options(joinedload(models.Appointment.patient), joinedload(models.Appointment.physician))
        .order_by(models.Appointment.date_time)
        .all()
    )


@app.patch("/appointments/{appointment_id}/status", response_model=schemas.AppointmentOut)
def update_appointment_status(
    appointment_id: int,
    body: schemas.AppointmentStatusUpdate,
    db: Session = Depends(get_db),
):
    appointment = db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    appointment.status = body.status
    db.commit()
    db.refresh(appointment)

    return (
        db.query(models.Appointment)
        .options(joinedload(models.Appointment.patient), joinedload(models.Appointment.physician))
        .filter(models.Appointment.id == appointment_id)
        .first()
    )
