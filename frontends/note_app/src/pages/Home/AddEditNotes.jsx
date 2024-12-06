import { useState } from 'react';
import TagInput from "./../../Components/Input/TagInput";
import { MdClose } from 'react-icons/md';
import { axoinsInstance } from './../../utils/axoins';

const AddEditNotes = ({ noteData, type, onClose, getAllNotes, showToastMessage }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState("");

  const handleAddNotes = async () => {
    try {
      setError(""); // Clear any previous errors
      
      if (!title) {
        setError("Please enter a title.");
        return;
      }

      if (!content) {
        setError("Please enter content.");
        return;
      }

      if (type === "edit") {
        await editNote();
      } else {
        await addNewNote();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  const addNewNote = async () => {
    const response = await axoinsInstance.post("/add-note", {
      title,
      content,
      tags,
    });
    if (response.data && response.data.note) {
      showToastMessage("Note Added Successfully!!");
      getAllNotes();
      onClose();
    }
  };

  const editNote = async () => {
    const noteId = noteData._id;
    const response = await axoinsInstance.put(`/edit-note/${noteId}`, {
      title,
      content,
      tags,
    });
    if (response.data && response.data.note) {
      showToastMessage("Note Updated Successfully!!");
      getAllNotes();
      onClose();
    }
  };

  return (
    <div className='relative'>
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
        onClick={onClose}>
        <MdClose className='text-xl text-slate-400' />
      </button>
      <div className="flex flex-col gap-2">
        <label className="text-xs text-slate-400">Title</label>
        <input 
          type="text"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          className="text-2xl outline-none text-black"
          placeholder="Go To Gym at 5 o'clock" 
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <label className="text-xs text-slate-400">Content</label>
        <textarea
          placeholder="Content"
          value={content}
          onChange={({ target }) => setContent(target.value)}
          rows={10}
          className="text-sm w-full text-black outline-none bg-slate-50 p-2 rounded"
        />
      </div>
      <div className="mt-3">
        <label className="text-xs text-slate-400">Tags</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>
      {error && <p className='text-red-400 text-xs pt-4'>{error}</p>}
      <button className="btn-primary font-medium mt-5 p-3" onClick={handleAddNotes}>
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
}

export default AddEditNotes;
