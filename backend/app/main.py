from fastapi import FastAPI, File, UploadFile, Form
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List
from supabase import create_client
import uuid
import os

app = FastAPI()

#app.mount("/uploaded_photos", StaticFiles(directory="app/uploaded_photos"), name="uploaded_photos")

SUPABASE_URL = "https://itshkkqzqobiorqakeyk.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0c2hra3F6cW9iaW9ycWFrZXlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDkyMDE0OCwiZXhwIjoyMDcwNDk2MTQ4fQ.449KwAysQCJUVSL3iq_5ec35SOsiJFLk6AaKlyxC_tQ"
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


class Photo(BaseModel):
    title: str
    description: str
    latitude: float
    longitude: float
    id: int
    image_filename: str
    url: str

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
    file_bytes = await file.read()
    file_ext = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_ext}"
    upload_response = supabase.storage.from_("photos").upload(unique_filename, file_bytes)
    public_url = supabase.storage.from_("photos").get_public_url(unique_filename)

    insert_response = supabase.table("photos").insert({
        "title": title,
        "description": description,
        "latitude": latitude,
        "longitude": longitude,
        "image_url": public_url
    }).execute()

    
    return {"message": "Photo uploaded successfully!", "photo": insert_response.data[0]}


@app.get('/photos/', response_model=List[Photo])
async def get_photos():
    return photos_db

