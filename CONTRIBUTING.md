# Contributing to NaijaLearn-AI

Thank you for your interest in contributing to NaijaLearn-AI. This project exists to make quality STEM and ICT education accessible to every Nigerian university student in their own language. Every contribution however small helps achieve that mission.

---

## Ways to Contribute

### For Nigerian Educators and Lecturers

- Improve subject explanations for specific courses
- Add curriculum alignment to Nigerian university syllabuses
- Review responses for academic accuracy
- Suggest new subjects or topics to cover
- Test the app with your students and share feedback

### For Developers

- Fix bugs and improve performance
- Improve mobile responsiveness
- Add new features from the roadmap
- Improve language quality for Yoruba, Hausa or Igbo
- Write tests

### For Language Experts

- Review and improve Pidgin English responses
- Review and improve Yoruba responses
- Review and improve Hausa responses
- Review and improve Igbo responses

### For Researchers

- Cite NaijaLearn-AI in your research
- Share usage data or findings
- Suggest research collaborations

---

## Getting Started

### 1. Fork the Repository

Click the Fork button at the top right of the GitHub page.

### 2. Clone Your Fork

```bash
git clone https//github.com/JulietChinenyeDuru/NaijaLearn-AI
cd NaijaLearn-AI
```

### 3. Create a Branch

Use a descriptive branch name:

```bash
git checkout -b feature/improve-hausa-responses
git checkout -b fix/mobile-layout-bug
git checkout -b docs/add-api-examples
```

### 4. Make Your Changes

Edit the files you want to improve. The main files are:

| File | What it does |
|---|---|
| `index.html` | Frontend — HTML, CSS, and JavaScript |
| `netlify/functions/chat.js` | Backend — API handler |
| `README.md` | Main documentation |
| `docs/API.md` | API documentation |

### 5. Test Your Changes

Open `index.html` directly in your browser to test frontend changes. Make sure:

- The app loads correctly on desktop
- The app loads correctly on mobile (use Chrome DevTools)
- All 10 subjects work
- All 5 languages respond correctly
- The chat works end to end

### 6. Commit Your Changes

Write clear, descriptive commit messages:

```bash
git add .
git commit -m "Improve Yoruba explanations for Physics subject"
git commit -m "Fix subject grid overflow on small mobile screens"
git commit -m "Add Economics curriculum alignment for UNILAG"
```

### 7. Push and Open a Pull Request

```bash
git push origin feature/improve-hausa-responses
```

Then go to GitHub and click **New Pull Request**. Describe:

- What you changed and why
- How you tested it
- Any screenshots if relevant

---

## Code Style Guidelines

### HTML and CSS

- Use meaningful class names in kebab-case
- Keep CSS organised — layout, then components, then mobile
- Always test on mobile before submitting

### JavaScript

- Use `const` and `let` — never `var`
- Use `async/await` for API calls
- Add comments for complex logic
- Keep functions small and focused

### Node.js (Netlify Functions)

- Always handle errors with try/catch
- Always include CORS headers
- Never log sensitive information like API keys
- Return meaningful error messages

---

## What We Will Not Accept

- Changes that break mobile responsiveness
- Code that exposes API keys or secrets
- Responses that are culturally insensitive to Nigerian culture
- Changes that remove support for any of the 5 languages
- Dependencies that significantly increase bundle size

---

## Reporting Bugs

Open a GitHub Issue with:

- A clear description of the bug
- Steps to reproduce it
- What you expected to happen
- What actually happened
- Your device and browser
- Screenshots if helpful

---

## Suggesting Features

Open a GitHub Issue with the label `enhancement` and describe:

- What problem it solves for Nigerian students
- How you imagine it working
- Any examples from similar tools

---

## Questions

Open a GitHub Discussion or contact the author directly through GitHub.

---

## Recognition

All contributors are credited in the project. Significant contributors may be acknowledged in research publications related to NaijaLearn-AI.

Thank you for helping Nigerian students learn in their own language.
