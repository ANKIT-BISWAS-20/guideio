# Contributing to GuideIO: AdvancedForm

Thank you for your interest in contributing to GuideIO's AdvancedForm! We welcome all contributions to make this accessible React form component even better.

## Table of Contents
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Running Locally](#running-locally)
- [Building the Library](#building-the-library)
- [Linting & Code Style](#linting--code-style)
- [Submitting Pull Requests](#submitting-pull-requests)
- [Reporting Issues](#reporting-issues)
- [Project Structure](#project-structure)
- [Publishing](#publishing)
- [Code of Conduct](#code-of-conduct)

---

## Getting Started
1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```sh
   git clone https://github.com/YOUR_USERNAME/GuideIO.git
   cd GuideIO
   ```
3. **Install dependencies**:
   ```sh
   npm install
   ```

## Development Workflow
- All source code is in the `src/` directory.
- The main component is `src/AdvancedForm.tsx`.
- Use the demo app in `src/App.tsx` to test changes locally.

## Running Locally
Start the development server:
```sh
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) to view the demo app.

## Building the Library
To build the distributable package:
```sh
npm run build
```
Output will be in the `dist/` directory.

## Linting & Code Style
Run ESLint to check code style and catch errors:
```sh
npm run lint
```

## Submitting Pull Requests
1. Create a new branch for your feature or fix:
   ```sh
   git checkout -b feature/your-feature-name
   ```
2. Make your changes and commit them with clear messages.
3. Push your branch and open a Pull Request (PR) against the `main` branch.
4. Ensure your PR:
   - Passes linting
   - Includes tests or demo usage if relevant
   - Updates documentation if needed

## Reporting Issues
- Use [GitHub Issues](https://github.com/YOUR_USERNAME/GuideIO/issues) to report bugs, request features, or ask questions.
- Please provide clear steps to reproduce and relevant context.

## Project Structure
- `src/` – Source code (included in GitHub, excluded from npm package)
- `dist/` – Build output (included in npm package, ignored in GitHub)
- `README.md` – Usage, features, and roadmap
- `.npmignore` – Excludes dev/demo files from npm package
- `.gitignore` – Excludes build/dev files from GitHub
- `LICENSE` – MIT license
- `instruction.md` – Dev and publish instructions

## Publishing
- Only maintainers should publish to npm.
- Bump the version in `package.json` before publishing.
- Only `dist/`, `README.md`, and `LICENSE` are published to npm (see `.npmignore`).

## Code of Conduct
Please be respectful and inclusive. See [Contributor Covenant](https://www.contributor-covenant.org/) for guidelines.

---

Thank you for helping make GuideIO better!
