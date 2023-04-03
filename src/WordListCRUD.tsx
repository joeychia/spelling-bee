import { useState, useEffect } from 'react';

type WordListCRUDProps = {
  wordList: string[];
  onSaveHandler: (newList: string[]) => void;
};

const WordListCRUD = ({ wordList: propList, onSaveHandler }: WordListCRUDProps) => {
  const [list, setList] = useState<string[]>(propList);
  const [newWords, setNewWords] = useState<string[]>([]);

  useEffect(() => {
    setList(propList);
  }, [propList]);

  const handleSave = () => onSaveHandler(list);
  const handleAdd = () => {
    const words = newWords.map((word) => word.trim());
    setList([...list, ...words]);
    setNewWords([]);
  };
  const handleDelete = (i: number) => setList(list.filter((w, index) => index !== i));

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    setNewWords(value ? value.split(/[,\s]+/).map((word) => word.trim()) : []);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <h3>Word List</h3>
          <ul className="list-group">
            {list.map((word, index) => (
              <li className="list-group-item" key={index}>
                <div className="d-flex justify-content-between align-items-center">
                  {word}
                  <button className="btn btn-outline-danger btn-sm" type="button" onClick={() => handleDelete(index)}>Delete</button>
                </div>
              </li>
            ))}

          </ul>
          <button className="btn btn-primary mt-3" type="button" onClick={handleSave}>Save Changes</button>
        </div>
        <div className="col-md-6">
          <h3>Add Words</h3>
          <div className="input-group mb-3">
            <input type="text" className="form-control" onChange={handleInputChange} />
            <button className="btn btn-primary" type="button" onClick={handleAdd}>Add</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordListCRUD;
