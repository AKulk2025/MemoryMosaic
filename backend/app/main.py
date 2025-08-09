from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List

app = FastAPI()

class PhotoIn(BaseModel):
    title: str
    description: str
    latitude: float
    longitude: float

class Photo(BaseModel):
    title: str
    description: str
    latitude: float
    longitude: float
    id: int

photos_db: List[Photo] = []
@app.get("/")
async def root():
    return {"status": "Backend is online"}

@app.post("/photos/")
async def add_photo(photo: PhotoIn):
    new_id = len(photos_db) + 1
    new_photo = Photo(title = photo.title, description = photo.description, latitude = photo.latitude, longitude = photo.longitude, id=new_id)
    photos_db.append(new_photo)
    return {"message": "Photo info received!", "photo": new_photo}

@app.get('/photos/', response_model=List[Photo])
async def list_photos():
    return photos_db

