import React, { useContext, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});

  const dispatch = useDispatch();

  const { currentUser, error, loading } = useSelector((state) => state.user);
  console.log(currentUser);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (err) {
      dispatch(signInFailure(err));
    }

  };

  return (
    <div className=' h-[80vh]'>
      <h1 className='text-3xl font-bold text-center m-10'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex justify-center items-center gap-4  flex-col'>
        <input type="email" id='email' onChange={handleChange} placeholder="Email" className='border-2 border-black p-2 m-2 w-[500px]' />
        <input type="password" id='password' onChange={handleChange} placeholder="Password" className='border-2 border-black p-2 m-2 w-[500px]' />
        <button type="submit" disabled={loading} className='border-2 border-black bg-slate-700 text-slate-50 p-2 m-2 w-[500px]'>{loading ? 'Loading...' : 'Sign In'}</button>
        <OAuth />
      </form>
      <div className='flex justify-center items-center flex-col gap-4 mt-4'>
        <div className='flex gap-4'>
          <p> Dont Have an account?</p>
          <Link to='/sign-up' className='text-blue-500'>Create an Account</Link>
        </div>
        {error && <p className='text-red-500'>{error}</p>}
      </div>
    </div>
  )
}
