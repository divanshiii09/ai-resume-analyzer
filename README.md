# ResumeAI: AI-powered resume analyzer

ResumeAI checks a resume the way an Applicant Tracking System (ATS) would. You upload a PDF resume and get an ATS score, a skills and formatting breakdown, and concrete suggestions. You can also paste any job description to see how well your resume matches that specific role.

**Live demo:** https://ai-ats-resume-analyzer-sigma.vercel.app

## Features

- **Accounts:** register and log in. Passwords are hashed with bcrypt, and sessions use JWT tokens.
- **Resume upload:** upload a PDF (up to 4 MB). The text is extracted on the server.
- **ATS analysis:** Google Gemini scores the resume and returns:
  - an overall ATS score with skills match, formatting and keyword sub-scores
  - a recruiter-style summary
  - strengths, weaknesses and recommended improvements
  - detected skills, missing skills and suitable roles
- **Job description match:** paste a job description to get:
  - an overall match percentage and a recommendation
  - matched skills and skills to improve
  - experience and education fit
  - keyword match and targeted suggestions
- **Dashboard:** see all your uploaded resumes, switch between them, and delete old ones.
- **Privacy:** each user can only see and change their own resumes.
- **Error handling:** if the AI call fails, the page shows an error with a retry button instead of a misleading result.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router, Axios, Framer Motion |
| Backend | Node.js, Express 5 |
| Database | MongoDB Atlas with Mongoose |
| AI | Google Gemini (`gemini-2.5-flash`) via `@google/generative-ai` |
| Auth | bcryptjs, JSON Web Tokens |
| File handling | Multer (in-memory), unpdf |
| Hosting | Vercel (static frontend and a serverless API function) |
| Testing | Node's built-in test runner (`node --test`) |

## How it works

```
PDF upload ──► Express API ──► unpdf extracts text   
                                   │
                                   ▼
                     Gemini analyzes the text and returns JSON
                                   │
                                   ▼
               JSON is parsed and cleaned ──► saved in MongoDB
                                   │
                                   ▼
                  React shows the score, charts and suggestions
```

1. The user logs in and receives a JWT, which is sent with every API request.
2. The uploaded PDF is kept in memory (never written to disk), and its text is extracted with unpdf.
3. The text is sent to Gemini with a strict prompt that asks for JSON only.
4. The reply is parsed by taking everything from the first `{` to the last `}`. This copes with code fences or extra text around the JSON. Markdown such as `**bold**` is then stripped from each string.
5. The result and the PDF are stored in MongoDB, linked to the user's email.
6. For a job match, the saved resume text and the pasted job description go to Gemini together, and the comparison comes back the same way.

## Project structure

```
AI-Resume-Analyzer/
├── api/index.js              # Vercel serverless entry; forwards /api/* to Express
├── backend/
│   ├── app.js                # Express app and all API routes
│   ├── server.js             # Local dev server (port 3000)
│   ├── config/db.js          # Cached MongoDB connection
│   ├── middleware/
│   │   ├── auth.js           # JWT check and same-user helper
│   │   └── upload.js         # Multer setup: PDF only, 4 MB limit
│   ├── models/               # Mongoose models: User, Resume
│   ├── services/
│   │   ├── gemini.js         # Resume ATS analysis
│   │   ├── jobMatch.js       # Resume vs job description match
│   │   └── parseModelJson.js # Robust JSON parsing of AI replies
│   └── test/                 # Backend unit tests
├── frontend/
│   └── src/
│       ├── pages/            # Login, Register, Dashboard, UploadResume, Analysis
│       ├── components/       # Navbar, ProtectedRoute
│       ├── api/client.js     # Axios client that attaches the JWT
│       └── styles/           # Page stylesheets
├── vercel.json               # Build output and API rewrites
└── .env.example              # Environment variables template
```

## API endpoints

All routes except register, login and the health check need an `Authorization: Bearer <token>` header.

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/test` | Health check, including database status |
| POST | `/api/register` | Create an account |
| POST | `/api/login` | Log in and receive a JWT |
| POST | `/api/resume` | Upload a PDF and run the ATS analysis |
| POST | `/api/analyze-job` | Match a saved resume against a job description |
| GET | `/api/resumes/:email` | List the user's resumes |
| GET | `/api/resume/latest/:email` | Get the user's most recent resume |
| GET | `/api/resume/:id` | Get one resume's analysis |
| GET | `/api/resume/:id/file` | Download the original PDF |
| DELETE | `/api/resume/:id` | Delete a resume |

## Running it locally

**Requirements:** Node.js 24 or newer, a MongoDB Atlas database, and a Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey).

1. Install dependencies from the project root:

   ```bash
   npm install
   ```

2. Copy the environment template and fill in your values:

   ```bash
   cp .env.example backend/.env
   ```

   | Variable | Description |
   |---|---|
   | `MONGO_URI` | MongoDB Atlas connection string |
   | `GEMINI_API_KEY` | Google AI Studio API key |
   | `JWT_SECRET` | Random secret for signing tokens (`openssl rand -base64 32`) |
   | `PORT` | Local API port, default `3000` |
   | `GEMINI_TIMEOUT_MS` | Optional AI timeout in ms, default `45000` |

3. Start the API and the frontend in two terminals:

   ```bash
   npm run dev:api
   ```

   ```bash
   npm run dev:web
   ```

4. Open http://localhost:5173. Vite forwards `/api` requests to the API on port 3000.

## Tests

```bash
npm test
```

The backend tests cover:
- parsing and cleaning of AI replies (code fences, extra text, truncated JSON, markdown)
- JWT authentication (missing, invalid, expired and valid tokens)
- the job match service's error handling (it reports a failure instead of returning a fake 0% result)

Gemini is replaced with a fake in the tests, so they need no API key or network access.

## Deploying to Vercel

The repository is set up to deploy as one Vercel project:
- `vercel.json` builds the frontend into `frontend/dist`.
- `/api/*` requests are routed to the Express app through `api/index.js`.

1. Import the GitHub repository in Vercel.
2. Add `MONGO_URI`, `GEMINI_API_KEY` and `JWT_SECRET` under Project Settings → Environment Variables.
3. In MongoDB Atlas → Network Access, allow `0.0.0.0/0`, because Vercel's servers use changing IP addresses.
4. Deploy, then open `/api/test` on your deployment to check that the database is connected.

## Future improvements

- Export the analysis as a PDF report
- Support DOCX resumes
- Track score history across versions of the same resume
- Rewrite suggestions for individual resume bullet points

## Author

Divanshi Goyal
