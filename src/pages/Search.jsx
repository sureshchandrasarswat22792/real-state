import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
export default function Search() {
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [sideBarData, setSideBarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc',
    });

    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTermFormUrl = urlParams.get('searchTerm');
        const typeFormUrl = urlParams.get('type');
        const parkingFormUrl = urlParams.get('parking');
        const furnishedFormUrl = urlParams.get('furnished');
        const offerFormUrl = urlParams.get('offer');
        const sortFormUrl = urlParams.get('sort');
        const orderFormUrl = urlParams.get('order');
        if (searchTermFormUrl || typeFormUrl || parkingFormUrl || furnishedFormUrl || offerFormUrl || sortFormUrl || orderFormUrl) {
            setSideBarData({
                searchTerm: searchTermFormUrl || '',
                type: typeFormUrl || 'all',
                parking: parkingFormUrl === 'true' ? true : false,
                furnished: furnishedFormUrl === 'true' ? true : false,
                offer: offerFormUrl === 'true' ? true : false,
                sort: sortFormUrl || 'created_at',
                order: orderFormUrl || 'desc',
            });
        }

        const fetchData = async () => {
            try{
                setLoading(true);
                const searchQuery = urlParams.toString();
                const response = await fetch(`/api/listing/get/?${searchQuery}`);
                const data = await response.json();
                setListings(data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }
        fetchData();
    }, [location.search]);


    const handleChange = (e) => {
        if (e.target.id === 'all' || e.target.id === 'sale' || e.target.id === 'rent') {
            setSideBarData({ ...sideBarData, type: e.target.id })
        }
        if (e.target.id === 'searchTerm') {
            setSideBarData({ ...sideBarData, searchTerm: e.target.value })
        }
        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setSideBarData({ ...sideBarData, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false })
        }
        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';
            setSideBarData({ ...sideBarData, sort, order })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sideBarData.searchTerm)
        urlParams.set('type', sideBarData.type)
        urlParams.set('parking', sideBarData.parking)
        urlParams.set('furnished', sideBarData.furnished)
        urlParams.set('offer', sideBarData.offer)
        urlParams.set('order', sideBarData.order)
        urlParams.set('sort', sideBarData.sort)
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    return (
        <div className='flex'>
            <div className='p-5 min-h-screen border-r w-[50%]'>
                <form onSubmit={handleSubmit} className='flex flex-col'>
                    <div className='flex items-center gap-4'>
                        <label className='whitespace-nowrap' htmlFor="searchTerm">Search Term:</label>
                        <input type="text" id="searchTerm" className='border rounded p-2 w-full' value={sideBarData.searchTerm} onChange={handleChange} placeholder='Search Term' />
                    </div>
                    <div className='flex gap-4 my-5'>
                        <h5>Type:</h5>
                        <input type="checkbox" id="all" className='w-4' onChange={handleChange} checked={sideBarData.type === 'all'} value="1" />
                        <label htmlFor="all"> Rent & Sale</label>
                        <input type="checkbox" id="sale" className='w-4' onChange={handleChange} checked={sideBarData.type === 'sale'} value="1" />
                        <label htmlFor="sale">Sale</label>
                        <input type="checkbox" id="rent" className='w-4' onChange={handleChange} checked={sideBarData.type === 'rent'} value="2" />
                        <label htmlFor="rent">Rent</label>
                        <input type="checkbox" id="offer" className='w-4' onChange={handleChange} checked={sideBarData.offer} value="2" />
                        <label htmlFor="offer">Offer</label>
                    </div>
                    <div className='flex gap-4 my-4'>
                        <h5>Amenities:</h5>
                        <input type="checkbox" id="parking" className='w-4' onChange={handleChange} checked={sideBarData.parking} value="1" />
                        <label htmlFor="parking">Parking</label>
                        <input type="checkbox" id="furnished" className='w-4' onChange={handleChange} checked={sideBarData.furnished} value="1" />
                        <label htmlFor="furnished">Furnished</label>
                    </div>
                    <div className='flex gap-4 items-center my-4'>
                        <h5>Sort:</h5>
                        <select id='sort_order' onChange={handleChange} defaultValue={'created_at_desc'} className='border p-2 rounded '>
                            <option value='regularPrice_desc'>price high to low</option>
                            <option value='regularPrice_asc'>price low to high</option>
                            <option value='createdAt_desc'>latest</option>
                            <option value='createdAt_asc'>oldest</option>
                        </select>
                    </div>
                    <div>
                        <button type='submit' className='bg-slate-700 w-full p-2 text-white rounded-lg'>SEARCH</button>
                    </div>
                </form>
            </div>
            <div className='w-full'>
                <h1 className='text-3xl font-bold border-b p-3 text-slate-700 mt-4'>Listing results:</h1>
                <div className='p-7 flex flex-wrap gap-4'>
                    {!loading && listings.length === 0 && <h1 className='text-2xl text-center font-bold text-slate-700 mt-4'>No results found</h1>}
                    {loading && <h1 className='text-2xl font-bold text-slate-700 mt-4 text-center'>Loading...</h1>}
                    {!loading && listings &&  listings.length > 0 && listings.map((list)=>(
                        <ListingItem key={list._id} listing={list} />
                    )) }
                </div>
            </div>
            </div>
    )
}
