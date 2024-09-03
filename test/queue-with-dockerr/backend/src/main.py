import sys
import os
import string
import uvicorn
sys.path.append(os.path.join(sys.path[0], '../'))
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes.interface.router import router as interface_router
from src.routes.setting.router import router as setting_router
from src.routes.ticket.router import router as ticket_router
from src.routes.category.router import router as category_router
from src.routes.websocket.router import router as websocket_router
from src.routes.auth.router import router as auth_router



app = FastAPI(
    title="Queue APP"
)

origins = [
    # "https://queue-front-git-main-nurbergenoovvs-projects.vercel.app",
    # "https://myapi.kz",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(websocket_router)
app.include_router(category_router)
app.include_router(ticket_router)
app.include_router(interface_router)
app.include_router(setting_router)

if __name__ == "__main__":
    uvicorn.run('main:app', host="0.0.0.0", port=8000, reload=True, workers=3)
