import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css/bundle';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';

export default function Listing() {
    SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [contact, setContact] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const { listingId } = useParams();
    const { currentUser } = useSelector((state) => state.user);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${listingId}`)
                const data = await res.json();
                if (data.success === false) {
                    setError(data.message);
                }
                setListing(data);
                setLoading(false);
                setError(null);
            }
            catch (err) {
                setError(err);
                setLoading(false);
            }
        }
        fetchData();
    }, [listingId]);

    const handleContactLandlord = () => {
        setContact(true);
    }
    return (
        <div>
            {loading && <p className='text-center text-3xl font-bold my-5'>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {listing && (
                <div>
                    <Swiper navigation>
                        {listing?.imageUrls?.map((url) => (
                            <SwiperSlide key={url}>
                                <div style={{ background: `url(${url}) center no-repeat`, backgroundSize: 'cover' }} alt='na' className='h-[550px]'>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
            <div className='my-7 text-center'>
                <h1 className='text-2xl font-bold text-center'>{listing?.name}</h1>
                <h6 className='my-5'>new listing</h6>
                <p className='text-xl font-bold text-center'>${listing?.regularPrice}</p>
                <p className='text-white bg-red-900 w-full max-w-[200px] p-1 mx-auto my-7 rounded-md'>
                    {listing?.type === 'sale' ? 'For Sale' : 'For Rent'}
                </p>
                <p className='text-lg text-center'><b>address-</b>{listing?.address}</p>
                {
                    listing?.offer && <p className='text-white bg-red-700 w-full max-w-[200px] p-1 mx-auto my-7 rounded-md'><b>Price</b> ${listing?.regularPrice - listing?.discountedPrice} off</p>
                }
                <p className='w-1/2 mx-auto my-5'><b>Description-</b> {listing?.description}</p>
                {currentUser && listing?.userRef !== currentUser?._id && !contact && (
                    <button onClick={handleContactLandlord} className='bg-slate-700 p-3 rounded-md text-white w-1/2 mx-auto my-5'>Contact Landloard</button>
                )}
                {
                    contact && <Contact listing={listing} message={message} setMessage={setMessage} />
                }
            </div>
        </div>
    )
}
