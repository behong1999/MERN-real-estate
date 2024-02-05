import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useEffect, useRef, useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../../firebase';

const Profile = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const { currentUser, loading } = useSelector(
    (state: RootState) => state.user
  );
  const [file, setFile] = useState<File | undefined>(undefined);
  const [filePercent, setFilePercent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string|undefined>(undefined);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file: File) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
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
      (error) => {
        setFileUploadError(true);
      },
      () => 
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setAvatarUrl(downloadURL)
        )
      
    );
  };

  const handleChange = () => {};

  const handleDeleteUser = () => {};

  const handleSignOut = () => {};

  if (currentUser) {
    return (
      <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl text-center font-semibold my-7'>Profile</h1>
        <form className='flex flex-col gap-4'>
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
                src={avatarUrl || currentUser.avatar}
                alt='profile'
                className='rounded-full h-24 w-24 object-cover transition duration-500 ease-in-out opacity-100 group-hover:opacity-30'
              />
              <FaCamera
                onClick={() => fileRef.current?.click()}
                className='cursor-pointer w-10 h-10 transition duration-500 ease-in-out transform -translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 opacity-0 group-hover:opacity-60'
              />
            </div>
          </div>
          <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
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
            defaultValue={currentUser.username}
            id='username'
            className='border p-3 rounded-lg'
            onChange={handleChange}
          />
          <input
            type='email'
            placeholder='Email'
            id='email'
            defaultValue={currentUser.email}
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
            className='bg-slate-700 text-white p-3 rounded-lg  uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Loading...' : 'Update'}
          </button>
        </form>
        <div className='flex justify-between mt-5'>
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
      </div>
    );
  }
};

export default Profile;
