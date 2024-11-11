import React, {useEffect, useState} from "react";
import io from "socket.io-client";
import './App.css';
import reportWebVitals from './reportWebVitals';

type MessageType = {
  message: string
  id: string
  user: {
    id: string,
    name: string
  }
}

function App() {

  useEffect(() => {
    let socket = io();
  }, []);

  const [messages, setMessages] = useState([
    {message: "Hello Viktor", id: "1", user: {id: '11', name: "Dimych"}},
    {message: "Hello Dimych", id: "2", user: {id: '12', name: "Viktor"}},
  ])
  return (
    <div className="App">
      <div className={"ContainerChat"}>
        {messages.map((m: MessageType) => {
          return <div>
            <b>{m.user.name}</b>: {m.message}
          </div>
        })}
      </div>
      <div className={"ContainerNewMessageSend"}>
        <textarea/>
        <button>send</button>
      </div>
    </div>
  );
}

export default App;
reportWebVitals();
