import PropTypes from "prop-types";
import { getInitials } from "../../utils/help";

const ProfileInfo = ({ userInfo, logOut }) => {
  if (!userInfo) {
    return null; // or return a fallback UI
  }

  return (
    <div className="flex items-center gap-3">
      <div
        className="w-12 h-12 flex items-center justify-center rounded-full text-slate-700 font-medium bg-slate-200"
        aria-label={`Profile initials for ${userInfo.fullName}`}
        title={`Profile initials for ${userInfo.fullName}`}
      >
        {getInitials(userInfo.fullName)}
      </div>
      <div>
        <p className="text-sm font-medium">{userInfo.fullName}</p>
        <button
          className="text-slate-700 text-sm underline"
          onClick={logOut}
          aria-label="Logout"
          title="Logout"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

ProfileInfo.propTypes = {
  userInfo: PropTypes.shape({
    fullName: PropTypes.string.isRequired,
  }),
  logOut: PropTypes.func.isRequired,
};

export default ProfileInfo;
