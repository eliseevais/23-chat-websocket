import React, {useEffect, useRef, useState} from "react";
import io from "socket.io-client";
import './App.css';
import reportWebVitals from './reportWebVitals';

export type MessageType = {
  message: string
  id: string
  user: {
    id: string,
    name: string
  }
};

let socket = io("http://localhost:3009");

function App() {

  const [messages, setMessages] = useState<Array<MessageType>>([]);
  const [message, setMessage] = useState('Hello everybody!');
  const [name, setName] = useState('Dasha');
  const [isActiveAutoScroll, setIsActiveAutoScroll] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    socket.on('init-messages-published', (messages: Array<MessageType>) => {
      setMessages(messages);
    });

    socket.on('new-message-sent', (message: MessageType) => {
      console.log(message)
      setMessages((messages: Array<MessageType>) => [...messages, message]);
    })
  }, []);

  useEffect(() => {
    if (isActiveAutoScroll) {
      lastMessageAnchorRef.current?.scrollIntoView({behavior: 'smooth'})
    }
  }, [messages]);

  const lastMessageAnchorRef = useRef<HTMLDivElement>(null);

  const onChangeHandlerSetMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.currentTarget.value)
  };
  const onClickHandlerSendMessage = () => {
    socket.emit('client-message-sent', message);
    setMessage('');
  };
  const onChangeHandlerName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value)
  };
  const onClickHandlerSetName = () => {
    socket.emit('client-name-sent', name);
  };
  const onScrollHandler = (e: React.UIEvent<HTMLDivElement>) => {
    let element = e.currentTarget;
    let maxScrollPosition = element.scrollHeight - element.clientHeight;

    if (element.scrollTop > lastScrollTop && Math.abs(maxScrollPosition - element.scrollTop) < 10) {
      setIsActiveAutoScroll(true)
    } else {
      setIsActiveAutoScroll(false)
    }
    setLastScrollTop(e.currentTarget.scrollTop)
  }

  return (
    <div className="App">
      <div className={"AppBar"}>Chat on Websocket</div>

      <div className={'ContainerWindow'}>
        <div className={"ContainerChat"} onScroll={onScrollHandler}>
          {messages.map((m: MessageType) => {
            return <div key={m.id}>
              <b>{m.user.name}</b>: {m.message}
              <div ref={lastMessageAnchorRef}></div>
            </div>
          })}
        </div>

        <div className={'ContainerForButtons'}>
          <div className={"ContainerNewMessageSend"}>
            <input value={name} onChange={onChangeHandlerName}/>
            <button onClick={onClickHandlerSetName}>set name</button>
          </div>

          <div className={"ContainerNewMessageSend"}>
            <textarea value={message} onChange={onChangeHandlerSetMessage}/>
            <button onClick={onClickHandlerSendMessage}>send</button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
reportWebVitals();