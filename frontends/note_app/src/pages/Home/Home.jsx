import { useEffect, useState } from 'react';
import { MdAdd } from "react-icons/md";
import Navbar from "../../Components/Navbar/Navbar";
import NoteCard from "./../../Components/Cards/NoteCard";
import AddEditNotes from "./AddEditNotes";
import Modal from 'react-modal';
import Toast from '../../Components/ToastMessage/Toast';
import { useNavigate } from 'react-router-dom';
import { EmptyCard } from "./../../Components/Cards/EmptyCard";
import AddNote from "./../../assets/Image/image.svg";
import noDataImg from "./../../assets/Image/404-error.png";
import { axoinsInstance } from '../../utils/axoins';

Modal.setAppElement('#root');

const Home = () => {
  const [openAddEditModel, setOpenEditModel] = useState({ isShown: false, type: "add", data: null });
  const [showToastMsg, setToastMsg] = useState({ isShown: false, message: "", type: "add" });
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [isSearch, setSearch] = useState(false);
  const [allNotes, setAllNotes] = useState([]);
  const setError = useState("");


  const handleEdit = (noteDetails) => {
    setOpenEditModel({ isShown: true, data: noteDetails, type: "edit" });
  };

  const handleCloseToast = () => {
    setToastMsg({ isShown: false, message: "" });
  };

  const deleteNote = async (data) => {
    const noteId = data._id;
    try {
      const response = await axoinsInstance.delete("/delete-note/" + noteId);
      if (response.data && !response.data.error) {
        showToastMessage("Note Deleted Successfully!!", 'delete');
        getAllNotes();
      }
    } catch (error) {
      console.log("An unexpected error occurred while deleting the note.");
    }
  };

  const getUserInfo = async () => {
    try {
      const response = await axoinsInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      handleAuthError(error);
    }
  };

  const getAllNotes = async () => {
    try {
      const response = await axoinsInstance.get("/get-all-notes");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error occurred while fetching notes.");
    }
  };

  const onSearchNote = async (query) => {
    try {
      const response = await axoinsInstance.get("/search-note", { params: { query } });
      if (response.data && response.data.notes) {
        setSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error occurred while searching for notes.");
    }
  };

  const showToastMessage = (message, type) => {
    setToastMsg({ isShown: true, message, type });
  };

  const updatePinned = async (noteData) => {
    const noteId = noteData._id;
    try {
      const response = await axoinsInstance.put(`/update-note-pinned/${noteId}`, { isPinned: !noteData.isPinned });
      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully!!");
        getAllNotes();
      }
    } catch (error) {
      console.log("An unexpected error occurred while updating note pin status.");
    }
  };


  const handleAuthError = (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      navigate("/login");
    } else {
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  const handleClearSearch = () => {
    setSearch(false);
    getAllNotes();
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
  }, []);

  return (
    <>
      <Navbar 
      userInfo={userInfo} 
      handleClearSearch={handleClearSearch} 
      onSearchNote={onSearchNote} />

      <div className="container mx-auto">
        {allNotes.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 mt-8">
            {allNotes.map((item) => (
              <NoteCard
                key={item._id}
                title={item.title}
                date={item.createOn}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => handleEdit(item)}
                onDelete={() => deleteNote(item)}
                onPinNote={() => updatePinned(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            imgSrc={isSearch ? noDataImg : AddNote}
            message={isSearch ? `No Notes Found!!` : `Start creating notes! Click 'ADD' button to note down your ideas.`}
          />
        )}
      </div>
      <button
        onClick={() => setOpenEditModel({ isShown: true, type: "add", data: null })}
        className="h-16 w-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
      <Modal
        isOpen={openAddEditModel.isShown}
        onRequestClose={() => setOpenEditModel({ isShown: false, type: "add", data: null })}
        className="w-[40%] max-h-3/4 bg-white rounded-sm mx-auto mt-14 p-5 overflow-scroll"
        contentLabel=""
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)" } }}
      >
        <AddEditNotes
          type={openAddEditModel.type}
          noteData={openAddEditModel.data}
          getAllNotes={getAllNotes}
          onClose={() => setOpenEditModel({ isShown: false, type: "add", data: null })}
          showToastMessage={showToastMessage}
        />
      </Modal>
      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
