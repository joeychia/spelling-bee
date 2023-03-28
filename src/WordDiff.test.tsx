import React from 'react';
import { render } from '@testing-library/react';
import WordDiff from './WordDiff';

describe('WordDiff', () => {
  it('renders without crashing', () => {
    render(<WordDiff firstWord="hello" secondWord="world" />);
  });

  it('highlights the difference between two words', () => {
    const { container } = render(<WordDiff firstWord="hello" secondWord="helps" />);
    const highlightedLetters = container.querySelectorAll('span[style="background-color: red;"]');
    expect(highlightedLetters.length).toBe(2);
    expect(highlightedLetters[0].textContent).toBe('p');
    expect(highlightedLetters[1].textContent).toBe('s');
  });

  it('renders the second word as is if the words are identical', () => {
    const { container } = render(<WordDiff firstWord="hello" secondWord="hello" />);
    const highlightedLetters = container.querySelectorAll('span[style="background-color: red;"]');
    expect(highlightedLetters.length).toBe(0);
    expect(container.textContent).toBe('hello');
  });
});
