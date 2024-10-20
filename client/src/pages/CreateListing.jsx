import React, { useState } from 'react'
import { app } from '../firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        regularPrice: 50,
        discountedPrice: 0,
        bathrooms: 1,
        bedrooms: 1,
        furnished: false,
        parking: false,
        type: 'rent',
        offer: false,
        userref: ''
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();






    const handleImageSubmit = (e) => {
        if (images.length > 0 && images.length + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);

            const promises = [];
            for (let i = 0; i < images.length; i++) {
                promises.push(storeImage(images[i]));
            }
            Promise.all(promises).then((urls) => {
                setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
                setImageUploadError(false);
                setUploading(false);
            }).catch((error) => {
                setImageUploadError('Please select between 1 and 6 images');
                setUploading(false);
            })
        }
        else {
            setImageUploadError('Please select between 1 and 6 images');
            setUploading(false);
        }
    };

    const storeImage = async (image) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + image.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, image);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                },
                (error) => reject(error),
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => resolve(downloadURL));
                }
            );
        });
    };

    const handleImageDelete = (ind) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== ind)
        })
    }

    const handleChange = (e) => {
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({ ...formData, type: e.target.id })
        }
        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setFormData({ ...formData, [e.target.id]: e.target.checked })
        }
        if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData({ ...formData, [e.target.id]: e.target.value })
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageUrls.length < 1) return setError('Please upload at least one image');
            if (formData.regularPrice < formData.discountedPrice) return setError('Discounted price cannot be greater than regular price');
            setLoading(true);
            setError(false);
            const res = await fetch('/api/listing/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,

                })
            }
            );
            const data = await res.json();
            setLoading(false);
            if (data.success === false) {
                setError(data.message);
            }
            navigate(`/listing/${data._id}`);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }



    return (
        <div className='my-10 w-[65%] mx-auto'>
            <main>
                <h1 className='font-bold text-center mb-7 text-3xl'>Create a Listing</h1>
                <form onSubmit={handleSubmit}>
                    <div className='flex gap-7'>
                        <div className='flex flex-col gap-4 flex-1'>
                            <input type="text" placeholder='Name' value={formData.name} onChange={handleChange} className='my-2 p-2 border border-gray-300 rounded-md' id='name' maxLength='62' minLength='10' required />
                            <textarea type="textarea" onChange={handleChange} value={formData.description} placeholder='description' className='my-2 p-2 border border-gray-300 rounded-md' id='description' required />
                            <input type="text" onChange={handleChange} value={formData.address} placeholder='address' className='my-2 p-2 border border-gray-300 rounded-md' id='address' />
                            <div className='flex gap-6'>
                                <div className='flex gap-2'>
                                    <input type='checkbox' onChange={handleChange} checked={formData.type === 'sale'} id='sale' className='w-5 h-5' />
                                    <label htmlFor='sale' className='text-sm'>Sale</label>
                                </div>
                                <div className='flex gap-2'>
                                    <input type='checkbox' onChange={handleChange} id='rent' checked={formData.type === 'rent'} className='w-5 h-5' />
                                    <label htmlFor='rent' className='text-sm'>Rent</label>
                                </div>
                                <div className='flex gap-2'>
                                    <input type='checkbox' onChange={handleChange} id='parking' checked={formData.parking} className='w-5 h-5' />
                                    <label htmlFor='parking' className='text-sm'>Parking Spot</label>
                                </div>
                                <div className='flex gap-2'>
                                    <input type='checkbox' onChange={handleChange} id='furnished' checked={formData.furnished} className='w-5 h-5' />
                                    <label htmlFor='furnish' className='text-sm'>Furnished</label>
                                </div>
                                <div className='flex gap-2'>
                                    <input type='checkbox' onChange={handleChange} id='offer' checked={formData.offer} className='w-5 h-5' />
                                    <label htmlFor='offer' className='text-sm'>Offer</label>
                                </div>
                            </div>
                            <div className='flex gap-6 items-center my-4'>
                                <div className='flex gap-2'>
                                    <input type='number' onChange={handleChange} className='w-12 h-8' id='bedrooms' value={formData.bedrooms} min='1' max='10' required />
                                    <span>Beds</span>
                                </div>
                                <div className='flex gap-2'>
                                    <input type='number' onChange={handleChange} className='w-12 h-8' value={formData.bathrooms} id='bathrooms' min='1' max='10' required />
                                    <span>Baths</span>
                                </div>
                            </div>
                            <div className='flex gap-6 flex-col my-4'>
                                <div className='flex gap-2'>
                                    <input type='number' className='w-16 h-8 rounded' onChange={handleChange} value={formData.regularPrice} id='regularPrice' min='50' max='100000' />
                                    <span>Regular Price</span>
                                </div>
                                {formData.offer &&
                                    <div className='flex gap-2'>
                                        <input type='number' className='w-16 h-8 rounded' onChange={handleChange} id='discountedPrice' value={formData.discountedPrice} min='0' max='100000' />
                                        <span>Discounted Price</span>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className='flex flex-col gap-1 flex-1'>
                            <p className='font-extrabold'>Images:</p>
                            <div className='flex items-center gap-1'>
                                <input type='file' onChange={(e) => setImages(e.target.files)} className='my-1 p-1 border border-gray-300 rounded-lg' id='images' accept='image/*' multiple />
                                <button type='button' disabled={uploading} onClick={handleImageSubmit} className=' text-green-700 border border-green-700 rounded px-8 py-1'>{uploading ? 'Uploading...' : 'Upload'}</button>
                            </div>
                            {imageUploadError && <p className='text-red-500'>{imageUploadError}</p>}
                            <div className='flex flex-col gap-4'>
                                {formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => {
                                    return (
                                        <div key={index} className='flex justify-between items-center p-3 border border-gray-300 rounded-lg'>
                                            <img src={url} alt='listing' className='w-20 h-20 object-contain rounded-lg' />
                                            <button type='button' onClick={() => handleImageDelete(index)} className='text-red-500'>Delete</button>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className='text-center mt-4'>
                        <button type='submit' disabled={loading || uploading} className='bg-slate-700 text-white border rounded px-8 py-3 w-full'>{loading ? 'Creating...' : 'create listing'}</button>
                        {error && <p className='text-red-500'>{error}</p>}
                    </div>
                </form>
            </main>
        </div>
    )
}
