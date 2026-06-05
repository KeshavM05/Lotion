'use client';

import React from 'react';
import { Modal } from '@/components/ui/modal';
import type { CalendarEvent } from '@/lib/store';
import { COLORS, DAYS_SHORT, type EventFormState } from './types';

interface EventModalProps {
  open: boolean;
  editingEvent: CalendarEvent | null;
  form: EventFormState;
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
  onFormChange: (patch: Partial<EventFormState>) => void;
}

export default function EventModal({
  open,
  editingEvent,
  form,
  onClose,
  onSave,
  onDelete,
  onFormChange,
}: EventModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={editingEvent ? 'Edit Event' : 'New Event'}>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Event title"
          value={form.title}
          onChange={(e) => onFormChange({ title: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && onSave()}
          autoFocus
          className="input-glass text-base"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        />
        <textarea
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => onFormChange({ description: e.target.value })}
          rows={2}
          className="input-glass resize-none"
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>
              Start
            </label>
            <input
              type="datetime-local"
              value={form.start}
              onChange={(e) => onFormChange({ start: e.target.value })}
              className="input-glass w-full"
            />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>
              End
            </label>
            <input
              type="datetime-local"
              value={form.end}
              onChange={(e) => onFormChange({ end: e.target.value })}
              className="input-glass w-full"
            />
          </div>
        </div>
        <div>
          <label className="text-xs mb-2 block" style={{ color: 'var(--text-muted)' }}>
            Color
          </label>
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => onFormChange({ color: c })}
                className="w-7 h-7 rounded-full transition-all"
                style={{
                  backgroundColor: c,
                  transform: form.color === c ? 'scale(1.15)' : 'scale(1)',
                  boxShadow:
                    form.color === c ? `0 0 0 2px var(--bg-primary), 0 0 0 4px ${c}` : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Recurrence Section */}
        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              Repeat
            </label>
            <button
              type="button"
              onClick={() => onFormChange({ isRecurring: !form.isRecurring })}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                form.isRecurring ? 'bg-[#C17A72]' : 'bg-white/10'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  form.isRecurring ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {form.isRecurring && (
            <div className="space-y-3 pl-1">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs mb-1 block text-[#9CA3AF]">Every</label>
                  <input
                    type="number"
                    min="1"
                    value={form.recurrenceInterval}
                    onChange={(e) =>
                      onFormChange({
                        recurrenceInterval: Math.max(1, parseInt(e.target.value) || 1),
                      })
                    }
                    className="input-glass w-full text-sm"
                  />
                </div>
                <div className="flex-[2]">
                  <label className="text-xs mb-1 block text-[#9CA3AF]">Frequency</label>
                  <select
                    value={form.recurrenceFrequency}
                    onChange={(e) =>
                      onFormChange({
                        recurrenceFrequency: e.target
                          .value as EventFormState['recurrenceFrequency'],
                      })
                    }
                    className="input-glass w-full text-sm cursor-pointer"
                  >
                    <option value="daily">Day(s)</option>
                    <option value="weekly">Week(s)</option>
                    <option value="monthly">Month(s)</option>
                    <option value="yearly">Year(s)</option>
                  </select>
                </div>
              </div>

              {form.recurrenceFrequency === 'weekly' && (
                <div>
                  <label className="text-xs mb-2 block text-[#9CA3AF]">Repeat on</label>
                  <div className="flex gap-1">
                    {DAYS_SHORT.map((day, index) => {
                      const isSelected = form.recurrenceDaysOfWeek.includes(index);
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            const next = isSelected
                              ? form.recurrenceDaysOfWeek.filter((d) => d !== index)
                              : [...form.recurrenceDaysOfWeek, index].sort();
                            onFormChange({ recurrenceDaysOfWeek: next });
                          }}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                            isSelected
                              ? 'bg-[#C17A72]/20 text-[#C17A72] border border-[#C17A72]/30'
                              : 'bg-white/5 text-[#9CA3AF] hover:bg-white/10'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs mb-1 block text-[#9CA3AF]">End date (optional)</label>
                <input
                  type="date"
                  value={form.recurrenceEndDate}
                  onChange={(e) => onFormChange({ recurrenceEndDate: e.target.value })}
                  className="input-glass w-full text-sm"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          {editingEvent ? (
            <button
              onClick={onDelete}
              className="px-3 py-2 text-sm rounded-lg"
              style={{ color: 'var(--danger)' }}
            >
              Delete
            </button>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg"
              style={{ color: 'var(--text-secondary)' }}
            >
              Cancel
            </button>
            <button onClick={onSave} className="btn-glow px-5 py-2 rounded-xl text-sm font-medium">
              {editingEvent ? 'Save' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
