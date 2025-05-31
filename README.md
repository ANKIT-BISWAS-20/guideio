# AdvancedForm React Component

A highly accessible, modular React form component that enables each input field to accept both voice input (via the browser's Speech Recognition API) and, in the future, sign language input via camera. Includes an "interviewer" mode for guided, voice-driven form filling. Designed for ease of integration and maximum accessibility.

---

## Features
- **Voice Input**: Each input field can be filled using your voice. Special symbol words (e.g., "at the rate" → @) are automatically mapped.
- **Interviewer Mode**: Prompts the user for each field in order, using voice, and automatically submits the form when all fields are valid.
- **Accessibility**: Designed for blind and visually impaired users. Voice instructions and keyboard navigation are built-in.
- **Visual Feedback**: Shows a pulsing microphone icon and message when the form is listening for voice input.
- **Validation**: If a field fails validation (e.g., email format), the user is re-prompted for that field until valid.
- **Easy Integration**: Wrap your form fields with `<AdvancedForm>` and use as a drop-in replacement for your forms.

---

## Installation

```bash
npm install guideio
```

---

## Usage

```tsx
import React, { useState } from 'react';
import AdvancedForm from 'guideio';

export default function SignupForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setSuccess('Signup successful!');
  };

  return (
    <AdvancedForm>
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={form.confirmPassword}
        onChange={handleChange}
        required
      />
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: 8 }}>{success}</div>}
      <button type="submit">Sign Up</button>
    </AdvancedForm>
  );
}
```

---

## Props

| Prop      | Type         | Description                                  |
|-----------|--------------|----------------------------------------------|
| children  | ReactNode    | Input fields and submit button to wrap.      |

---

## How It Works
- **Voice Input**: Click the mic button (appears on input hover/focus) to start voice input for that field. Speak your input, including special symbols by their names (e.g., "at the rate" for @).
- **Interviewer Mode**: Click "Start Voice Interview". The form will prompt you for each field in order, listen for your response, validate, and move to the next. If a field is invalid, you will be re-prompted.
- **Visual Feedback**: When the form is listening, a large pulsing mic icon and message appear above the form.
- **Accessibility**: Voice instructions are read on mount. Keyboard navigation (Tab/Enter) is supported.

---

## Accessibility
- Screen reader friendly: Voice instructions and ARIA labels.
- Keyboard navigation: Tab/Enter to move between fields.
- Visual and voice cues for all actions.

---

## Browser Compatibility

| Feature                | Chrome | Edge | Firefox | Safari | Mobile Chrome | Mobile Safari |
|------------------------|:------:|:----:|:-------:|:------:|:-------------:|:-------------:|
| Voice Input (Web Speech API) |  ✅   |  ✅  |   ✅   |  ✅   |      ✅       |      ✅       |
| Keyboard Navigation    |   ✅   |  ✅  |   ✅    |  ✅    |      ✅       |      ✅       |
| Visual Feedback        |   ✅   |  ✅  |   ✅    |  ✅    |      ✅       |      ✅       |

*Firefox: Voice input support is experimental and may require enabling flags. Safari: Voice input works on recent versions (macOS/iOS 14+).

---

## Keywords

voice input, react, accessibility, form, web speech api, interviewer mode, sign language, camera, a11y, guided form, modular, npm, react component

---

## Roadmap
- [upcoming] Sign language input via camera
- [upcoming] More customization options
- [upcoming] Internationalization/localization

---

## License

MIT © 2025 Ankit Biswas

---

*This project was bootstrapped with Vite's React TypeScript template.*
