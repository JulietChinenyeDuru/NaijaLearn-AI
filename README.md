# 🇳🇬 NaijaLearn-AI

> **An AI-powered adaptive learning platform designed to democratise quality education across Nigeria and Africa built by an African educator, for African learners.**

[![Live Platform](https://img.shields.io/badge/Live%20Platform-naijalearn--ai.netlify.app-brightgreen?style=flat-square)](https://naijalearn-ai.netlify.app)
[![Built With](https://img.shields.io/badge/Built%20With-HTML%20%7C%20JavaScript%20%7C%20AI-orange?style=flat-square)](#tech-stack)
[![SDG Aligned](https://img.shields.io/badge/UN%20SDGs-4%20%7C%208%20%7C%209-blue?style=flat-square)](#social-impact)

---

## 📌 Table of Contents

- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Live Demo](#live-demo)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Social Impact](#social-impact)
- [Innovation & Global Talent Visa](#innovation--global-talent-visa-relevance)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Author](#author)

---

## About the Project

**NaijaLearn-AI** is an open-source, AI-powered educational platform built to address one of Africa's most critical challenges: access to quality, personalised, and contextually relevant digital education.

Millions of Nigerian students and learners lack access to adaptive, intelligent tutoring systems that understand their cultural context, learning pace, and local curriculum. NaijaLearn-AI bridges this gap by combining the power of large language models (LLMs) with locally relevant educational content, delivered through a lightweight, accessible web interface.

This project was conceived, designed, and built by **Juliet Chineye Duru**, an ICT Lecturer and researcher at Abia State University, Nigeria, as a direct response to the digital education inequality she witnesses daily in her professional environment.

> *"Education is the most powerful weapon you can use to change the world — NaijaLearn-AI puts that weapon in the hands of every Nigerian learner."*

---

## Key Features

- 🤖 **AI-Powered Chat Tutor** — Conversational learning assistant powered by advanced LLMs, capable of answering curriculum questions, explaining concepts, and guiding learners step by step
- 🌍 **Africa-Centred Content** — Educational content designed with Nigerian and African learners in mind, using locally relevant examples and context
- ⚡ **Serverless Architecture** — Built on Netlify Functions for scalable, cost-efficient cloud deployment accessible even in low-bandwidth environments
- 📊 **Learning Analytics** — Built-in analytics module to track learner engagement and progress
- 🔍 **Monitoring & Observability** — Dedicated monitoring layer ensuring platform reliability and uptime
- 📱 **Responsive Design** — Fully accessible on mobile devices, which are the primary internet access point for most African learners
- 🔐 **Admin Dashboard** — Secure admin panel for content management and learner oversight
- 🌐 **Multilingual-Ready Architecture** — Platform infrastructure designed to support African language integration

---

## Live Demo

🌐 **[https://naijalearn-ai.netlify.app](https://naijalearn-ai.netlify.app)**

The platform is live and accessible globally. No login is required to explore the learning assistant.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend / API | Netlify Serverless Functions (Node.js) |
| AI Engine | Large Language Model (LLM) via API |
| Deployment | Netlify (CI/CD via GitHub Actions) |
| Analytics | Custom analytics module |
| Monitoring | Dedicated monitoring module |
| Version Control | Git / GitHub |

---

## Architecture

```
NaijaLearn-AI/
├── .github/workflows/       # CI/CD pipeline (GitHub Actions)
├── analytics/               # Learning analytics module
├── docs/                    # Project documentation
├── monitoring/              # Platform monitoring and observability
├── netlify/
│   └── functions/           # Serverless backend functions (AI chat endpoint)
├── index.html               # Main learner-facing application
├── admin.html               # Admin dashboard
├── netlify.toml             # Netlify deployment configuration
└── package.json             # Project dependencies
```

The platform follows a **serverless-first, cloud-native architecture**, keeping infrastructure costs minimal while ensuring global scalability. The AI conversation engine is exposed via a single Netlify Function endpoint:

```
POST /.netlify/functions/chat
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- Netlify CLI
- API key for the AI engine of your choice

### Installation

```bash
# Clone the repository
git clone https://github.com/JulietChinenyeDuru/NaijaLearn-AI.git
cd NaijaLearn-AI

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your AI API key to .env

# Run locally with Netlify Dev
npx netlify dev
```

The platform will be available at `http://localhost:8888`.

---

## API Reference

### Chat Endpoint

**POST** `/.netlify/functions/chat`

**Request Body:**
```json
{
  "message": "Explain photosynthesis in simple terms",
  "context": "secondary school biology"
}
```

**Response:**
```json
{
  "reply": "Photosynthesis is the process by which green plants use sunlight to make their own food..."
}
```

---

## Social Impact

NaijaLearn-AI directly addresses the educational inequality gap in sub-Saharan Africa. According to UNESCO, over **244 million children and youth** globally are out of school, with Sub-Saharan Africa disproportionately affected.

This project contributes to:

- ✅ **Educational inclusion** — making quality AI tutoring accessible beyond elite urban schools
- ✅ **AI accessibility in Africa** — demonstrating that AI-powered tools can be built *for* and *by* Africans
- ✅ **Youth digital empowerment** — equipping young Nigerians with AI-assisted learning tools
- ✅ **Increased STEM participation** — lowering barriers for students to engage with science and technology education
- ✅ **Reduction in educational inequality** — providing a free, open platform that requires only a smartphone and data connection

### UN Sustainable Development Goals Alignment

| SDG | Goal | How NaijaLearn-AI Contributes |
|---|---|---|
| **SDG 4** | Quality Education | Provides free, AI-powered, personalised tutoring |
| **SDG 8** | Decent Work & Economic Growth | Builds digital skills needed for the modern economy |
| **SDG 9** | Industry, Innovation & Infrastructure | Demonstrates scalable EdTech infrastructure built in Africa |

---

## Innovation & Global Talent Visa Relevance

NaijaLearn-AI represents a technically novel and socially significant contribution to the global EdTech and AI landscape.

### Technical Innovation

| Area | Innovation |
|---|---|
| AI Integration | Deployment of LLMs within a serverless, Africa-optimised web architecture |
| EdTech Design | Contextually aware educational AI for underserved markets |
| Cloud Architecture | Scalable Netlify-based serverless infrastructure with CI/CD automation |
| Accessibility | Mobile-first design for low-bandwidth African internet environments |
| Observability | Custom monitoring and analytics layer for learner engagement tracking |

### Evidence of Exceptional Talent

This project demonstrates:

- **Independent technical leadership** — sole conception, architecture, development, and deployment of a full-stack AI-powered application
- **Product innovation** — solving a real-world problem (educational inequality) with modern AI technology
- **Societal impact at scale** — a live, publicly accessible platform serving learners across Nigeria and beyond
- **Open-source contribution** — freely available codebase inviting global collaboration and improvement
- **Digital technology contribution** — advancing the use of AI in education within an emerging market context

## Roadmap

Planned features and improvements:

- [ ] 🎙️ Voice learning assistant (speech-to-text input)
- [ ] 📶 Offline learning support for areas with poor connectivity
- [ ] 👤 Personalised learning profiles and progress tracking
- [ ] 📝 AI-powered exam preparation and practice tests
- [ ] 💻 Interactive coding exercises and mini projects
- [ ] 📊 Advanced learning analytics dashboard
- [ ] 📱 Native mobile application (Android-first)
- [ ] 🌍 Support for additional African languages (Yoruba, Igbo, Hausa, Pidgin)
- [ ] 🏫 School/institution integration API

---

## Contributing

Contributions are welcome and encouraged! NaijaLearn-AI is an open-source project and benefits greatly from community involvement.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) and our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before submitting a pull request.

### How to Contribute

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## Author

**Juliet Chineye Duru**
*ICT Lecturer | Data Engineer | Cloud & AI DevOps Practitioner*
Abia State University, Nigeria

[![GitHub](https://img.shields.io/badge/GitHub-JulietChinenyeDuru-black?style=flat-square&logo=github)](https://github.com/JulietChinenyeDuru)

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for the full history of changes and releases.


<p align="center">
  Built with ❤️ in Nigeria, for Africa and the world.
</p>


