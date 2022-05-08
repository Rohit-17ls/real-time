import {Routes, Route, Link} from 'react-router-dom';
import './App.css';
import Chat from './components/Chat';
import Join from './components/Join';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/chat" element={<Chat/>}/>
        <Route path="/" element={<Join/>}/>
      </Routes>
      <Link to="/chat">Join Chat</Link>
    </div>
  );
}

export default App;
