import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import WordInput from './WordInput';

describe('WordInput', () => {
  it('should highlight the word in green when input matches the word', () => {
    const { getByRole, getByLabelText } = render(<WordInput word="hello" />);
    const input = getByLabelText('Input');
    fireEvent.change(input, { target: { value: 'hello' } });
    const highlightedText = getByRole('heading');
    expect(highlightedText).toHaveStyle('color: green');
  });

  it('should highlight the matching part of the word in black and the rest in red when input is not empty and does not match the word', () => {
    const { getByRole, getByLabelText } = render(<WordInput word="hello" />);
    const input = getByLabelText('Input');
    fireEvent.change(input, { target: { value: 'hi' } });
    const highlightedText = getByRole('heading');
    expect(highlightedText).toHaveStyle(`
      color: red;
    `);
    expect(highlightedText.firstChild).toHaveStyle(`
      color: black;
    `);
  });

  it('should highlight the entire word in green when input is not empty and matches the word', () => {
    const { getByRole, getByLabelText } = render(<WordInput word="hello" />);
    const input = getByLabelText('Input');
    fireEvent.change(input, { target: { value: 'hell' } });
    const highlightedText = getByRole('heading');
    expect(highlightedText).toHaveStyle('color: green');
  });
});
