# AI-First CRM HCP Module - Overview

## Introduction

The AI-First CRM HCP (Healthcare Professional) Module is an intelligent customer relationship management system specifically designed for medical representatives and pharmaceutical professionals. It leverages state-of-the-art Generative AI to streamline the process of logging, summarizing, and tracking interactions with Healthcare Professionals.

Instead of manually filling out tedious forms, representatives can simply converse with an integrated AI agent. The AI extracts key information in real-time, categorizes the interaction, and automatically structures the data into the CRM database.

## Key Features

* **AI-Assisted Logging**: A conversational interface powered by Groq's LLaMA models allows users to log meeting details through natural language.
* **Auto-Extraction**: The system automatically extracts structured data (e.g., Interaction Type, Date, Attendees, Topics Discussed, Samples Distributed, Sentiments) from the conversation.
* **Drafting & Auto-save**: Interactions start as auto-saved drafts and can be reviewed/edited before finalizing.
* **HCP History Tracking**: Comprehensive timeline views of all past interactions for a specific HCP.
* **Responsive UI**: A modern, aesthetically pleasing frontend built with React and Tailwind CSS.

## Technology Stack

The project is built on a modern, decoupled architecture featuring a Python backend and a React frontend.

### Backend

* **Framework**: FastAPI (Python 3.13)
* **Database**: PostgreSQL (Managed via Neon)
* **ORM & Migrations**: SQLAlchemy (Async) & Alembic
* **AI Provider**: Groq API (LLaMA 3.3 70B Versatile)
* **Caching/State**: Redis (Upstash / Local)
* **Server**: Uvicorn

### Frontend

* **Framework**: React 18 (Vite)
* **Routing**: React Router DOM
* **State Management**: Redux Toolkit (RTK)
* **Styling**: Tailwind CSS & Lucide React Icons
* **HTTP Client**: Axios
* **Form Handling**: React Hook Form with Valibot validation

### Deployment

* **Backend Hosting**: Google Cloud Run (Dockerized container)
* **Frontend Hosting**: Cloudflare Pages
* **Database Hosting**: Neon Serverless Postgres
