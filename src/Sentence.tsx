/* Create a Sentence component in React Typescript. The input is a word. It initially shows a button "Sentence". When clicked, it replaces the text with a spinner in the button, and start to fetch sentence from Firebase realtime database with "sentences/${word}". When result comes back, read it aloud, and replace the spinner with a voice animation indicating there's audio playing until the end of playing. Then change it back to "Sentence" on the button.
After loading, replace spinner with a voice animation on the button, until the audio play completes.

Add a cache to the sentence so next time the button is called, if the sentence had been fetched before, it doesn't need to fetch it again.


*/
import React, { useEffect, useState } from 'react';
import 'firebase/database';
import './Sentence.css';
import { getDatabase, onValue, ref } from 'firebase/database';

interface SentenceProps {
  word: string;
}

interface SentenceCache {
  [word: string]: string | null;
}

const sentenceCache: SentenceCache = {};

const Sentence: React.FC<SentenceProps> = ({ word }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [sentence, setSentence] = useState<string | null>(
    sentenceCache[word] || null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const NOT_FOUND = 'NOT FOUND';
  useEffect(() => {
    setSentence(sentenceCache[word] || null);
  }, [word]);
  const readSentence = async (sentence: string) => {
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.rate = 0.8;
    setIsPlaying(true);
    utterance.onend = () => {
        setIsPlaying(false);
    };
    speechSynthesis.speak(utterance);
  };
  const handleFetchSentence = async () => {
    setIsLoading(true);
    const database = getDatabase(window.gApp);
    const sentenceRef = ref(database, `sentences/${word}`);
    onValue(sentenceRef, (snapshot) => {
      const data = snapshot.val();
      setSentence(data ?? NOT_FOUND);
      sentenceCache[word] = data ?? NOT_FOUND;
      setIsLoading(false);
      data && readSentence(data);
      console.log('Sentence found: ', data);
    });
  }
  const handleButtonClick = async () => {
    if (sentence) {
        readSentence(sentence);
    } else {
       handleFetchSentence();
    }
  };
  return (
    <div>
      <button onClick={handleButtonClick} disabled={isLoading || sentence === NOT_FOUND} className='test-btn' id='read-sentence'>
        {isLoading ? (
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : isPlaying ? (
          <div className="voice-animation">🔊</div>
        ) : (
          'Sentence'
        )}
      </button>
      {sentence && (
        <div>
          <div className="visually-hidden">{sentence}</div>
        </div>
      )}
    </div>
  );
};

export default Sentence;
