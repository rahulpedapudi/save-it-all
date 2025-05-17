- UI

  - Posts/Links
    - Fetch from `api/links` (formatted JSON: id, title, url)
    - Show AI Summarize button on each card
    - Edit & Delete buttons for CRUD
    - Add Tags UI (dropdown / input chips)
      - e.g. 'Read Later', 'AI', 'Tech'
    - Search/filter bar
    - Sort by date
    - Optional: Show preview (title + description from site metadata)
  - Create Page
    - Form to add new post with title, URL, and optional tags

- API

  - GET /api/links – fetch all links (support filter, search, sort)
  - POST /api/links – create new
  - GET /api/links?tag=
  - PUT /api/links/<id> – update title, url, tags
  - DELETE /api/links/<id> – delete link
  - POST /api/summarise/<id> – summarize link via Gemini
  - (Optional) GET /api/preview/<id> – fetch site metadata for preview

- DB
  - Schema fields: id, title, url, tags[], summary?, created_at
