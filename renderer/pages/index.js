import Home from '../src/Home';
import Meta from '../src/Meta';
import AuthenticationContextProvider from '../src/components/Login/AuthenticationContextProvider';
import * as localforage from 'localforage';

const index = () => {
  localforage.getItem('userPath').then((value) => {
    localStorage.setItem('userPath', value);
  });
  
  return (
  <>
    <Meta />
    <AuthenticationContextProvider>
      <Home />
    </AuthenticationContextProvider>
  </>
  )
}

export default index;
