import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from api.routes import khet_optima
from core.config import settings

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="KhetOptima - Simulate. Optimize. Grow for Profit.",
    description="AI-powered farm decision and crop portfolio optimization platform for Indian farmers",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

app.include_router(khet_optima.router, prefix="/api/v1", tags=["khet-optima"])


@app.get("/")
async def root():
    return {
        "message": "KhetOptima API - Simulate. Optimize. Grow for Profit.",
        "version": "2.0.0",
        "docs": "/docs",
        "khet_optima": "/api/v1/khet-optima/optimize",
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "2.0.0",
        "environment": settings.environment,
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.environment == "development",
    )
