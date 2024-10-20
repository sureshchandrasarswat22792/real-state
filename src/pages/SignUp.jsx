import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup',
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
        setErrors(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      console.log(data);
      setErrors(null);
      navigate('/sign-in');
    } catch (err) {
      setLoading(false);
      console.log(err.message);
      setErrors(err.message);
    }

  };

  return (
    <div className=' h-[80vh]'>
      <h1 className='text-3xl font-bold text-center m-10'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex justify-center items-center gap-4  flex-col'>
        <input type="text" id='username' onChange={handleChange} placeholder="Username" className='border-2 border-black p-2 m-2 w-[500px]' />
        <input type="email" id='email' onChange={handleChange} placeholder="Email" className='border-2 border-black p-2 m-2 w-[500px]' />
        <input type="password" id='password' onChange={handleChange} placeholder="Password" className='border-2 border-black p-2 m-2 w-[500px]' />
        <button type="submit" disabled={loading} className='border-2 border-black bg-slate-700 text-slate-50 p-2 m-2 w-[500px]'>{loading ? 'Loading...' : 'Sign Up'}</button>
        <OAuth />
      </form>
      <div className='flex justify-center items-center flex-col gap-4 mt-4'>
        <div className='flex gap-4'>
          <p>Have an account?</p>
          <Link to='/sign-in' className='text-blue-500'>Login</Link>
        </div>
        {errors && <p className='text-red-500'>{errors}</p>}
      </div>
    </div>
  )
}
