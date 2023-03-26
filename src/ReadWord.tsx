/* Create a React component ReadWord in TypeScript, using react-speech-kit
The input is a word and an optional sentence.
It has 3 buttons in top row: "Play word", "Sentence", "I don't know".
When the component mounts, play the word aloud in US English slowly. When user click the "Play word" button, read it aloud again.
When user clicks "I don't know", show the word in big black font under the buttons, in the center. 
The button "Sentence" should be disabled if it's empty. If it's not empty, when user click the button, read the sentence aloud.
*/
import React, { useEffect, useState } from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';

type Props = {
  word: string;
  sentence?: string;
  dontKnownHandler?: () => void;
};

const ReadWord: React.FC<Props> = ({ word, sentence, dontKnownHandler }) => {
  const [showWord, setShowWord] = useState(false);
  const { voices, speak } = useSpeechSynthesis();

  const usEnglishVoice = voices.find((voice: SpeechSynthesisVoice) => voice.lang === 'en-US');

  const handlePlayWord = () => speak({ text: word, rate: 0.7, voice: usEnglishVoice });
  const handlePlaySentence = () => sentence && speak({ text: sentence, rate: 0.7, voice: usEnglishVoice });
  const handleShowWord = () => {
    setShowWord(true);
    dontKnownHandler && dontKnownHandler();
  }
  const handleHideWord = () => setShowWord(false);
  useEffect(() => {
    // Reset the state when the input prop updates
    setShowWord(false);
    handlePlayWord();
  }, [word, sentence]);
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          display: 'inline-block',
          width: '30%',
          height: '5rem',
          border: '1px solid black',
          margin: '1rem',
          fontSize: '3rem',
          fontWeight: 'bold',
          color: 'black',
          lineHeight: '5rem',
        }}
      >
        {showWord ? word : '?'}
      </div>
      <div>
        <button type="button" className='btn btn-primary' style={{marginRight: "5px"}} onClick={handlePlayWord}>Play word</button>
        <button type="button" className='btn btn-primary' style={{marginRight: "5px"}} onClick={handlePlaySentence} disabled={!sentence}>
          Sentence
        </button>
        <button type="button" className='btn btn-primary' style={{marginRight: "5px"}} onMouseDown={handleShowWord} onMouseUp={handleHideWord}>Peak</button>
      </div>
    </div>
  );
};

export default ReadWord;
