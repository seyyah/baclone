# 🤖 Coding Agent Onboarding Guide (AGENT.md)

Welcome, AI Coding Agent! This guide is designed to help you quickly onboard, understand the internal mechanics, and follow the strict engineering rules for maintaining or extending the **Baclone** repository.

---

## 🎯 System Mission & Value Proposition

Baclone's goal is to convert visual application recordings into high-fidelity backend architectures. 

It does this by executing a structured multi-stage pipeline:
1.  **Ingest**: Accept video recording formats (`.mp4`, `.mov`).
2.  **Upload & Process**: Use the Gemini Files API to handle high-resolution video assets.
3.  **Generate Structured Analysis**: Prompt the Gemini model to output a specific JSON payload detailing screens, modules, endpoints, database schemas, and Mermaid UML diagrams.
4.  **Auto-Repair & Normalize**: Recover slightly truncated or malformed responses.
5.  **Visualize**: Render diagrams and tabbed data boards interactively in a premium dark-mode interface.

---

## 🗂️ Core Mappings & Component Responsibilities

Here is where the primary logic is situated. Refer to these files when debugging or implementing features:

| File / Component Path | Primary Responsibility |
| :--- | :--- |
| [`appvision/src/services/gemini.js`](file:///c:/Users/Admin/baclone/appvision/src/services/gemini.js) | Manages Files API uploads, active state polling, fallback model chains, prompt structures, and the JSON auto-repair function. |
| [`appvision/src/services/api.js`](file:///c:/Users/Admin/baclone/appvision/src/services/api.js) | Acts as the traffic controller. Redirects API calls to the real Gemini service if `VITE_GEMINI_API_KEY` is present; otherwise, triggers offline Mock Mode. |
| [`appvision/src/pages/Home.jsx`](file:///c:/Users/Admin/baclone/appvision/src/pages/Home.jsx) | Handles the main global state of the application flow: `VIEW.UPLOAD` ➜ `VIEW.ANALYZING` ➜ `VIEW.RESULT`. |
| [`appvision/src/components/ResultPanel.jsx`](file:///c:/Users/Admin/baclone/appvision/src/components/ResultPanel.jsx) | Renders the tabs, schemas, endpoints, and CLI prompts. Manages code-copy events and exports. |
| [`appvision/src/components/MermaidDiagram.jsx`](file:///c:/Users/Admin/baclone/appvision/src/components/MermaidDiagram.jsx) | Integrates the `mermaid` npm package, dynamically rendering class and sequence diagrams from string inputs. Handles syntax errors gracefully. |
| [`appvision/src/components/VideoUploader.jsx`](file:///c:/Users/Admin/baclone/appvision/src/components/VideoUploader.jsx) | Orchestrates the drag-and-drop interface, local file preview caching, and drag-over animations. |
| [`appvision/src/components/AnalysisSteps.jsx`](file:///c:/Users/Admin/baclone/appvision/src/components/AnalysisSteps.jsx) | Feeds progress percentage updates (0-100) and displays human-readable micro-actions (e.g., "Uploading to Gemini", "Transcoding...", "Synthesizing Endpoints"). |

---

## ⚠️ Critical Technical Specs & Logic Flow

### 1. Active Gemini Model Chain
The primary stable model is **`gemini-3.5-flash`**. If Google servers return rate-limiting (`429`) or server overload (`503`), the system falls back through the chain defined in `gemini.js`:
```javascript
const MODEL_CHAIN = [
  'gemini-3.5-flash',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-001',
];
```
*   **Rule**: Do not remove the fallback chain or modify the default model order unless requested.

### 2. Resumable File Upload & Polling
*   Video uploads utilize the resumable upload protocol using standard HTTP `POST` requests directly to `https://generativelanguage.googleapis.com/upload/v1beta/files`.
*   Uploaded videos require processing/transcoding on Google's servers before they can be used for content generation.
*   The polling loop in `waitForFileActive` executes up to **90 times with a 2-second delay (3 minutes maximum timeout)**. Do not reduce these limits, as large/high-resolution files can take several minutes to process.
*   Once processing completes, the file's state changes to `ACTIVE`.

### 3. Truncated JSON Recovery (`repairJSON`)
Due to the complexity and length of the architectural output, the model response may occasionally exceed output token limits and truncate. To prevent application crashes:
*   The system uses the `repairJSON(text)` function in `gemini.js` to strip any markdown code blocks, count unmatched curly braces `{` and brackets `[`, ignore quoted characters, and append matching close-tags.
*   **Rule**: If you modify the prompt or schema, ensure you maintain backwards-compatibility with this repair algorithm and do not introduce new nested structures without verifying that they can be repaired safely.

### 4. Structured Prompting Constraints
The `SYSTEM_PROMPT` in `gemini.js` forces the model to return a single, valid JSON object matching a strict schema.
*   **Rule**: The response must never contain markdown fences (like ` ```json `) or conversational prefixes/suffixes. 
*   **Rule**: If you add new output properties, document them clearly in the `SYSTEM_PROMPT` schema and provide default value normalization inside `parseGeminiResponse(text)`.

---

## 🎨 Styling & Design Guidelines

Baclone utilizes a premium, high-fidelity dark-mode interface built on **Tailwind CSS v4**.

*   **Vite Integration**: Tailwind v4 is integrated via the `@tailwindcss/vite` plugin. There is no `tailwind.config.js` file. Custom utility configurations, variables, and global overrides are defined directly in [`appvision/src/index.css`](file:///c:/Users/Admin/baclone/appvision/src/index.css) using CSS `@theme` and `@utility` rules.
*   **Glassmorphism**: Visual elements utilize backing panels with opacity-controlled backgrounds (`bg-slate-900/60`), backdrop filters (`backdrop-blur-xl`), and borders (`border-white/10`).
*   **Color Palette**: Stick to the HSL-tailored slate and gray colors combined with dynamic accents (`violet-500`, `cyan-400`, `emerald-400`). Do not write generic primaries (plain red/blue).
*   **Animations**: Micro-interactions and transition stages must use GSAP or Framer Motion to keep the interface feeling responsive and fluid.

---

## 🛠️ Developer Lifecycle Commands

To work with this repository, always navigate into the `appvision` directory first:

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Start development server**:
    ```bash
    npm run dev
    ```
3.  **Build production package**:
    ```bash
    npm run build
    ```
4.  **Run ES Lint checker**:
    ```bash
    npm run lint
    ```

---

## 🛡️ Rules of Engagement for AI Agents

1.  **Never delete comments/docstrings**: Retain existing inline documentation, explainers, and logic notes unless they are explicitly refactored.
2.  **Strict Error Handling**: Always wrap API transactions in try-catch-finally statements, ensuring that resources are cleaned up (e.g., using `deleteFile` on Gemini Servers) and user interfaces are not stuck on loading indicators.
3.  **No Mock Degradation**: Ensure that mock data is kept up to date. If you add a feature, ensure that `mockAnalysis.js` is also updated to mirror the structural JSON adjustments, allowing developers without an API key to test the feature offline.
4.  **React 19 Rules**: Avoid legacy React patterns. Utilize clean hooks and proper state propagation.
