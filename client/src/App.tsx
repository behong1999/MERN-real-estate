import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import About from './pages/About';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import NavBar from './components/NavBar';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/about' element={<About />} />

        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          {/* <Route path='/create-listing' element={<CreateListing />} />
          <Route
            path='/update-listing/:listingId'
            element={<UpdateListing />}
          /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
