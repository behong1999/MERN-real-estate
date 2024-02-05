import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../redux/store';

const PrivateRoute = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  return currentUser ? <Outlet /> : <Navigate to='/sign-in' />;
};

export default PrivateRoute;
