import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const NavBar = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to={'/'}>
          <h1 className='font-bold text-sm sm:text-xl flex'>
            <span className='text-slate-500'>Vin</span>
            <span className='text-slate-700'>Estate</span>
          </h1>
        </Link>
        <form action='' className='flex bg-slate-100 p-3 rounded-lg'>
          <input
            type='text'
            placeholder='Search...'
            className='px-1 bg-transparent focus:outline-none w-30 sm:w-64'
          />
          <button type='submit' className=''>
            <FaSearch />
          </button>
        </form>
        <ul className='flex gap-4'>
          <Link to='/'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>
              Home
            </li>
          </Link>
          <Link to='/about'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>
              About
            </li>
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

export default NavBar;
