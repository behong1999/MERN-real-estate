/* eslint-disable react-hooks/exhaustive-deps */
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { app } from '../../firebase';
import { RootState } from '../redux/store';
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from '../redux/user/userSlice';
import { FormData, User } from '../utils/types';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Profile = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector(
    (state: RootState) => state.user
  );
  const [file, setFile] = useState<File | undefined>(undefined);
  const [filePercent, setFilePercent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [emailChange, setEmailChange] = useState(false);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file: File) => {
    const storage = getStorage(app);
    const fileName = currentUser!.username;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Track the progress of the upload, handle errors, and get the download URL
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercent(Math.round(progress));
      },
      () => {
        setFileUploadError(true);
      },
      () =>
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        )
    );
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());
      const prevEmail = currentUser!.email;
      const res = await fetch(`/api/user/update/${currentUser!.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data as User));
      setUpdateSuccess(true);
      if (currentUser && formData.email && formData.email !== prevEmail) {
        setEmailChange(true);
      } else {
        setEmailChange(false);
      }
    } catch (error) {
      if (error instanceof Error) dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser!.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      toast.warning('Account will be deleted soon.', {
        position: 'top-center',
        autoClose: 1500,
      });
      setTimeout(() => {
        dispatch(deleteUserSuccess(data));
      }, 2000);
    } catch (error) {
      if (error instanceof Error) dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(`/api/auth/signout`);
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      if (error instanceof Error) dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <div className='p-3 max-w-2xl mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Profile</h1>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4 max-w-lg mx-auto'
      >
        <div className='flex justify-center '>
          <input
            type='file'
            onChange={(e) =>
              setFile((e.target as HTMLInputElement)?.files?.[0])
            }
            ref={fileRef}
            hidden
            accept='image/*'
          />
          <div className='relative group'>
            <img
              src={formData.avatar || currentUser!.avatar}
              alt='No Image'
              className='rounded-full h-24 w-24 object-cover transition duration-500 ease-in-out opacity-100 group-hover:opacity-30 text-justify'
            />
            <FaCamera
              onClick={() => fileRef.current?.click()}
              className='cursor-pointer w-10 h-10 transition duration-500 ease-in-out transform -translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 opacity-0 group-hover:opacity-60'
            />
          </div>
        </div>
        <p className='text-sm self-center font-semibold'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2MB)
            </span>
          ) : filePercent > 0 && filePercent < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePercent}%`}</span>
          ) : filePercent === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <input
          type='text'
          placeholder='Username'
          defaultValue={currentUser!.username}
          id='username'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='email'
          placeholder='Email'
          id='email'
          defaultValue={currentUser!.email}
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='Password'
          onChange={handleChange}
          id='password'
          className='border p-3 rounded-lg'
        />
        <button
          disabled={loading}
          className='font-semibold bg-slate-700 text-white p-3 rounded-lg  uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
        <Link
          className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
          to={'/create-listing'}
        >
          Create Listing
        </Link>
      </form>
      <div className='flex justify-between mt-5 max-w-lg mx-auto'>
        <span
          onClick={handleDeleteUser}
          className='text-red-700 cursor-pointer'
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
          Sign out
        </span>
      </div>
      <p className='text-red-700 mt-5 font-semibold text-center'>
        {error ? error : ''}
      </p>
      <p className='text-green-700 mt-5 font-semibold text-center'>
        {updateSuccess
          ? `User is updated successfully!
            ${
              emailChange
                ? 'Please remember to sign in with the updated email later on.'
                : ''
            }`
          : ''}
      </p>
      <ToastContainer />
    </div>
  );
};

export default Profile;
