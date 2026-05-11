from database import SessionLocal, engine, Base
import models

PHYSICIANS = [
    {
        "name": "Dr. Sarah Chen",
        "specialty": "Cardiology",
        "bio": "Board-certified cardiologist with 15 years of experience in preventive heart care and advanced cardiac imaging. Fluent in Mandarin.",
    },
    {
        "name": "Dr. Marcus Webb",
        "specialty": "Orthopedics",
        "bio": "Sports medicine specialist focused on minimally invasive joint repair and rehabilitation. Former team physician for the city's professional soccer club.",
    },
    {
        "name": "Dr. Priya Patel",
        "specialty": "Dermatology",
        "bio": "Specializes in medical and cosmetic dermatology, including skin cancer screening and advanced laser treatments. Published researcher in melanoma detection.",
    },
    {
        "name": "Dr. James Liu",
        "specialty": "Neurology",
        "bio": "Neurologist with a focus on headache disorders, epilepsy, and neurodegenerative diseases. Leads the hospital's concussion management program.",
    },
    {
        "name": "Dr. Elena Rodriguez",
        "specialty": "Pediatrics",
        "bio": "Compassionate pediatrician serving patients from newborns to 18 years. Certified in pediatric emergency medicine and developmental behavioral health.",
    },
    {
        "name": "Dr. Omar Hassan",
        "specialty": "General Practice",
        "bio": "Family physician dedicated to comprehensive primary care for all ages. Emphasizes preventive medicine and chronic disease management with a patient-centered approach.",
    },
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing_names = {p.name for p in db.query(models.Physician.name).all()}
        added = 0
        for data in PHYSICIANS:
            if data["name"] not in existing_names:
                db.add(models.Physician(**data))
                added += 1
        db.commit()
        print(f"Seeded {added} physician(s). Database ready.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
