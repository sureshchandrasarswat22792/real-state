import React from 'react'
import { Link } from 'react-router-dom';
import real_state from '../assets/real_state.jpg';

export default function ListingItem({ listing }) {
    console.log(listing);
    return (
        <div className='bg-white shadow-md w-[32%] rounded-lg p-4 mb-4'>
            <Link to={`/listing/${listing._id}`}>
                <img src={listing?.imageUrls?.map(url=>url || real_state)} alt='' className='h-[220px] w-full object-cover' />
            </Link>
            <div className='p-3'>
            <p className='text-lg font-semibold text-slate-700 truncate'>{listing.name}</p>
            <div>
                <p className='my-2'>{listing.address}</p>
            </div>
            <p className='my-2'>
            {listing.description}
            </p>
            <p className='my-2'>
               $ {listing.offer ? listing.discountedPrice : listing.regularPrice}
               {listing.type === 'rent' &&  ' / month'}
            </p>
            <div className='flex gap-7'>
                <p>{listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}</p>
                <p>{listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}</p>
            </div>
            </div>
        </div>
    )
}
