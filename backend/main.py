from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from uuid import uuid4

app = FastAPI()

origins = ["http://localhost:3000"]  # Adjust based on frontend

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Task(BaseModel):
    id: str
    title: str
    completed: bool = False
    priority: str  # "Low", "Medium", "High"
    tags: List[str] = []

class TaskCreate(BaseModel):
    title: str
    priority: str
    tags: List[str] = []

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[str] = None
    tags: Optional[List[str]] = None

tasks_db: List[Task] = []

@app.get("/tasks", response_model=List[Task])
def get_tasks():
    return tasks_db

@app.post("/tasks", response_model=Task)
def create_task(task: TaskCreate):
    new_task = Task(id=str(uuid4()), **task.dict())
    tasks_db.append(new_task)
    return new_task

@app.patch("/tasks/{task_id}", response_model=Task)
def update_task(task_id: str, task_update: TaskUpdate):
    for task in tasks_db:
        if task.id == task_id:
            update_data = task_update.dict(exclude_unset=True)
            for key, value in update_data.items():
                setattr(task, key, value)
            return task
    raise HTTPException(status_code=404, detail="Task not found")

@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    global tasks_db
    tasks_db = [task for task in tasks_db if task.id != task_id]
    return {"message": "Task deleted"}
