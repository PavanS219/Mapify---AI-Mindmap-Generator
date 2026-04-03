# 🧠 Mapify — AI Mind Map Generator

> *Turn any idea into an infinite, interactive mind map — powered by MiniMax AI.*

<img width="1919" height="1079" alt="Screenshot 2026-04-04 041545" src="https://github.com/user-attachments/assets/4ad5127e-9b2c-4ce2-abdd-6ce32790c34c" />


---

## ✨ What is Mapify?

Mapify is a **real-time AI mind map generator** built with React + ReactFlow. Type any topic, hit **Branch**, and watch your idea expand into a beautiful, color-coded knowledge graph — instantly.

Click any node to **go deeper** with AI. No limits. No manual dragging. Just pure thinking.

---

## 🚀 Features

| Feature | Description |
|---|---|
| ⚡ **Instant Generation** | Full mind map from a single topic in seconds |
| 🎨 **Color-coded Branches** | 8 unique colors — each branch visually distinct |
| 🤖 **Click-to-Expand** | Tap any node to have AI generate deeper subtopics |
| 📤 **Export as PNG** | Save your mind map as a high-resolution image |
| 🗂️ **Session History** | Quick-access to your recent brainstorms |
| 🌐 **Minimap Navigation** | Bird's-eye view of large, complex maps |

---

## 🛠️ Tech Stack

- **React** + **TypeScript** — UI framework
- **ReactFlow** — interactive node-graph canvas
- **MiniMax API** (`abab6.5-chat`) — AI mind map generation
- **Tailwind CSS** — utility-first styling
- **html-to-image** — PNG export

---

## ⚙️ Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/your-username/mapify.git
cd mapify
npm install
```

### 2. Set Up Your API Key

Create a `.env` file in the root:

```env
VITE_MINIMAX_API_KEY=your_minimax_api_key_here
```


### 3. Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and start brainstorming.

---

## 🎮 How to Use

```
1. Type a topic in the input bar → click "Branch"
2. Your mind map generates instantly
3. Click any node → AI expands it with deeper insights
4. Export as PNG to share or save
```

---

## 🔑 Getting MiniMax API Access

1. Sign up at [minimax.chat](https://minimax.chat)
2. Go to **API Keys** in your dashboard
3. Copy your key → paste into `.env`

**For TRAE IDE users in India** — if payments aren't working, fill out the form above for free credits. Credits are added by the MiniMax team (may take a short while — check your **Balance** section).

---

## 📁 Project Structure

```
src/
├── App.tsx              # Main app, ReactFlow canvas, UI
├── lib/
│   └── minimax.ts       # MiniMax API calls & prompt logic
└── components/          # Reusable UI components
```

---

## 🧩 API Design

The AI layer has two core functions:

- **`generateMindMap(topic)`** — creates a full structured tree from a topic string
- **`expandNode(label)`** — takes a single node label and returns 4–5 deep subtopics

Both return a typed `MindMapNode` tree and gracefully fall back to offline defaults if the API is unavailable.

---

## 🤝 Contributing

Pull requests welcome. For major changes, open an issue first to discuss what you'd like to change.

---

## 📄 License

MIT © 2025 Mapify

---

<p align="center">Built with ❤️ using React, ReactFlow & MiniMax AI</p>
