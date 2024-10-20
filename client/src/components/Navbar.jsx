import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {

    const [searchTerm, setSearchTerm] = useState('');
    const { currentUser } = useSelector((state) => state.user);

    const navigate = useNavigate();

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(searchTerm);
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFormUrl = urlParams.get('searchTerm');
        if (searchTermFormUrl) {
            setSearchTerm(searchTermFormUrl);
        }
    }, [location.search]);

    return (
        <header className='bg-slate-200 shadow-md'>
            <div className=' flex justify-between items-center max-w-6xl mx-auto p-4'>
                <h1 className='text-sm font-bold'>
                    <span className='text-slate-500'>Real</span>
                    <span className='text-slate-900'>State</span>
                </h1>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder='Search...' className='border border-slate-300 rounded-md px-4 py-1' value={searchTerm} onChange={handleSearch} />
                    <button className='bg-slate-500 text-white px-4 py-1 ml-4 rounded-md'>Search</button>
                </form>
                <ul className='flex items-center gap-4'>
                    <li className='text-sm font-bold text-slate-500 cursor-pointer hover:underline'>
                        <Link to="/">
                            Home
                        </Link>
                    </li>
                    <li className='text-sm font-bold text-slate-500 cursor-pointer hover:underline'>
                        <Link to="/about">
                            About
                        </Link>
                    </li>
                    <Link to='/profile'>
                        {currentUser ? <img src={currentUser.avtar} alt="avatar" className='w-8 h-8 rounded-full' /> : (<li className='text-sm font-bold text-slate-500 cursor-pointer hover:underline'> <Link to="/sign-in">
                            Sign in
                        </Link>
                        </li>
                        )}
                    </Link>

                </ul>
            </div>
        </header>
    )
}
