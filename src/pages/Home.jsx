import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SwiperSlide, Swiper } from 'swiper/react';
import 'swiper/css/bundle';
import { Navigation} from 'swiper/modules';
import SwiperCore from 'swiper';
import ListingItem from '../components/ListingItem';

export default function Home() {
  SwiperCore.use([Navigation]);
  const [offerListing, setOfferListing] = useState([]);
  const [saleListing, setSaleListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);

  useEffect(() => {
    const fetchOfferListing = async () => {
      try {
        const res = await fetch('/api/listing/get?offer = true&limit=4');
        const data = await res.json();
        setOfferListing(data);
        fetchRentListing();
      } catch (err) {
        console.log(err);
      }
    }
    const fetchRentListing = async () => {
      try {
        const res = await fetch('/api/listing/get?type = rent&limit=4');
        const data = await res.json();
        setRentListing(data);
        fetchSaleListing();
      } catch (err) {
        console.log(err);
      }
    }

    const fetchSaleListing = async () => {
      try {
        const res = await fetch('/api/listing/get?type = sale&limit=4');
        const data = await res.json();
        setSaleListing(data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchOfferListing();
  }, [])
  return (
    <div>
      <div className='px-10'>
        <div className='py-28'>
          <h1 className='text-5xl font-bold'>
            Find Your Next <span className='text-blue-500'>Perfect</span>  <br />
            Place with ease
          </h1>
          <p className='py-7'>standard dummy text ever since the 1500s,
            when an unknown printer took a galley <br /> of type and scrambled it to make a type specimen book.</p>
          <Link to='/search' > <span className='text-blue-500 text-sm'>Let's Start New...</span></Link>
        </div>
      </div>
      <div>
        <Swiper navigation>
          {offerListing && offerListing.length > 0 && offerListing.map((item) => (
            <SwiperSlide key={item?._id}>
              <div style={{background: `url(${item.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover'}} className='h-[500px] w-full'>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div>
        <div className='mx-auto max-w-6xl p-3 flex flex-col gap-8 my-10'>
          {
            offerListing && offerListing.length > 0 && (
              <div>
                <div>
                  <h2 className='text-2xl font-semibold'>Recent Offers</h2>
                  <Link to={'/search?offer=true'} className='text-blue-500 text-sm'>See more offers</Link>
                  </div>
                  <div className='py-7 flex flex-wrap gap-4'>
                    {
                      offerListing.map((listing) =>{
                        return (
                        <ListingItem listing={listing} key={listing?._id} />
                      )})
                    } 
                  </div>
                </div>
            )
          }
          {
            rentListing && rentListing.length > 0 && (
              <div>
                <div>
                  <h2 className='text-2xl font-semibold'>Recent Offers for Rent</h2>
                  <Link to={'/search?type=rent'} className='text-blue-500 text-sm'>See more offers</Link>
                  </div>
                  <div className='py-7 flex flex-wrap gap-4'>
                    {
                      rentListing.map((listing) =>(
                        <ListingItem listing={listing} key={listing?._id} />
                      ))
                    } 
                  </div>
                </div>
            )
          }
          {
            saleListing && saleListing.length > 0 && (
              <div>
                <div>
                  <h2 className='text-2xl font-semibold'>Recent Offers for Sale</h2>
                  <Link to={'/search?type=sale'} className='text-blue-500 text-sm'>See more offers</Link>
                  </div>
                  <div className='py-7 flex flex-wrap gap-4'>
                    {
                      saleListing.map((listing) =>(
                        <ListingItem listing={listing} key={listing?._id} />
                      ))
                    } 
                  </div>
                </div>
            )
          }
          </div>
      </div>
    </div>
  )
}
