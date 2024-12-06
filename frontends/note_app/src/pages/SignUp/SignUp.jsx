import { useState } from 'react';
import {Link} from 'react-router-dom'
import { emailValidate } from '../../utils/help';
import PasswordInput from './../../Components/Input/PasswordInput'
import Navbar from '../../Components/Navbar/Navbar'
import { useNavigate } from 'react-router-dom';
import { axoinsInstance } from '../../utils/axoins';

const SignUp = () => {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if(!name){
      setError("Enter Your Name")
      return ;
    }

    if (!emailValidate(email)) {
      setError("Enter Valid Email")
      return ;
    }

    if (!password) {
      setError("Enter Password Properly..")
      return ;
    }

    setError("")

    
    // SignUp API Call
    try {
      const response = await axoinsInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });

      // Handle Successful regitration response
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }

      if (response.data && response.data.error) {
        setError(error.response.message)
      }
    }
    catch (error) {
      // Error handle
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
      else {
        setError("An unexpected error occurred");
      }
    }

  };

  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleSignup}>
            <h4 className="text-2xl mb-7">Sign Up </h4>

            <input type="text"
              placeholder="Name"
              className='w-full text-sm bg-transparent px-5 py-3 rounded mb-3 border-[1.5px] outline-none'
              value={name}
              onChange={(e) => { setName(e.target.value) }}
            />

            <input type="text"
              placeholder="Email"
              className='w-full text-sm bg-transparent px-5 py-3 rounded mb-3 border-[1.5px] outline-none'
              value={email}
              onChange={(e) => { setEmail(e.target.value) }}
            />

            <PasswordInput
              placeholder={password}
              value={password}
              onChange={(e) => { setPassword(e.target.value) }} />

            {error && <p className='text-xs text-red-300 pb-1'>{error}</p>}

            <button type="submit" className='w-full text-sm bg-primary p-2 text-white rounded my-1 hover:bg-blue-600'>
              Create Account
            </button>

            <p className='text-sm text-center mt-2'>
              Alderdy have a Account?{" "}
              <Link to="/login" className='text-primary font-medium underline'>Login</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default SignUp