import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Listing, User } from '../utils/types';
import axios from 'axios';

interface ContactProps {
  listing: Listing;
}

const Contact = ({ listing }: ContactProps) => {
  const [landlord, setLandlord] = useState<User | null>(null);
  const [message, setMessage] = useState('');
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      axios(`/api/user/${listing.userRef}`)
        .then((res) => {
          const data = res.data;
          setLandlord(data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchLandlord();
  }, [listing.userRef]);
  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-2'>
          <p>
            Contact <span className='font-semibold'>{landlord.username}</span>{' '}
            for{' '}
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name='message'
            id='message'
            rows={2}
            value={message}
            onChange={onChange}
            placeholder='Enter your message here...'
            className='w-full border p-3 rounded-lg'
          ></textarea>

          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className='bg-slate-700 font-semibold text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;
