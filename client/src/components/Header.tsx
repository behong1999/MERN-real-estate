import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useEffect, useState } from 'react';

const Header = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const query = urlParams.toString();
    navigate(`/search?${query}`);
  };

  // Get the search term from the URL to the Search Bar
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, []);

  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to={'/'}>
          <h1 className='font-bold text-sm sm:text-xl flex'>
            <span className='text-slate-500'>Vin</span>
            <span className='text-slate-700'>Estate</span>
          </h1>
        </Link>
        {/* SEARCH BAR */}
        <form
          onSubmit={handleSubmit}
          className='flex bg-slate-100 p-3 rounded-lg'
        >
          <input
            type='text'
            placeholder='Search...'
            className='px-1 bg-transparent focus:outline-none w-30 sm:w-64'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type='submit'>
            <FaSearch className='text-slate-700' />
          </button>
        </form>
        <ul className='flex gap-4 text-slate-700 font-semibold'>
          <Link to='/'>
            <li className='hidden sm:inline hover:underline'>Home</li>
          </Link>
          <Link to='/about'>
            <li className='hidden sm:inline hover:underline'>About</li>
          </Link>
          <Link to='/profile'>
            {currentUser ? (
              <img
                className='rounded-full h-7 w-7 object-cover'
                src={currentUser.avatar}
                alt='profile'
              />
            ) : (
              <li className=' text-slate-700 hover:underline'>Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
