from fastapi import FastAPI, File, UploadFile, Form
from pydantic import BaseModel
from typing import List
import os

app = FastAPI()

class Photo(BaseModel):
    title: str
    description: str
    latitude: float
    longitude: float
    id: int
    image_filename: str

photos_db: List[Photo] = []
@app.get("/")
async def root():
    return {"status": "Backend is online"}



@app.post("/photos/")
async def add_photo(
    title: str = Form(),
    description: str = Form(),
    latitude: float = Form(),
    longitude: float = Form(),
    file: UploadFile = File()
):
    BASE_DIR = os.path.dirname(os.path.abspath(__file__)) 
    upload_folder = os.path.join(BASE_DIR, "uploaded_photos")
    file_path = os.path.join(upload_folder, file.filename)
    
    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)
    
    new_id = len(photos_db) + 1
    new_photo = Photo(title=title, description=description, latitude=latitude, longitude=longitude, id=new_id, image_filename=file.filename)
    photos_db.append(new_photo)
    return {"message": "Photo info received!", "photo": new_photo}

@app.get('/photos/', response_model=List[Photo])
async def list_photos():
    return photos_db

