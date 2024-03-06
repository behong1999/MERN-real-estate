import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { app } from '../../firebase';
import { signInSuccess } from '../redux/user/userSlice';
import axios from 'axios';
import { User } from '../utils/types';

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const handleGoogleClick = async () => {
  //   try {
  //     const provider = new GoogleAuthProvider();
  //     const auth = getAuth(app);
  //     const result = await signInWithPopup(auth, provider);
  //     const res = await fetch('/api/auth/google', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         name: result.user.displayName,
  //         email: result.user.email,
  //         photo: result.user.photoURL,
  //       }),
  //     });
  //     const data = await res.json();
  //     dispatch(signInSuccess(data));
  //     navigate('/');
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      axios
        .post<User>('/api/auth/google', {
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        })
        .then((res) => {
          dispatch(signInSuccess(res.data));
          navigate('/');
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type='button'
      className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
    >
      Sign In with Google
    </button>
  );
};

export default OAuth;
