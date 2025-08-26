# Narai (NARA.I) – A Personalized Multimodal AI Therapy App

A React + Express-driven interactive therapy application combining **real-time emotion-aware voice therapy**, **text-based AI therapy**, and **age- and language-adaptive personalization**

## 🚀 Overview

NARA.I provides two core therapy experiences:

1. **Emotion‑Aware Voice Therapy** – Real-time analysis of facial expressions, vocal tone, and speech-to-text to enable emotionally aware AI responses.
2. **Text-Based AI Therapy** – Chat interactions using Flash 2.0 Gemini API for traditional conversational therapy.

Both modes adapt based on **user age group** and **preferred language**, offering a highly personalized therapeutic experience.

## 🧭 Architecture & Pages

### 1. Home / Landing Page
- Description of the app, its goals, and how it helps across age groups and languages
- Clear navigation to:
  - **Emotion‑Aware Therapy**
  - **Text‑Based Therapy**
- Mobile-first and desktop-responsive layout

### 2. Emotion‑Aware Therapy Page
- Real-time **face emotion detection** (using Face API or `face-api.js`)
- **Vocal‑tone emotion analysis** and **speech-to-text**
- Chat interaction through **Flash 2.0 Gemini API**, with voice output via open-source or high-quality TTS
- **Age selector** (child/teen/adult) to tailor tone, vocabulary, and therapy style
- **Language support** switching as needed

### 3. Text Therapy Page
- Classic **chatbot conversation interface** powered by Gemini API
- **Age category selection** (same logic as voice therapy), influencing response style
- Multilingual support enabled

---

## 🛠 Technology Stack

- **Frontend**: React (within `client/`), Tailwind CSS (via `tailwind.config.ts`), Shadcn UI components
- **Backend**: Express server handling API requests, internal routing & middleware
- **Emotion Detection**: Face API or `face‑api.js`, optionally TensorFlow.js
- **Voice Processing**: Web Speech API or third-party voice‑tone/emotion API
- **AI Core**: Flash 2.0 Gemini API—handles conversational logic (both voice & text)
- **Text‑to‑Speech**: High‑quality open-source or Google Cloud / equivalent for natural voice output
- **Routing**: Wouter for client-side navigation
- **UI/Animations**: Framer Motion for transitions and interactive responses

---

## 🎛️ Configuring API Keys

To enable AI and voice processing, you'll need to supply:

```

REACT\_APP\_GEMINI\_API\_KEY=your\_gemini\_key
REACT\_APP\_TTS\_API\_KEY=your\_tts\_key  # if using a third-party TTS service

````

Add these into `.env` in the root of the project, and the frontend will load them at runtime.

---

## 🧪 Quick Start

```bash
git clone https://github.com/amauryca/NARA.I.git
cd NARA.I
npm install
cd client && npm install && cd ..
npm run dev
````

Visit `http://localhost:5000` (or as configured) to try the app.

---

## 📂 Project Structure

```
/
├── client          # React front-end
│   ├── src/
│   │   ├── pages/      // Home, EmotionTherapy, TextTherapy
│   │   ├── components/ // reusable UI (age selector, chat bubbles, video UI)
│   │   ├── hooks/      // face, voice, speech hooks
│   └── ...
├── server          # Express backend/API handling
├── shared          # Shared types/utilities (e.g. age/language context)
├── GITHUB_PAGES.md # deployment instructions
├── README.md       # this file
└── ...
```

---

| My Plan                                      | How NARA.I Implements It                                    |
| -------------------------------------------- | ----------------------------------------------------------- |
| Emotion‑aware voice therapy                  | Face and voice emotion detection components in client       |
| Real‑time speech‑to‑text + voice AI response | Gemini API integrated, TTS response supported               |
| Age-based conversation adaptation            | Age selector component and response logic in shared context |
| Multilingual support                         | Language toggle logic integrated throughout                 |
| Third page for text-based therapy            | Text therapy page built alongside voice mode                |
| Responsive design and animation              | Tailwind + Framer Motion in UI for smooth cross-device UX   |

---

## 🧩 Next Steps for Enhancement

* Plug in **Flash 2.0 Gemini** credentials into both front- and back-end for chat and voice flows
* Integrate robust **facial‑emotion** and **voice-tone** detection libraries for real-time input
* Add UI polish and animations via **Framer Motion**
* Extend multilingual support and refine **age-specific dialogue profiles**
* Add onboarding flows, user settings, and optionally **session journaling** or progress tracking

---

## 🤝 Contributing

Contributions and improvements are welcome! Please open issues to discuss features before major changes. Pull requests are encouraged for bug fixes, new UI components, emotion detection modules, and new language/age profiles.

---

## 📝 License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

---

*Nurturing mental wellbeing through empathetic AI across ages, voices, and cultures.*

