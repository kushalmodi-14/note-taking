// import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PasswordInput from './../../Components/Input/PasswordInput'
import Navbar from '../../Components/Navbar/Navbar'
import { useState } from 'react'
import { emailValidate } from '../../utils/help'
import { axoinsInstance } from './../../utils/axoins'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!emailValidate(email)) {
      setError("Not Valid Email, please enter email properly");
      return;
    }

    if (!password) {
      setError("Please enter password");
      return;
    }

    setError("");

    // Login API Call
    try {
      const response = await axoinsInstance.post("/login", {
        email: email,
        password: password,
      });

      // Handle successful response
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      // Error handling
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);

      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl mb-7">Login</h4>

            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full text-sm bg-transparent px-5 py-3 rounded mb-3 border-[1.5px] outline-none'
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className='text-xs text-red-300 pb-1'>{error}</p>}

            <button type="submit" className='w-full text-sm bg-primary p-2 text-white rounded my-1 hover:bg-blue-600'>Login</button>

            <p className='text-sm text-center mt-2'>
              Not registered yet?
              <Link to="/signup" className='text-primary font-medium underline'>Create An Account</Link>
            </p>

          </form>
        </div>
      </div>
    </>
  );
};


export default Login