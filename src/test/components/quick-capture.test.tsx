import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuickCaptureOverlay } from '@/components/ui/quick-capture';

// Mock the store
const mockAddJournalEntry = vi.fn();
const mockAddTask = vi.fn();

vi.mock('@/lib/store', () => ({
  useStore: () => ({
    addJournalEntry: mockAddJournalEntry,
    addTask: mockAddTask,
    goals: [],
    tasks: [],
    events: [],
    journalEntries: [],
  }),
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock mediaDevices so voice mode doesn't crash in JSDOM
beforeEach(() => {
  Object.defineProperty(navigator, 'mediaDevices', {
    value: {
      getUserMedia: vi.fn().mockResolvedValue({
        getTracks: () => [{ stop: vi.fn() }],
        getAudioTracks: () => [{ stop: vi.fn() }],
      }),
    },
    writable: true,
    configurable: true,
  });
  // Mock MediaRecorder
  (globalThis as unknown as Record<string, unknown>).MediaRecorder = vi
    .fn()
    .mockImplementation(() => ({
      start: vi.fn(),
      stop: vi.fn(),
      ondataavailable: null,
      onstop: null,
      state: 'inactive',
    }));
});

describe('QuickCaptureOverlay', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<QuickCaptureOverlay isOpen={false} onClose={onClose} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the overlay when isOpen is true', () => {
    render(<QuickCaptureOverlay isOpen={true} onClose={onClose} />);
    expect(screen.getByText('Quick Capture')).toBeInTheDocument();
  });

  it('shows the mode selection prompt', () => {
    render(<QuickCaptureOverlay isOpen={true} onClose={onClose} />);
    expect(screen.getByText(/What's on your mind/i)).toBeInTheDocument();
  });

  it('shows Voice and Type buttons in select mode', () => {
    render(<QuickCaptureOverlay isOpen={true} onClose={onClose} />);
    expect(screen.getByText('Voice')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
  });

  it('shows the keyboard shortcut hint', () => {
    render(<QuickCaptureOverlay isOpen={true} onClose={onClose} />);
    expect(screen.getByText('Ctrl+Shift+J')).toBeInTheDocument();
  });

  it('calls onClose when backdrop is clicked', async () => {
    const { container } = render(<QuickCaptureOverlay isOpen={true} onClose={onClose} />);
    // The outermost div is the backdrop — clicking it triggers onClose
    const backdrop = container.firstChild as HTMLElement;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', () => {
    render(<QuickCaptureOverlay isOpen={true} onClose={onClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('switches to text mode when Type button is clicked', async () => {
    render(<QuickCaptureOverlay isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByText('Type'));
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/What's the thought/i)).toBeInTheDocument();
    });
  });

  it('shows character counter in text mode', async () => {
    render(<QuickCaptureOverlay isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByText('Type'));
    await waitFor(() => {
      expect(screen.getByText('0/2000')).toBeInTheDocument();
    });
  });

  it('updates character counter as user types', async () => {
    const user = userEvent.setup();
    render(<QuickCaptureOverlay isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByText('Type'));

    const textarea = await screen.findByPlaceholderText(/What's the thought/i);
    await user.type(textarea, 'Hello');

    expect(screen.getByText('5/2000')).toBeInTheDocument();
  });

  it('Save button is disabled when textarea is empty', async () => {
    render(<QuickCaptureOverlay isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByText('Type'));

    await waitFor(() => {
      // Default captureType is 'note', so button reads "Save Note"
      const saveBtn = screen.getByText(/Save Note/i).closest('button');
      expect(saveBtn).toBeDisabled();
    });
  });

  it('Save button is enabled after typing', async () => {
    const user = userEvent.setup();
    render(<QuickCaptureOverlay isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByText('Type'));

    const textarea = await screen.findByPlaceholderText(/What's the thought/i);
    await user.type(textarea, 'A thought');

    const saveBtn = screen.getByText(/Save Note/i).closest('button');
    expect(saveBtn).not.toBeDisabled();
  });

  it('saves journal entry on Save Note click', async () => {
    const user = userEvent.setup();
    mockAddJournalEntry.mockResolvedValue(undefined);

    render(<QuickCaptureOverlay isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByText('Type'));

    const textarea = await screen.findByPlaceholderText(/What's the thought/i);
    await user.type(textarea, 'My captured thought');

    fireEvent.click(screen.getByText(/Save Note/i).closest('button')!);

    await waitFor(() => {
      expect(mockAddJournalEntry).toHaveBeenCalledWith({
        content: 'My captured thought',
        mood: null,
        linkedGoalIds: [],
      });
    });
  });

  it('goes back to select mode when Back is clicked', async () => {
    render(<QuickCaptureOverlay isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByText('Type'));

    await screen.findByPlaceholderText(/What's the thought/i);
    fireEvent.click(screen.getByText('Back'));

    await waitFor(() => {
      expect(screen.getByText('Voice')).toBeInTheDocument();
      expect(screen.getByText('Type')).toBeInTheDocument();
    });
  });

  it('shows voice recording mode when Voice is clicked', async () => {
    render(<QuickCaptureOverlay isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByText('Voice'));

    await waitFor(() => {
      expect(screen.getByText('Stop & Save')).toBeInTheDocument();
    });
  });

  it('shows timer in voice mode', async () => {
    render(<QuickCaptureOverlay isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByText('Voice'));

    await waitFor(() => {
      expect(screen.getByText('00:00')).toBeInTheDocument();
    });
  });
});
