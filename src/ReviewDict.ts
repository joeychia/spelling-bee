import { Database, set, ref, onValue } from "firebase/database";
import { Word } from "./MyDict";

/*
Create a typescript class ReviewDict. The key is date. The value is a set of unique words.
Each words has an associated listName, and all reviewed dates.
The class has a method to add a word, for a given date, add word, listName, reviewedDates (including the given date). If the word already exists, add the given date to the reviewedDates.
The class has a method to get all words on a date.
The class has a method to get associated listNames and all reviewed dates of all word, on a given date.

*/
export interface ReviewType {
  word: string;
  // listName: string;
  // reviewedDates: string[]
}

export interface ReviewWordDict {
  [date: string]: ReviewType[];
}
export class ReviewDict {
  private data: ReviewWordDict;

  constructor() {
    const storedData = localStorage.getItem("reviewDict");
    this.data = storedData ? JSON.parse(storedData) : {} as ReviewWordDict;
  }

  public addWord(word: string, listName: string): void {
    const today = new Date();
    const todayString = today.toISOString().slice(0,10);
    const todayPlus1 = new Date(today.getTime() + 86400000*1).toISOString().slice(0,10);
    const todayPlus3 = new Date(today.getTime() + 86400000*3).toISOString().slice(0,10);
    const todayPlus7 = new Date(today.getTime() + 86400000*7).toISOString().slice(0,10);
    this.addWordOnDate(todayString, word, listName, todayString);
    this.addWordOnDate(todayPlus1, word, listName, todayString);
    this.addWordOnDate(todayPlus3, word, listName, todayString);
    this.addWordOnDate(todayPlus7, word, listName, todayString);
  }
  public addWordOnDate(date: string, word: string, listName: string, reviewedDate: string): void {
    let wordInfoArr = this.data[date];

    if (!wordInfoArr) {
      wordInfoArr = [];
      this.data[date] = wordInfoArr;
    }

    const wordIndex = wordInfoArr.findIndex(w => w.word === word);
    if (wordIndex === -1) {
      wordInfoArr.push({ word });
    }
  }

  public getWordsOnDate(date: string): Set<string> {
    const wordInfoArr = this.data[date];
    if (!wordInfoArr) {
      return new Set<string>();
    }
    return new Set<string>(wordInfoArr.map(w => w.word));
  }

  public getWordInfoOnDate(date: string): ReviewType[] {
    const wordInfoArr = this.data[date];
    if (!wordInfoArr) {
      return [];
    }
    return wordInfoArr;
  }

  public save(): void {
    localStorage.setItem("reviewDict", JSON.stringify(this.data));
  }

  public saveToDatabase(userId: string, db: Database): void {
    const reviewList = JSON.stringify(this.data);
    set(ref(db, `users/${userId}/reviewlist/`), reviewList).then(()=> {
      console.log(`Review list is saved to database: ${reviewList}`)
    });
  }

  public restoreFromDatabase(userId: string, db: Database): void {
    const reviewListRef = ref(db, `users/${userId}/reviewlist`);

    onValue(reviewListRef, (snapshot) => {
      const data = snapshot.val() as string;
      if (data) {
        this.data = data ? JSON.parse(data) : {} as ReviewWordDict;
        console.log(`Review list is restored from database: ${data}`);
      }
    });

  }
}
