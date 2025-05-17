# 📝 To-Do List with Priority & Tags

This is a full-stack To-Do List app built with:

- 🚀 **Frontend**: Next.js (App Router) + Tailwind CSS + TypeScript
- ⚙️ **Backend**: FastAPI (Python)

Users can:
- Add/edit/delete tasks
- Assign priorities (Low, Medium, High)
- Add multiple tags
- Filter tasks by priority and tags

---

## 📂 Project Structure

root/
├── backend/ # FastAPI backend
│ ├── main.py # API routes
│ └── requirements.txt
├── frontend/todo-priority-app # Next.js frontend
│ ├── app/ # App directory-based routing
│ ├── public/
│ ├── styles/
│ ├── tailwind.config.ts
│ ├── tsconfig.json
│ └── package.json
├── README.md

yaml
Copy
Edit

## 🖥️ Frontend Setup (Next.js)

```bash
cd frontend/todo-priority-app
npm install
npm run dev
Runs the app on: http://localhost:3000

🔧 Make sure to update the baseURL in frontend/app/page.tsx to point to your backend:
tsx
Copy
Edit
const baseURL = "http://localhost:8000/tasks";
🛠 Backend Setup (FastAPI)
bash
Copy
Edit
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
Runs the backend on: http://localhost:8000

API Endpoints:

GET /tasks

POST /tasks

PATCH /tasks/{id}

DELETE /tasks/{id}
