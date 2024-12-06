import PropTypes from "prop-types";
import { useEffect } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { LuCheck } from "react-icons/lu";

const Toast = ({ isShown, message, type, onClose }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose();
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [onClose]);

  return (
    <div className={`absolute top-20 right-6 transition-all duration-400 ${!isShown || !message ? "opacity-0" : "opacity-100"}`}>
      {message && (
        <div className={`min-w-52 bg-white border shadow-2xl rounded-sm after:w-[5px] after:h-full ${type === "delete" ? "after:bg-red-500" : "after:bg-green-400"} after:absolute after:left-0 after:top-0 after:rounded-l-lg`}>
          <div className="flex items-center px-4 py-2 gap-3">
            <div className={`w-10 h-10 flex justify-center items-center rounded-full ${type === "delete" ? "bg-red-200" : "bg-green-100"}`} aria-hidden="true">
              {type === "delete" ? <MdDeleteOutline className="text-xl text-red-400" /> : <LuCheck className="text-xl text-green-400" />}
            </div>
            <p className="text-sm text-slate-800">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

Toast.propTypes = {
  isShown: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["delete", "success"]).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Toast;
