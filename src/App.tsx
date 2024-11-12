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

let socket = io("http://localhost:3009");
// let socket = io();

function App() {

  useEffect(() => {
    socket.on('init-messages-published', (messages: Array<MessageType>) => {
      setMessages(messages)
    })
  }, []);

  const [messages, setMessages] = useState<Array<MessageType>>([]);
  const [message, setMessage] = useState('Hello everybody!');

  const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.currentTarget.value)
  };
  const onClickHandler = () => {
    socket.emit('client-message-sent', message);
    setMessage('');
  };

  return (
    <div className="App">
      <div className={"ContainerChat"}>
        {messages.map((m: MessageType) => {
          return <div key={m.id}>
            <b>{m.user.name}</b>: {m.message}
          </div>
        })}
      </div>
      <div className={"ContainerNewMessageSend"}>
        <textarea value={message} onChange={onChangeHandler}/>
        <button onClick={onClickHandler}>send</button>
      </div>
    </div>
  );
}

export default App;
reportWebVitals();
