# Render Deployment — KhetOptima

Blueprint creates:
- `khetoptima-backend`: FastAPI (stateless optimizer)
- `khetoptima-frontend`: React static site

## Deploy with Blueprint
1. Push to `DiyaPanjwani09/KhetOptima-SIH`.
2. Render → **New > Blueprint** → connect repo → Apply `render.yaml`.
3. Frontend `REACT_APP_API_URL` auto-wired to backend URL; backend `ALLOWED_ORIGINS` to frontend.

## After deploy
1. Check backend `/health`.
2. Open frontend and test Planner with 10ac, loamy, 500mm, ₹1.45L, Rabi.

## Notes
- No DB required — optimizer is stateless (scipy linprog + greedy fallback).
- Free instances sleep when idle; first request may be slow.
- Add `DATABASE_URL` and PostGIS later if you persist farm profiles.
