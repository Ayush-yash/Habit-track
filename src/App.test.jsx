import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Habit Tracker App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the title', () => {
    render(<App />);
    expect(screen.getByText('Daily Habit Tracker')).toBeInTheDocument();
  });

  it('adds a new habit', () => {
    render(<App />);
    const input = screen.getByPlaceholderText('➕ Add a new habit (Gym, Study, etc.)');
    const button = screen.getByText('Add');

    fireEvent.change(input, { target: { value: 'Read a book' } });
    fireEvent.click(button);

    expect(screen.getByText('Read a book')).toBeInTheDocument();
    expect(screen.getByText('Total Habits: 1')).toBeInTheDocument();
  });
});
