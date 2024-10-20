import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ref, getStorage, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserFailure, updateUserStart, updateUserSuccess, deleteUserFailure, deleteUserStart, signoutUserStart, signoutUserSuccess, signoutUserFailure, deleteUserSuccess } from '../redux/user/userSlice';
import { Link, useNavigate } from 'react-router-dom';


export default function Profile() {
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [errorUpload, setErrorUpload] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showErrorListing, setShowErrorListing] = useState(false);
  const [formData, setFormData] = useState({});
  const [userListing, setUserListing] = useState([]);
  const { currentUser, loading, error } = useSelector((state) => state.user);

  console.log(userListing);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const fileRef = useRef(null);
  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 && 
  // request.resource.contentType.matches('image/.*')


  const handleFileUpload = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(progress);
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },

      (error) => {
        setErrorUpload(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avtar: downloadURL });
        });
      },
    );
  }

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  }

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      navigate('/sign-in');
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  }

  const handleSignout = async () => {
    try {
      dispatch(signoutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutUserFailure(err.message));
        return;
      }
      dispatch(signoutUserSuccess(data));
      navigate('/sign-in');
    } catch (err) {
      dispatch(signoutUserFailure(err.message));
    }
  }

  const handleShowListing = async () => {
    try {
      setShowErrorListing(false);
      const res = await fetch(`/api/user/listing/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowErrorListing(true);
        return;
      }
      setUserListing(data);
    } catch (err) {
      setShowErrorListing(true);
    }
  }

  const handleDeleteListing = async (listingId) => {
    try {
      setShowErrorListing(false);
      const res = await fetch(`/api//listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        setShowErrorListing(false);
        return;
      }
      setUserListing((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (err) {
      setShowErrorListing(true);
    }
  }

  const handleUpdatedListing = async (listingId) => {
    try {
      setShowErrorListing(false);
      const res = await fetch(`/api//listing/update/${listingId}`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success === false) {
        setShowErrorListing(false);
        return;
      }
      setUserListing((prev) => prev.map((listing) => (listing._id === listingId ? data : listing)));
      navigate(`/update-listing/${listingId}`);
    }
    catch (err) {
      setShowErrorListing(true);
    }
  }


  return (
    <div>
      <h1 className='text-3xl font-bold text-center my-10'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col items-center'>
        <input type='file' onChange={(e) => setFile(e.target.files[0])} ref={fileRef} accept='image/*' className='' hidden />
        <img src={formData.avtar || currentUser.avtar} onClick={() => fileRef.current.click()} alt='profile' className='rounded-full cursor-pointer m-4 w-12 h-12' />
        {errorUpload ? (<span>error image upload</span>) : filePercentage > 0 && filePercentage < 100 ? (<span>{`Image Uploading Progress ${Math.round(filePercentage)} %`}</span>) : filePercentage === 100 ? (<span>Image Uploaded Successfully</span>) : ''}

        <input type="text" onChange={handleChange} id='username' defaultValue={currentUser.username} placeholder='Name' className='border-2 border-black rounded-md p-2 m-2 w-[500px]' />
        <input type="text" onChange={handleChange} id='email' defaultValue={currentUser.email} placeholder='Email' className='border-2 border-black rounded-md p-2 m-2 w-[500px]' />
        <input type="text" onChange={handleChange} id='password' placeholder='Password' className='border-2 border-black rounded-md p-2 m-2 w-[500px]' />
        <button type='submit' disabled={loading} className='bg-slate-700 text-slate-50 font-bold py-2 m-2 px-4 rounded w-[500px]'>{loading ? 'Loading...' : 'Update'}</button>
        <Link className='bg-green-700 text-center text-slate-50 font-bold py-2 m-2 px-4 rounded w-[500px]' to='/create-listing' >Created Listing</Link>
      </form>
      <div className='flex items-center justify-between w-[500px] mt-4 mx-auto'>
        <span onClick={handleDelete} className='text-red-700 cursor-pointer'> Delete Account</span>
        <span onClick={handleSignout} className='text-red-700 cursor-pointer'> Sign out</span>
      </div>
      <p className='text-center text-slate-700 mt-4'>{updateSuccess ? 'Profile Updated' : ''}</p>
      <div className='text-center'><button onClick={handleShowListing} className='text-center text-slate-700 mt-4'>Show Listing</button></div>
      {showErrorListing && <p className='text-center text-slate-700 mt-4'>No Listing Found</p>}
      <div className='w-[500px] mx-auto'>
        {userListing && userListing.length > 0 &&
          <div>
            <h1 className='text-center text-slate-700 text-3xl font-semibold mt-4'>Yours Listings</h1>
            {userListing.map((listing) => {
              return (
                <div className='flex items-center justify-between gap-4 my-4' key={listing._id}>
                  <div className='flex items-center gap-2'>
                    <Link to={`/listing/${listing._id}`} >
                      <img src={listing.imageUrls.map((img) => img)} alt={listing.name} className='w-[50px] h-[50px] rounded' />
                    </Link>
                    <p>{listing.name}</p>
                  </div>
                  <div className='flex gap-5'>
                    <button onClick={() => handleDeleteListing(listing._id)} className='text-slate-700'>Delete</button>
                    <button onClick={() => handleUpdatedListing(listing._id)}>Edit</button>
                  </div>
                </div>
              )
            })
            }
          </div>
        }
      </div>
    </div>

  )
}
