import React from 'react';
import { render, screen } from '@testing-library/react';
import store from 'store';
import ChallengeTranscript from './challenge-transcript';

const baseProps = {
  transcript: 'Sample transcript text'
};

describe('<ChallengeTranscript />', () => {
  beforeEach(() => {
    store.clearAll();
  });

  it('renders the transcript heading', () => {
    render(<ChallengeTranscript {...baseProps} />);
    expect(screen.getByText('learn.transcript')).toBeVisible();
  });

  it('renders collapsed by default', () => {
    render(<ChallengeTranscript {...baseProps} />);
    expect(screen.getByTestId('challenge-transcript')).not.toHaveAttribute(
      'open'
    );
    expect(screen.getByText('Sample transcript text')).not.toBeVisible();
  });

  it("renders collapsed when localstorage 'fcc-transcript-expanded = false'", () => {
    store.set('fcc-transcript-expanded', false);
    render(<ChallengeTranscript {...baseProps} />);
    expect(screen.getByTestId('challenge-transcript')).not.toHaveAttribute(
      'open'
    );
    expect(screen.getByText('Sample transcript text')).not.toBeVisible();
  });

  it("renders expanded when 'fcc-transcript-expanded = true'", () => {
    store.set('fcc-transcript-expanded', true);
    render(<ChallengeTranscript {...baseProps} />);
    expect(screen.getByTestId('challenge-transcript')).toHaveAttribute('open');
    expect(screen.getByText('Sample transcript text')).toBeVisible();
  });
});
