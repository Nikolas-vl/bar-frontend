import { useState } from 'react';
import { cn } from '@/utils/cn';

interface NoteEditorProps {
  /** Current saved note value */
  note: string | null;
  /** Called when user blurs or presses Enter with a new value. null = cleared. */
  onSave: (note: string | null) => void;
}

/**
 * Reusable inline note editor.
 * Shows the note as italic text when set, "Add note" link when empty.
 * Clicking it turns into a small text input; blurring or pressing Enter saves.
 * Only calls `onSave` if the value actually changed.
 */
export function NoteEditor({ note, onSave }: NoteEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(note ?? '');

  const handleSave = () => {
    setIsEditing(false);
    const trimmed = value.trim();
    const next = trimmed === '' ? null : trimmed;
    if (next !== note) {
      onSave(next);
    }
  };

  if (isEditing) {
    return (
      <input
        autoFocus
        className='text-[11px] w-full px-2 py-1 rounded border border-ob-border bg-white focus:outline-none focus:border-ob-caramel'
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={e => {
          if (e.key === 'Enter') handleSave();
          if (e.key === 'Escape') {
            setValue(note ?? '');
            setIsEditing(false);
          }
        }}
        placeholder='Add a note…'
        maxLength={500}
      />
    );
  }

  return (
    <button
      onClick={() => {
        setValue(note ?? '');
        setIsEditing(true);
      }}
      className={cn(
        'text-[11px] transition-colors hover:text-ob-caramel text-left',
        note ? 'text-ob-muted italic' : 'text-ob-border underline underline-offset-2',
      )}
    >
      {note ? `"${note}"` : 'Add note'}
    </button>
  );
}
