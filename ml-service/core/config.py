import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "KhetOptima - Simulate. Optimize. Grow for Profit."
    environment: str = "development"
    host: str = "0.0.0.0"
    port: int = int(os.getenv("PORT", "8000"))

    allowed_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    class Config:
        env_file = ".env"
        extra = "allow"

    @property
    def cors_origin_list(self) -> list:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]


settings = Settings()
