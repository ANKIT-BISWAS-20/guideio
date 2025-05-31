/**
 * @packageDocumentation
 * @module AdvancedForm
 * @description Highly accessible React form component with voice input and interviewer mode.
 * @author Ankit Biswas
 * @copyright Copyright (c) 2025 Ankit Biswas
 * @license MIT
 */

import React from 'react';
import type { ReactNode } from 'react';

interface AdvancedFormProps {
  children: ReactNode;
}

// Add type definitions for SpeechRecognition
// @ts-ignore
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

/**
 * AdvancedForm wraps input fields to provide voice and sign language input support.
 * Voice input and sign language input are not yet implemented in this stub.
 */
const AdvancedForm: React.FC<AdvancedFormProps> = ({ children }) => {
  const [listening, setListening] = React.useState(false);
  const [interviewing, setInterviewing] = React.useState(false);
  const recognitionRef = React.useRef<any>(null);
  const inputRefs = React.useRef<HTMLInputElement[]>([]);

  // Focus next input on Enter, Tab, or Next
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      const next = inputRefs.current[idx + 1];
      if (next) next.focus();
    }
  };

  // Attach voice input to all input fields
  const handleVoiceInput = (input: HTMLInputElement) => {
    if (!SpeechRecognition) {
      alert('Speech Recognition API not supported in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      let transcript = event.results[0][0].transcript;
      // Replace spoken words for symbols with their actual characters
      const symbolMap: Record<string, string> = {
        'at the rate': '@',
        'at symbol': '@',
        'hashtag': '#',
        'hash': '#',
        'dollar': '$',
        'percent': '%',
        'ampersand': '&',
        'and sign': '&',
        'asterisk': '*',
        'star': '*',
        'exclamation': '!',
        'exclamation mark': '!',
        'caret': '^',
        'underscore': '_',
        'plus': '+',
        'minus': '-',
        'equals': '=',
        'equal': '=',
        'tilde': '~',
        'backtick': '`',
        'pipe': '|',
        'backslash': '\\',
        'forward slash': '/',
        'slash': '/',
        'colon': ':',
        'semicolon': ';',
        'single quote': "'",
        'double quote': '"',
        'less than': '<',
        'greater than': '>',
        'question mark': '?',
        'open parenthesis': '(',
        'close parenthesis': ')',
        'open bracket': '[',
        'close bracket': ']',
        'open brace': '{',
        'close brace': '}',
        'comma': ',',
        'dot': '.',
        'period': '.',
        'space': ' '
      };
      // Replace all spoken symbol words in the transcript
      for (const [word, symbol] of Object.entries(symbolMap)) {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        transcript = transcript.replace(regex, symbol);
      }
      // Create a synthetic React change event
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
      nativeInputValueSetter?.call(input, transcript);
      const reactEvent = new Event('input', { bubbles: true });
      (reactEvent as any)._fromVoice = true;
      input.dispatchEvent(reactEvent);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  // Voice instructions for accessibility
  React.useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const instructions =
      'This form supports voice input. To enter text, focus an input field and press the microphone button. Speak your input, including special symbols by saying their names, for example: at the rate for @, hash for #, dot for period, and so on.';
    const utter = new window.SpeechSynthesisUtterance(instructions);
    utter.rate = 1;
    utter.pitch = 1;
    utter.lang = 'en-US';
    // Only speak if user is using a screen reader or on first mount
    window.speechSynthesis.speak(utter);
    // Optionally, clean up on unmount
    return () => window.speechSynthesis.cancel();
  }, []);

  // Interviewer mode: When start button is clicked, prompt for readiness, then take voice input for each field by name
  const startInterview = async () => {
    if (!SpeechRecognition || !('speechSynthesis' in window)) return;
    let cancelled = false;
    const speak = (text: string) => {
      return new Promise<void>(resolve => {
        const utter = new window.SpeechSynthesisUtterance(text);
        utter.rate = 1;
        utter.pitch = 1;
        utter.lang = 'en-US';
        utter.onend = () => resolve();
        window.speechSynthesis.speak(utter);
      });
    };
    const listenForYes = () => {
      return new Promise<boolean>(resolve => {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        let resolved = false;
        recognition.onresult = (event: any) => {
          const answer = event.results[0][0].transcript.toLowerCase().trim();
          if (!resolved && (answer.includes('yes') || answer.includes('ready') || answer.includes('start'))) {
            resolved = true;
            resolve(true);
            recognition.stop();
          } else if (!resolved) {
            resolved = true;
            resolve(false);
            recognition.stop();
          }
        };
        recognition.onend = () => {
          if (!resolved) resolve(false);
        };
        recognition.onerror = () => {
          if (!resolved) resolve(false);
        };
        recognition.start();
      });
    };
    await speak('Welcome. This form supports voice input. Are you ready to start? Please say yes to begin.');
    const ready = await listenForYes();
    if (!ready || cancelled) return;
    // Helper to validate a field and re-prompt if invalid
    const validateAndInput = async (input: HTMLInputElement, label: string) => {
      while (true) {
        input.focus();
        await speak(`Please say your ${label}`);
        await new Promise<void>(resolve => {
          const recognition = new SpeechRecognition();
          recognition.lang = 'en-US';
          recognition.interimResults = false;
          recognition.maxAlternatives = 1;
          recognition.onresult = (event: any) => {
            let transcript = event.results[0][0].transcript;
            // Symbol replacement (reuse logic)
            const symbolMap: Record<string, string> = {
              'at the rate': '@', 'at symbol': '@', 'hashtag': '#', 'hash': '#', 'dollar': '$', 'percent': '%',
              'ampersand': '&', 'and sign': '&', 'asterisk': '*', 'star': '*', 'exclamation': '!', 'exclamation mark': '!',
              'caret': '^', 'underscore': '_', 'plus': '+', 'minus': '-', 'equals': '=', 'equal': '=', 'tilde': '~',
              'backtick': '`', 'pipe': '|', 'backslash': '\\', 'forward slash': '/', 'slash': '/', 'colon': ':',
              'semicolon': ';', 'single quote': "'", 'double quote': '"', 'less than': '<', 'greater than': '>',
              'question mark': '?', 'open parenthesis': '(', 'close parenthesis': ')', 'open bracket': '[', 'close bracket': ']',
              'open brace': '{', 'close brace': '}', 'comma': ',', 'dot': '.', 'period': '.', 'space': ' '
            };
            for (const [word, symbol] of Object.entries(symbolMap)) {
              const regex = new RegExp(`\\b${word}\\b`, 'gi');
              transcript = transcript.replace(regex, symbol);
            }
            // If this is an email field, format: no spaces, all lowercase
            if (input.type === 'email' || input.getAttribute('name')?.toLowerCase().includes('email')) {
              transcript = transcript.replace(/\s+/g, '').toLowerCase();
            }
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
            nativeInputValueSetter?.call(input, transcript);
            const reactEvent = new Event('input', { bubbles: true });
            (reactEvent as any)._fromVoice = true;
            input.dispatchEvent(reactEvent);
            resolve();
          };
          recognition.onend = () => resolve();
          recognition.start();
        });
        // Validate the field using HTML5 validation
        if (input.checkValidity()) {
          break;
        } else {
          await speak(`There was a problem with your ${label}. ${input.validationMessage}. Please try again.`);
        }
      }
    };
    for (let i = 0; i < inputRefs.current.length; i++) {
      if (cancelled) break;
      const input = inputRefs.current[i];
      if (!input) continue;
      const label = input.getAttribute('name') || input.getAttribute('aria-label') || input.getAttribute('placeholder') || `Field ${i + 1}`;
      await validateAndInput(input, label);
    }
    // After all fields are filled, try to find and click the submit button
    const form = inputRefs.current[0]?.form;
    if (form) {
      const submitBtn = form.querySelector('button[type="submit"],input[type="submit"]') as HTMLElement | null;
      if (submitBtn) {
        submitBtn.focus();
        submitBtn.click();
      }
    }
  };

  // Enhance children: add mic button and keyboard navigation
  // Clear refs before mapping children to collect them in order
  inputRefs.current = [];
  const enhancedChildren = React.Children.map(children, (child, idx) => {
    if (React.isValidElement(child) && child.type === 'input') {
      return (
        <div className="advancedform-input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 4 }}>
          {React.cloneElement(child as React.ReactElement<any, any>, {
            ref: (el: HTMLInputElement | null) => {
              if (el && !inputRefs.current.includes(el)) inputRefs.current.push(el);
            },
            onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, idx),
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              const childProps = child.props as React.InputHTMLAttributes<HTMLInputElement>;
              if (childProps.onChange) childProps.onChange(e);
              if (!(e as any)._fromVoice) {
                // Do not dispatch another event, just let React handle it
              }
            },
            style: { flex: 1, ...(child.props as any).style || {}, zIndex: 1 }
          })}
          <button
            type="button"
            aria-label="Start voice input"
            tabIndex={-1}
            onClick={e => {
              const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
              handleVoiceInput(input);
            }}
            disabled={listening}
            className="advancedform-mic-btn"
            style={{
              position: 'absolute',
              right: 6,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'white',
              border: 'none',
              borderRadius: '50%',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              fontSize: '1.1em',
              padding: 0,
              width: 24,
              height: 24,
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 2
            }}
          >
            <span role="img" aria-label="mic">🎤</span>
          </button>
          <style>{`
            .advancedform-input-wrapper:hover .advancedform-mic-btn {
              display: flex !important;
            }
            .advancedform-mic-btn:active {
              background: #f0f0f0;
            }
            .advancedform-mic-btn[disabled] {
              opacity: 0.5;
              cursor: not-allowed;
            }
          `}</style>
        </div>
      );
    }
    return child;
  });

  return (
    <form>
      {!interviewing && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <button
            type="button"
            className="advancedform-start-btn"
            style={{
              background: '#2563eb', color: 'white', fontWeight: 600, fontSize: 18, border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', margin: 8
            }}
            onClick={() => { setInterviewing(true); setTimeout(startInterview, 100); }}
          >
            Start Voice Interview
          </button>
        </div>
      )}
      {/* Show a visual indicator when listening for voice input */}
      {listening && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
          color: '#2563eb', fontWeight: 600, fontSize: 18, gap: 10
        }}>
          <span style={{ fontSize: 28, animation: 'pulse 1s infinite' }} role="img" aria-label="listening mic">🎤</span>
          <span>Now you can speak...</span>
          <style>{`
            @keyframes pulse {
              0% { opacity: 1; }
              50% { opacity: 0.3; }
              100% { opacity: 1; }
            }
          `}</style>
        </div>
      )}
      {enhancedChildren}
    </form>
  );
};

export default AdvancedForm;
