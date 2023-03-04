import logo from './logo.svg';
import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import toast, { Toaster } from "react-hot-toast";

function App() {
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
