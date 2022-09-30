import React, { useCallback, useEffect, useState } from 'react';
//@ts-ignore
import Speech from 'react-speech';
import './App.css';

function App() {
  const [words, setWords] = useState<string[]>(localStorage.getItem('spellings')?.split(',') ?? [])
  const [qNumber, setQNumber] = useState<number>(0)
  const [word, setWord] = useState<string>(words[qNumber]);
  const [newWord, setNewWord] = useState<string>('');
  const [pageStatus, setPageStatus] = useState<'start' | 'teststarted' | 'viewspellings' | 'editspellings'>('start');

  const clickNext = () => {

    if (qNumber + 2 > words.length) {
      return;
    }

    setWord(words[qNumber + 1]);
    setQNumber(qNumber + 1);

  }

  const clickPrevious = () => {

    if (qNumber === 0) {
      return;
    }

    setWord(words[qNumber - 1]);
    setQNumber(qNumber - 1);

  }

  const clickEnd = () => {
    setPageStatus('start');
    setQNumber(0);
    setWord(words[0]);
  }

  const listOfWords = words.map((word) =>
    <li className='list-group-item' key={words.indexOf(word)}>{word}</li>
  );

  const updateWord = useCallback((e: React.ChangeEvent<HTMLInputElement>, word: string) => {
    debugger;
    let currentWords = words;
    const ind = words.indexOf(word);
    currentWords[ind] = e.target.value;
    setWords(currentWords);
  }, [words]);

  const listOfWordsEdit = useCallback(() => {
    let currentWords = words;
    return currentWords.map((word) =>
      <input key={words.indexOf(word)} value={word} onChange={(e) => updateWord(e, word)} />
    )
  }, [updateWord, words]);

  const newList = () => {
    const savedWords = ''
    localStorage.setItem('spellings', savedWords);
    setWords(savedWords.split(','));
    setNewWord('');
    setPageStatus('editspellings');
  }

  const addWord = (e: React.FormEvent) => {
    e.preventDefault();
    let savedWords = localStorage.getItem('spellings') ?? '';
    if (savedWords?.length > 0) {
      savedWords += ',';
    }
    savedWords += newWord;
    localStorage.setItem('spellings', savedWords);
    setWords(savedWords.split(','));
    setNewWord('');

  }

  useEffect(() => {

    listOfWordsEdit();
  }, [listOfWordsEdit]);
  //Fascinate,Commemorate,Irrelevant,Maintenance,Disastrous,Foreign,Occurrence,Grievance,Negotiate,Aggravate
  return (
    <div className="App container">
      <div className="d-flex align-items-center p-3 my-3 text-white bg-purple rounded shadow-sm">
        <div className="lh-1">
          <h1>Sam's Spelling Bee</h1>
        </div>
      </div>

      {pageStatus === 'start' &&
        <>
          <div className='d-grid gap-2'>
            {(words.length > 0 && !(words.length === 1 && words[0] === '')) &&
              <>
                <input className='my-3 p-3 bg-body rounded shadow-sm' type='button' value="START TEST" onClick={() => setPageStatus('teststarted')} />
                <input className='btn btn-primary' type='button' value="VIEW SPELLINGS" onClick={() => setPageStatus('viewspellings')} />
              </>
            }
            <input className='btn btn-primary' type='button' value="NEW LIST" onClick={() => newList()} />

          </div>
        </>
      }

      {pageStatus === 'teststarted' &&
        <div className='d-grid gap-2'>
          <span>Question: {qNumber + 1}</span>
          <Speech class="btn btn-success" text={word} textAsButton="true" displayText="Play Spelling" />
          {qNumber > 0 &&
            <input className='btn btn-warning' type='button' value="PREVIOUS" onClick={clickPrevious} />
          }
          {qNumber + 1 < words.length &&
            <input className='btn btn-success w50' type='button' value="NEXT" onClick={clickNext} />
          }
          {qNumber + 1 >= words.length &&
            <input className='btn btn-primary' type='button' value="END TEST" onClick={() => setPageStatus('viewspellings')} />
          }
        </div>
      }

      {pageStatus === 'viewspellings' &&
        <div className='d-grid gap-2'>
          <ol className='list-group list-group-numbered'>
            {listOfWords}
          </ol>
          <input className='btn btn-primary' type='button' value="HOME" onClick={clickEnd} />
        </div>
      }

      {pageStatus === 'editspellings' &&
        <>
          {(words.length > 0 && !(words.length === 1 && words[0] === '')) &&
            <ol className='list-group list-group-numbered'>
              {listOfWords}
            </ol>
          }
          <div className='d-grid gap-2'>
            <form className="input-group" onSubmit={addWord} >
              <input type="text" value={newWord} className="form-control" onChange={(e) => { setNewWord(e.target.value) }} />
              <input className='btn btn-primary' type='submit' value="ADD" />
            </form>
            <input className='btn btn-primary' type='button' value="BACK" onClick={() => setPageStatus('start')} />
          </div>
        </>
      }

    </div>
  );
}

export default App;
