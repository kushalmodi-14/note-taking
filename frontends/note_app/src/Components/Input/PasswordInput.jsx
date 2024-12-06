import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const PasswordInput = ({ value, onChange, placeholder = "Password" }) => {  // Default parameter used here
  const [showPassword, setShow] = useState(false);

  const toggleShow = () => {
    setShow(!showPassword);
  };

  return (
    <div className='flex items-center bg-transparent mb-2 border-[1.5px] px-5 rounded'>
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className='w-full text-sm bg-transparent py-3 mr-3 rounded outline-none'
        aria-label={showPassword ? "Hide password" : "Show password"}
      />
      
      <button
        onClick={toggleShow}
        aria-label={showPassword ? "Hide password" : "Show password"}
        className='cursor-pointer text-primary'
      >
        {showPassword ? <FaRegEye size={22} /> : <FaRegEyeSlash size={22} className='text-slate-400' />}
      </button>
    </div>
  );
};

PasswordInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default PasswordInput;
