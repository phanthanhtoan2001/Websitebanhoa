import logo from './logo.svg';
import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';

function App() {
  return (
    <div>
      <Header/>
      <main className='pt-32 bg-slate-300 min-h-[calc(100vh)]'>
        <div>
          <Outlet/>
        </div>
      </main>
    </div>
  );
}


export default App;
