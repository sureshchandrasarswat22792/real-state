import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Profile from './pages/Profile';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Navbar from './components/Navbar';
import PrivateRoutes from './components/PrivateRoutes';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';


function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/listing/:listingId" element={<Listing />} />
          <Route path="/search" element={<Search />} />
          <Route element={<PrivateRoutes />} >
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/update-listing/:id" element={<UpdateListing />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
