/*
Create a React component ManageWordList that displays a list of words and allows the user to add, modify and remove words from the list.
The component should take a wordListId prop that is the id of the word list, and userId prop that is the id of the user.
It tries to load the word list from the database and displays a loading message while it is loading.
If wordListId is not null, fetch it from Firebase database /users/{userId}/wordlists/{wordlistId} and display the name of the word list.
If it can't find the word list name, show an error message.
If input props wordListId is null, show an inputbox to enter the name of the word list. Once entered, check if the name is already exist in the database. If it is, show an error message. If it is not, create a new item in the database and set the wordListId prop to the id of the new word list. The id is the name in lower case and replace all spaces with dashes.
If wordListId is not null, try to fetch the words from Firebase database /users/{userId}/wordlist/{wordlistId}/. The words are stored as an array of strings.
If it can't find the words, show an error message.
If it finds the words, display them in a list. Put a edit and a delete button next to each word.
Below the list, put an input box and a button to add a new word to the list. 
Below it, put a button to save the word list. When the user clicks the button, save the word list to the database /users/{userId}/wordlist/{wordlistId}/.

Create a React component WordListCRUD that displays a list of words and allows the user to add, modify and remove words from the list.
The component should take wordList prop that is an array of strings and onSaveHandler. 
Build with Bootstrap classes.
*/

export {}