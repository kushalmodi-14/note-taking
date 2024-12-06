import { MdOutlinePushPin, MdCreate, MdDelete } from "react-icons/md";
import moment from "moment";
import PropTypes from "prop-types";

const NoteCard = ({ title, date, content, tags, isPinned, onEdit, onDelete, onPinNote }) => {
  return (
    <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-sm font-medium">{title}</h6>
          <span className="text-xs text-slate-500">{moment(date).format('Do MMM YYYY')}</span>
        </div>
        <button
          aria-label={isPinned ? "Unpin note" : "Pin note"}
          onClick={onPinNote}
          className="icon-btn"
          title={isPinned ? "Unpin note" : "Pin note"}
        >
          <MdOutlinePushPin className={isPinned ? 'text-primary' : 'text-slate-300'} />
        </button>
      </div>
      
      <p className="text-xs mt-2 text-slate-600 font-semibold">{content?.slice(0, 60)}{content?.length > 60 && '...'}</p>
      
      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-slate-500">
          {tags.map((item, index) => (
            <span key={index} className="mr-1">#{item}</span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button aria-label="Edit note" onClick={onEdit} className="icon-btn" title="Edit note">
            <MdCreate className="hover:text-green-300" />
          </button>
          <button aria-label="Delete note" onClick={onDelete} className="icon-btn" title="Delete note">
            <MdDelete className="hover:text-red-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

NoteCard.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  content: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  isPinned: PropTypes.bool,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onPinNote: PropTypes.func.isRequired,
};

NoteCard.defaultProps = {
  content: '',
  tags: [],
  isPinned: false,
};

export default NoteCard;
