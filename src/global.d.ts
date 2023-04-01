import { MyDict } from "./MyDict";
import { ReviewWordDict } from "./ReviewWords";
import { WordList } from "./WordListPage";
import { FirebaseApp } from "firebase/app";

declare global {
    var myDict: MyDict;
    var gWordLists: WordList[];
    var gReviewWords: ?ReviewWordDict;
    var gApp: FirebaseApp;
}