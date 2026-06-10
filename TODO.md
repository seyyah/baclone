# 📋 Baclone Roadmap & Backlog (TODO.md)

This document tracks the features, enhancements, and tasks for Baclone, divided into immediate target milestones and long-term roadmap objectives.

---

## 🎯 Part 1: Deadline Features (Immediate Milestone)

These features are targeted for completion within the current development cycle and have immediate priority.

### 💾 1. Local Storage History Manager
- [ ] Implement a local history side panel or dropdown to browse previous analyses.
- [ ] Save the complete analysis JSON payload, video filename, and analysis timestamp to `localStorage` or `IndexedDB`.
- [ ] Allow deleting history entries individually or clearing the entire archive.
- [ ] Add the ability to quickly reload any past analysis blueprint back into the main dashboard view.

### ⚙️ 2. Custom Tech Stack Generator
- [ ] Add a stack selector UI (e.g. Node/Express, Python/FastAPI, Go/Gin, Rust/Actix, Java/Spring Boot).
- [ ] Dynamically inject the selected stack, database type (e.g., PostgreSQL, MongoDB, MySQL, Prisma ORM), and authentication model into the exported AI-agent ready prompt.
- [ ] Update components in `ResultPanel.jsx` to reflect the chosen stack configuration.

### 🎨 3. Interactive Mermaid Diagram Controls
- [ ] Integrate a zoom, pan, and fullscreen toggle for the Mermaid UML class and sequence diagram canvas.
- [ ] Add a live raw editor panel for the Mermaid code, letting users tweak relationships, types, or methods inline and see changes live.
- [ ] Provide one-click buttons to download diagrams as `.svg` or `.png` images.

### 🛠️ 4. Improved Truncation Robustness (JSON Repair)
- [ ] Write unit tests for `repairJSON` function in `gemini.js` with edge-case truncated strings.
- [ ] Enhance the JSON repair regex/parsing state machine to fix half-written key-value pairs (e.g., `{"key": "val`) and unclosed nested arrays.
- [ ] Provide a warning badge in the UI if the JSON parser repaired a heavily truncated result, indicating some entities may be partial.

### 📑 5. Instant Blueprint Export Options
- [ ] Add an "Export PDF" button to print a clean, formatted report of the entire backend system architecture (Timeline, Schema, Endpoints, Diagrams, and Prompts).
- [ ] Support downloading raw JSON blueprints directly as a `.json` file.

---

## 🚀 Part 2: Future Roadmap (For the Next Developer)

These tasks are designed for full completion in future iterations. They are documented here to serve as onboarding tasks and expansion points for the next developer inheriting the codebase.

### 🎤 1. Audio Transcript Semantic Analysis
- [ ] Extract audio tracks from uploaded videos in the frontend (or utilizing a lightweight cloud function).
- [ ] Pass the audio track to Google Gemini's multimodal encoder (or Whisper) to generate a transcription.
- [ ] Append the transcription to the system prompt so Gemini can capture developer spoken commentary about logic, permissions, and database constraints.

### 🏗️ 2. Automated Boilerplate Code Scaffolder
- [ ] Create a client-side code generation service that parses the backend analysis JSON.
- [ ] Generate a downloadable `.zip` file containing a ready-to-run boilerplate backend repository (e.g. including router folders, database model files, config directories, and a `package.json`).
- [ ] Implement scaffolders for multiple frameworks based on the selection in the tech stack options.

### 🌐 3. Collaborative Workspaces & Cloud Archiving
- [ ] Add a backend storage adapter (e.g. Supabase, Firebase) to host uploaded video recordings.
- [ ] Implement user authentication (Sign up/Login) to protect and share architecture blueprints.
- [ ] Create collaborative project boards where multiple architects can add notes, approve features, and export blueprints collectively.

### 🔗 4. Interactive Entity Relationship Diagram (ERD) Editor
- [ ] Replace static class diagram representations with a fully interactive canvas (using React Flow or d3-force).
- [ ] Allow users to drag entities, drag connection lines to create foreign keys (one-to-many, many-to-many), and edit field names by double-clicking nodes.
- [ ] Sync the visual changes back to the JSON payload and update the generated endpoints and agent prompts accordingly.

### 💻 5. Baclone CLI (Command Line Interface)
- [ ] Develop a command-line tool (`baclone-cli`) that accepts a video file path and returns structured diagrams/JSON in the shell.
- [ ] Enable CLI output redirection to pipe directly into AI developer agents or project setup directories (`baclone-cli recording.mp4 > backend-design.json`).
