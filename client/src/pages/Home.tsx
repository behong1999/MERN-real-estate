import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Listing } from '../utils/types';
import ListingItem from '../components/ListingItem';
import axios from 'axios';

const Home = () => {
  const [offerListings, setOfferListings] = useState<Listing[]>([]);
  const [saleListings, setSaleListings] = useState<Listing[]>([]);
  const [rentListings, setRentListings] = useState<Listing[]>([]);
  SwiperCore.use([Navigation]);
  useEffect(() => {
    // Send GET request one by one
    const fetchOfferListings = () => {
      axios('/api/listing/get?offer=true&limit=4')
        .then((res) => {
          const data = res.data;
          setOfferListings(data);
          fetchRentListings();
        })
        .catch((error) => {
          console.log(error);
        });
    };
    const fetchRentListings = () => {
      axios('/api/listing/get?type=rent&limit=4')
        .then((res) => {
          const data = res.data;
          setRentListings(data);
          fetchSaleListings();
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const fetchSaleListings = () => {
      axios('/api/listing/get?type=sale&limit=4')
        .then((res) => {
          const data = res.data;
          setSaleListings(data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchOfferListings();
  }, []);
  return (
    <div>
      {/* Banner */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Looking for a better place to <br />{' '}
          <span className='text-slate-500'>Enjoy</span> your life
        </h1>
        <div className='text-gray-400 text-sm md:text-md'>
          Vin Estate is the best place to find your next home <br />
          We have various types of properties to choose from.
        </div>
        <Link
          to={'/search'}
          className='text-sm md:text-md p-3 bg-green-700 text-white max-w-min whitespace-nowrap font-bold hover:opacity-85 opacity-95 rounded-md duration-300'
        >
          Let's Get Started
        </Link>
      </div>

      {/* Swiper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide>
              <Link to={`/listing/${listing._id}`}>
                {' '}
                <div
                  style={{
                    background: `url(${listing.imageUrls[0]}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                  className='h-[500px]'
                  key={listing._id}
                ></div>
              </Link>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* Listing results for recent offer, rent and sale */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>
                Recent offers
              </h2>
              <Link
                className='text-sm text-green-700 hover:underline'
                to={'/search?offer=true'}
              >
                Show more offers
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>
                Recent places for rent
              </h2>
              <Link
                className='text-sm text-green-700 hover:underline'
                to={'/search?type=rent'}
              >
                Show more places for rent
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>
                Recent places for sale
              </h2>
              <Link
                className='text-sm text-green-700 hover:underline'
                to={'/search?type=sale'}
              >
                Show more places for sale
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
