import { MyDict } from "./MyDict";
import { ReviewWordDict } from "./ReviewWords";
import { WordList } from "./WordListPage";

declare global {
    var myDict: MyDict;
    var gWordLists: WordList[];
    var gReviewWords: ?ReviewWordDict;
}