import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import DefaultLayout from './layout/DefaultLayout';
import { Toaster } from 'react-hot-toast';
import { useAuthContext } from './context/AuthContext';

import ProtectedRoute from './utils/protectedRoute.utils';
import { authInterceptor } from './hooks/useInterceptor';
import Cooperatives from './pages/Registration/cooperatives.registration';
import CooperativesList from './pages/Registration/cooperativesList.registration';


function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  //user authenticated?
  const { authUser } = useAuthContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Condición para determinar si aplicar o no DefaultLayout
  const isAuthRoute = pathname === '/auth/signin';

  return loading ? (
    <Loader />
  ) : (
    <>
      {isAuthRoute ? (
        <>
          <Routes>
        
            <Route
              path="/auth/signin"
              element={
                
                authUser ? <Navigate to='/register/cooperativesList' /> :
                
                  <>
                    <PageTitle title="SignIn | ChaskiPass" />
                    <SignIn />
                  </>
              }
            />
          </Routes>
          <Toaster />
        </>
      ) : (
        <DefaultLayout>
          <Routes>
            <Route
              path='/auth/signin'
              element={
                <ProtectedRoute requiredRole={['Administrador']}>
                  <>
                    <PageTitle title="Routes  | ChaskiPass" />
                    <CooperativesList />
                  </>
                </ProtectedRoute>
              }
            />
        
              <Route
              path="/auth/signup"
              element={

                <ProtectedRoute requiredRole={['Administrador']}>
                  <>
                    <PageTitle title="Cooperatives | ChaskiPass" />
                    <Cooperatives/>
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/auth/signup"
              element={
                <ProtectedRoute requiredRole={['Administrador']}>
                  <>
                    <PageTitle title="Signin | ChaskiPass" />
                    <SignUp />
                  </>
                </ProtectedRoute>
              }
            />
          
            <Route
              path="/register/cooperativesList"
              element={
                <ProtectedRoute requiredRole={['Administrador']}>
                  <>
                    <PageTitle title="Routes | ChaskiPass" />
                    <CooperativesList />
                  </>
                </ProtectedRoute>
              }
            />
         
          </Routes>
          <Toaster />
        </DefaultLayout>
      )}
    </>
  );
}

export default authInterceptor(App);
