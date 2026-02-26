'use client';
import {useCallback, useState} from 'react';

function uuidv4() {
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16),
  );
}

type NoteID = ReturnType<typeof uuidv4>;

interface Note {
  id: NoteID;
  title: string;
  content: string;
  tags: string[];
}

const Tag = ({name}: {name: string}) => (
  <span className="px-2 py-1 text-sm rounded bg-grey-200 text-grey-800">
    {name}
  </span>
);

const NotesHome = () => {
  const [notes, setNotes] = useState<Record<string, Note>>({});
  const [selectedNoteId, setSelectedNoteId] = useState<NoteID | null>(null);
  const selectedNote = selectedNoteId ? notes[selectedNoteId] : null;

  const addNewNote = useCallback((newNote?: Partial<Note>) => {
    const id = uuidv4();
    setNotes((notes) => {
      return {
        ...notes,
        [id]: {id, title: '', content: '', tags: [], ...newNote},
      };
    });
    setSelectedNoteId(id);
  }, []);

  return (
    <div className="flex flex-row justify-between p-4 w-svw h-svh gap-4">
      <div className="flex flex-col gap-4 border w-96">
        {Object.values(notes).map((note) => (
          <div
            key={note.id}
            className={[
              'flex flex-col gap-2 p-4 border',
              note.id === selectedNoteId ? 'bg-gray-200' : '',
            ].join(' ')}
            onClick={() => setSelectedNoteId(note.id)}
          >
            <h2 className="text-xl font-bold">{note.title || 'Untitled'}</h2>
            <p className="text-md text-gray-300 max-h-36 text-ellipsis overflow-hidden">
              {note.content}
            </p>
            <div className="flex flex-row gap-2">
              {note.tags.map((tag, i) => (
                <Tag key={i} name={tag} />
              ))}
            </div>
          </div>
        ))}
        <div
          className="self-center justify-self-center p-4 font-bold"
          onClick={() => addNewNote()}
        >
          Add a new note...
        </div>
      </div>
      <div className="flex flex-col items-start gap-2 grow">
        <div className="flex flex-row gap-2">
          <input
            type="text"
            placeholder="Title"
            className="border p-2"
            value={selectedNote?.title || ''}
            onChange={(e) =>
              selectedNote != null && selectedNoteId != null
                ? setNotes((notes) => ({
                    ...notes,
                    [selectedNoteId]: {
                      ...selectedNote,
                      dummy: console.log(e.target.value),
                      title: e.target.value,
                    },
                  }))
                : addNewNote({title: e.target.value})
            }
          />
          <input
            type="text"
            placeholder="Tags (comma separated)"
            className="border p-2"
            value={selectedNote?.tags.join(', ') || ''}
          />
        </div>
        <textarea
          placeholder="Type your notes here..."
          className="border p-2 flex-1 w-full"
          value={selectedNote?.content || ''}
          onChange={(e) =>
            selectedNote != null && selectedNoteId != null
              ? setNotes((notes) => ({
                  ...notes,
                  [selectedNoteId]: {
                    ...selectedNote,
                    content: e.target.value,
                  },
                }))
              : addNewNote({content: e.target.value})
          }
        />
      </div>
    </div>
  );
};

export default NotesHome;
