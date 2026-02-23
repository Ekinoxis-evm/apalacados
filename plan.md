This is the **Final Development Blueprint**. It is structured as a "Master Brief" that you can copy and paste directly into an AI developer agent (like Cursor, Replit Agent, or GPT-4o) to build the site from scratch.

---

# 🚀 Project Brief: El Futuro de las Finanzas

**Concept:** A high-performance, real-time financial dashboard for Live Trading, DeFi, AI, and Web3 Culture.
**Core Stack:** Next.js (React), Tailwind CSS, Lucide Icons.
**Primary User:** `wmb81321` (Kick)

---

## 1. Navigation Architecture (The Header)

**Style:** Sticky, Glassmorphism (blur background), Dark Mode.

* **Logo:** "El Futuro de las Finanzas" (Neon Green/White).
* **Menu Item 1: Topics (Dropdown)**
* Trading & Perps
* Prediction Markets
* DeFi
* Memes & NFTs
* Artificial Intelligence


* **Menu Item 2: Live Hub** (Direct link to the Kick stream + Market Pulse).
* **Menu Item 3: Events & Vault** (Luma Calendar + Recording Archive).

---

## 2. Page 1: The "Live Hub" (Landing Page)

This is the "Command Center." It must feel alive and real-time.

* **Top Section (The Stream):**
* Embed Kick Player for user `wmb81321`.
* *Agent Instruction:* Use `https://player.kick.com/wmb81321`.


* **Middle Section (Market Pulse):**
* Embed the **CoinGecko Heatmap Widget**.
* *Settings:* `top="100"`, `dark-mode="true"`, `outlined="true"`.


* **Bottom Section (The 5 Pillars):**
* A "Bento Grid" layout where each box represents a Topic (Trading, DeFi, etc.) with a "Learn More" button.



---

## 3. Page 2: Events & Vault (The Schedule)

This page manages the "Future" and the "Past."

* **Header:** "Próximos Espacios en Vivo" (Upcoming Live Spaces).
* **Upcoming Section:** * Embed the **Luma Calendar Widget**. This handles RSVPs and Google Calendar syncing.
* **Recording Vault (The Archive):**
* A grid of cards titled "Grabaciones Anteriores."
* **Logic for Agent:** * **YouTube Cards:** Use iframe embeds for video playback.
* **X Spaces Cards:** Use the Twitter Widgets JS (`platform.twitter.com/widgets.js`) to embed the recorded Space post.


* *Card Metadata:* Title, Date, Platform Icon (YouTube/X/Kick), Short Description.



---

## 4. Technical Design Specifications (For the Agent)

* **Color Palette:**
* Background: `#050505` (True Black)
* Primary Accent: `#00ff41` (Matrix/Cyber Green)
* Secondary Accent: `#bc13fe` (Neon Purple for Memes/AI)
* Border: `#1A1A1A` (Subtle dark grey)


* **Typography:** Modern Sans-Serif (Inter or Geist).
* **Responsiveness:** * Mobile: Stack the stream on top of the chat.
* Desktop: 70/30 split for Stream/Chat.



---

## 5. Metadata & Compliance

* **Footer:** Must include a high-visibility disclaimer:
> *"Contenido educativo únicamente. Esto no es asesoría financiera (NFA). Operar con Futuros, Cripto y DeFi conlleva un alto riesgo."*



---

### **How to initiate the build:**

Paste this to your agent:

> "I want to build a React-based web application called 'El Futuro de las Finanzas'. I have a structured blueprint ready. Please start by setting up the **Navbar** and the **Live Hub** page using Tailwind CSS, including the Kick player for `wmb81321` and the CoinGecko Heatmap. Here is the full plan: [PASTE THE TEXT ABOVE]"

**Would you like me to write the actual React code for the Navbar right now so you can see the 6 sections in action?**