import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact({ message, setMessage, listing }) {
    const [landloard, setLandlord] = useState(null);

    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                console.log(data);
                setLandlord(data);
            }
            catch (err) {
                console.log('error fetching landlord' + err);
            }
        }
        fetchLandlord();
    }, [listing?.userRef]);
    return (
        <div>
            <div>
                {landloard && <div>
                    <p>Contact <span>{landloard.username}</span> for <span>{landloard.username}</span></p>
                    <div> <textarea className='w-1/2 my-5 p-3 rounded-md' placeholder='message' value={message} onChange={(e) => setMessage(e.target.value)}></textarea></div>
                    <Link className='bg-slate-700 p-3 rounded-md text-white w-[50%] block mx-auto my-5' to = {`mailto:${landloard.email}?subject=Regarding ${listing.name}&body=${message}`}>Show Message</Link>
                </div>}
            </div>
        </div>
    )
}
