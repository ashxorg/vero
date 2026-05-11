from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Physician(Base):
    __tablename__ = "physicians"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    specialty = Column(String(100), nullable=False)
    bio = Column(Text, nullable=True)

    appointments = relationship("Appointment", back_populates="physician")


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    contact_info = Column(String(255), nullable=False)

    appointments = relationship("Appointment", back_populates="patient")


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    physician_id = Column(Integer, ForeignKey("physicians.id"), nullable=False)
    date_time = Column(String(50), nullable=False)
    status = Column(String(20), nullable=False, default="pending")
    reason = Column(Text, nullable=True)

    patient = relationship("Patient", back_populates="appointments")
    physician = relationship("Physician", back_populates="appointments")
