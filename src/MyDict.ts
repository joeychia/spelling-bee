/*
Create a typescript class MyDict. It has a dict of words. Each word has a score, firstTested and lastTested. firstTested and lastTested have time and result (boolean)
score, firstTested and lastTested should be optional and have a setter for certain word in the class.
*/

import { Database, onValue, ref, set } from "firebase/database";

export interface Word {
    score?: number;
    firstTested?: { time: Date; result: boolean };
    lastTested?: { time: Date; result: boolean };
  }

  export class MyDict {
    private dict: Map<string, Word> = new Map();
    static defaultScore = 100;

    MyDict() {
      this.restoreFromLocal();
    }

    setWordScore(word: string, score?: number): void {
      const existingWord = this.dict.get(word);
      if (existingWord) {
        existingWord.score = score;
      } else {
        this.dict.set(word, { score });
      }
    }

    setWordFirstTested(word: string, firstTested?: { time: Date; result: boolean }): void {
      const existingWord = this.dict.get(word);
      if (existingWord) {
        existingWord.firstTested = firstTested;
      } else {
        this.dict.set(word, { firstTested });
      }
    }

    setWordLastTested(word: string, lastTested?: { time: Date; result: boolean }): void {
      const existingWord = this.dict.get(word);
      if (existingWord) {
        existingWord.lastTested = lastTested;
      } else {
        this.dict.set(word, { lastTested });
      }
    }

    getWord(word: string): Word | undefined {
      return this.dict.get(word);
    }

    getWordScore(word: string): number {
      const existingWord = this.dict.get(word);
      return existingWord && existingWord.score ? existingWord.score : MyDict.defaultScore;
    }

    changeWordScore(word: string, delta: number): void {
      const existingWord = this.dict.get(word);
      if (existingWord && existingWord.score) {
        existingWord.score += delta;
      } else {
        this.dict.set(word, { score: MyDict.defaultScore + delta});
      }
    }

    saveToLocal(): void {
      localStorage.setItem('myDict', JSON.stringify(Array.from(this.dict.entries())));
    }

    restoreFromLocal(): void {
      const dictString = localStorage.getItem('myDict');
      if (dictString) {
        const dictEntries = JSON.parse(dictString) as [string, Word][];
        this.dict = new Map(dictEntries);
      }
    }

    saveToDatabase(userId: string, db: Database): void {
      const testResult = JSON.stringify(Array.from(this.dict.entries()));
      set(ref(db, `users/${userId}/testresult/`), testResult).then(()=> {
        console.log(`Test result is saved to database: ${testResult}`)
      });
    }

    restoreFromDatabase(userId: string, db: Database): void {
      const testResultRef = ref(db, `users/${userId}/testresult`);

      onValue(testResultRef, (snapshot) => {
        const data = snapshot.val() as string;
        if (data) {
          const dictEntries = JSON.parse(data) as [string, Word][];
          this.dict = new Map(dictEntries);
          console.log(`Test result is restored from database: ${this.dict}`);
        }
      });

    }
  }
