import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import Spinner from '../components/Spinner';
import { RootState } from '../redux/store';
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from '../redux/user/userSlice';
import axios from 'axios';
import { FormData } from '../utils/types';

const SignIn = () => {
  const [formData, setFormData] = useState<FormData>({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.user);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch(signInStart());

      // const res = await fetch('/api/auth/signin', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });
      // const data = await res.json();
      // if (data.success === false) {
      //   dispatch(signInFailure(data.message as string));
      //   return;
      // }
      // dispatch(signInSuccess(data));
      // navigate('/');

      axios
        .post('/api/auth/signin', formData)
        .then((res) => {
          const data = res.data;
          dispatch(signInSuccess(data));
          navigate('/');
        })
        .catch((err) => {
          dispatch(signInFailure(err.response.data.message));
          return;
        });
    } catch (error) {
      dispatch(signInFailure((error as Error).message));
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='email'
          placeholder='Email'
          className='border p-3 rounded-lg'
          id='email'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='Password'
          className='border p-3 rounded-lg'
          id='password'
          autoComplete='on'
          onChange={handleChange}
        />
        {error && <p className='text-red-500'>{error}</p>}
        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? <Spinner /> : 'Sign In'}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Don't have an account?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700'>Sign Up</span>
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
