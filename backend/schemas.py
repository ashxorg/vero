from typing import Optional, Literal
from pydantic import BaseModel, ConfigDict


class PhysicianOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    specialty: str
    bio: Optional[str] = None


class PatientOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    contact_info: str


class AppointmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    patient: PatientOut
    physician: PhysicianOut
    date_time: str
    status: str
    reason: Optional[str] = None


class AppointmentCreate(BaseModel):
    patient_name: str
    contact_info: str
    physician_id: int
    date_time: str
    reason: Optional[str] = None


class AppointmentStatusUpdate(BaseModel):
    status: Literal["pending", "confirmed", "cancelled"]
