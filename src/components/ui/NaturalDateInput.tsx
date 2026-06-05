'use client';

import { useState, useRef } from 'react';
import { parseNaturalDate, describeParsed, toInputDateString } from '@/lib/date-parser';

interface NaturalDateInputProps {
  value: string; // YYYY-MM-DD or empty
  onChange: (value: string) => void; // YYYY-MM-DD or empty
  placeholder?: string;
  className?: string;
}

/**
 * Date input that accepts both natural language ("tomorrow", "next friday")
 * and standard date strings. Shows a human-readable hint as the user types.
 */
export function NaturalDateInput({
  value,
  onChange,
  placeholder = 'Due date or "tomorrow"',
  className = '',
}: NaturalDateInputProps) {
  const [text, setText] = useState(value); // raw text user typed
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(raw: string) {
    setText(raw);
    if (!raw.trim()) {
      onChange('');
      return;
    }
    // Try NLP first
    const parsed = parseNaturalDate(raw);
    if (parsed) {
      onChange(toInputDateString(parsed));
    } else {
      // May still be a partial ISO date
      onChange(raw);
    }
  }

  function handleBlur() {
    setShowHint(false);
    // If the text is a valid NLP expression, replace it with the human-readable date
    if (text.trim()) {
      const parsed = parseNaturalDate(text);
      if (parsed) {
        const ds = toInputDateString(parsed);
        setText(ds);
        onChange(ds);
      }
    }
  }

  const hint = showHint && text.trim() ? describeParsed(text) : null;

  return (
    <div className="relative">
      <div className="flex items-center gap-1">
        <span className="material-symbols-outlined text-xs text-[#6B7280]">event</span>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setShowHint(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`bg-transparent text-xs text-[#9CA3AF] placeholder-[#6B7280] focus:outline-none ${className}`}
        />
      </div>
      {hint && (
        <div className="absolute top-full left-0 mt-1 px-2 py-1 rounded-lg bg-[#0F1729] border border-white/10 text-xs text-[#C17A72] whitespace-nowrap z-10 pointer-events-none">
          {hint}
        </div>
      )}
    </div>
  );
}
