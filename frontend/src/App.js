import logo from './logo.svg';
import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from 'react';
import { setDataProduct } from './redux/productSlice';
import { useDispatch, useSelector } from 'react-redux';

function App() {
  const dispatch = useDispatch()
  const productData = useSelector((state) => state.product)

  useEffect(() => {
    (async () => {
      const res = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/product`)
      const resData = await res.json()
      console.log(resData)
      dispatch(setDataProduct(resData))
    })()
  }, [])

  return (
    <div>
      <Toaster />
      <Header />
      <main className='pt-32 bg-slate-300 min-h-[calc(100vh)]'>
        <div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}


export default App;
