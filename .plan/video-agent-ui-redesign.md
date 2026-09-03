# Video Agent UI Redesign Plan

## Goal
Completely redesign the Streamlit UI in `app.py` to create a modern, visually stunning interface while keeping all backend logic (`core/`, `utils/`) and pipeline orchestration untouched.

## Approach
- Rename current `app.py` → `app_original.py` (backup)
- Create new `app.py` with redesigned UI
- Same imports, same pipeline calls, same session state — only CSS + layout changes

## Key Design Changes

### 1. Color Palette & Typography
- **New palette**: Deep navy/slate base (`#0f172a`, `#1e293b`) with electric blue (`#3b82f6`) and amber (`#f59e0b`) accents
- **Fonts**: Inter (headings) + Fira Code (mono/code) — cleaner, more modern
- **Gradient hero title**: Blue-to-purple-to-pink gradient

### 2. Landing Page (Empty State)
- Full-height centered hero with animated particle/orb background effect (CSS-only)
- Large animated gradient icon
- Floating feature cards with glassmorphism effect
- Staggered fade-in animations on load

### 3. Sidebar Redesign
- Glassmorphism sidebar with subtle blur backdrop
- Cleaner input styling with floating labels
- Animated "Analyse" button with loading spinner state
- Pipeline progress as a vertical stepper with animated transitions

### 4. Results Layout
- **Title banner**: Full-width gradient card with glow effect
- **Summary**: Large card with left accent bar, better typography
- **Transcript**: Custom-styled scrollable container with line numbers feel
- **3-column grid**: Action Items / Decisions / Questions — each with icon headers, hover lift effect, colored top borders
- **RAG Chat**: Completely rebuilt chat UI with message bubbles, typing indicator, smooth scroll

### 5. Animations & Polish
- CSS keyframe animations for card entrances (fade-up)
- Hover effects on all interactive elements
- Smooth transitions on state changes
- Pulsing glow on active pipeline steps
- Custom styled scrollbars throughout

### 6. Responsiveness
- Better column ratios for different screen sizes
- Cards that stack on mobile
- Proper padding/margins at all breakpoints

## Files Modified
| File | Action |
|------|--------|
| `app.py` | Renamed to `app_original.py` |
| `app.py` | Created with new UI (same backend calls) |

## Backend (NO CHANGES)
- `core/transcriber.py` — untouched
- `core/summarize.py` — untouched
- `core/extractor.py` — untouched
- `core/rag_engine.py` — untouched
- `core/vector_store.py` — untouched
- `utils/audio_processor.py` — untouched
- `main.py` — untouched

## Verification
- Run `streamlit run app.py` and verify:
  1. Landing page renders with animations
  2. Sidebar inputs work (URL + language)
  3. Pipeline runs and shows step progress
  4. Results display correctly (title, summary, transcript, 3 extraction cards)
  5. RAG chat works (send message, get response, clear chat)
  6. No backend errors — all pipeline functions called correctly
