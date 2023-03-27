import { MyDict } from "./MyDict";
import { WordList } from "./WordListPage";

declare global {
    var myDict: MyDict;
    var gWordLists: WordList[];
}