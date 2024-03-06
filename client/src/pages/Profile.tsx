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
import { FormData, Listing, User } from '../utils/types';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const listingsRef = useRef<HTMLDivElement>(null);

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
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState<Listing[]>([]);

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

    dispatch(updateUserStart());
    const prevEmail = currentUser!.email;
    axios
      .post(`/api/user/update/${currentUser!.id}`, formData)
      .then((res) => {
        const data = res.data;
        dispatch(updateUserSuccess(data as User));
        setUpdateSuccess(true);
        if (currentUser && formData.email && formData.email !== prevEmail) {
          setEmailChange(true);
        } else {
          setEmailChange(false);
        }
      })
      .catch((err) => {
        dispatch(updateUserFailure(err.response.data.message));
        return;
      });
  };

  const handleDeleteUser = async () => {
    dispatch(deleteUserStart());
    axios
      .delete(`/api/user/delete/${currentUser!.id}`)
      .then((res) => {
        const data = res.data;
        toast.warning('Account will be deleted soon.', {
          position: 'top-center',
          autoClose: 1500,
        });
        setTimeout(() => {
          dispatch(deleteUserSuccess(data));
        }, 2000);
      })
      .catch((err) => {
        dispatch(deleteUserFailure(err.response.data.message));
        return;
      });
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      axios(`/api/auth/signout`)
        .then((res) => {
          const data = res.data;
          dispatch(signOutUserSuccess(data));
        })
        .catch((err) => {
          dispatch(signOutUserFailure(err.response.data.message));
          return;
        });
    } catch (error) {
      if (error instanceof Error) dispatch(deleteUserFailure(error.message));
    }
  };

  const handleShowListings = () => {
    setShowListingsError(false);
    axios
      .get(`/api/user/listings/${currentUser!.id}`)
      .then((res) => {
        const data = res.data;
        setUserListings(data);
        setTimeout(() => {
          if (listingsRef.current) {
            listingsRef.current.scrollIntoView({
              behavior: 'smooth',
            });
          }
        }, 500);
      })
      .catch(() => {
        setShowListingsError(true);
        return;
      });
  };

  const handleListingDelete = async (listingId: string) => {
    axios
      .delete(`/api/listing/delete/${listingId}`)
      .then((res) => {
        const data = res.data;
        setUserListings((prev) =>
          prev.filter((listing) => listing._id !== listingId)
        );

        toast.success(data, {
          position: 'top-center',
          autoClose: 1500,
        });
      })
      .catch((err) => {
        console.log(err.response.data.message);
        return;
      });
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
          className='font-semibold bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
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
      <button
        onClick={handleShowListings}
        className='font-semibold text-green-700 w-full'
      >
        Show Listings
      </button>

      <p className='text-red-700 mt-5 text-center'>
        {showListingsError ? 'Error: Cannot show listings' : ''}
      </p>

      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4' ref={listingsRef}>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4 bg-slate-200'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Profile;
