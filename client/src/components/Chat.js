import React, {useState, useEffect} from 'react'
// import { useSearchParams } from 'react-router-dom';
import io from 'socket.io-client';
import Infobar from './Infobar'
import Input from './Input';
import Messages from './Messages';
import TextContainer from './TextContainer';

// import queryString from 'query-string';


function Chat() {

  const [name, setName] = useState('');
  const [room , setRoom] = useState('');
  const [users , setUsers] = useState('');
  const [message , setMessage] = useState('');
  const [messages , setMessages] = useState([]);

  let ENDPOINT = 'localhost:5000';
  let socket;

  useEffect(() => {
    let [name_, room_] = window.location.search.slice(1).split('&').map(qstr => {return qstr.split('=')[1]});

    socket = io(ENDPOINT);

    setName(name_);
    setRoom(room_);

    socket.emit('join', {name: name_,  room: room_}, (error) => {
      alert(error);
    });
    console.log(socket);

    return function cleanUp(){
      socket.emit('disconnect');
      socket.off(); // turns this current user's instance of the socket off
    }
  }, [ENDPOINT, window.location.search]);

  useEffect(() => {
      socket.on('message', (message) => {
      setMessages([...messages, message]);
    });
  }, [messages]);

  const sendMessage = (event) => {
    event.preventDefault();
    if(message){
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  return (
    <div className="outerContainer">
      <div className="container">
          <Infobar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <TextContainer users={users}/>
    </div>
  )
}

export default Chat;