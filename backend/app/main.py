from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client
import uuid
import os

from dotenv import load_dotenv

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()  

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")


supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


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


@app.get('/photos/')
async def get_photos():
    response = supabase.table("photos").select("*").execute()
    return response.data

