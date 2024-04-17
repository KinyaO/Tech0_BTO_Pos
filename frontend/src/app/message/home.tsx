import React, { useEffect, useState } from 'react';
import './message/ChatApp_likeLine2.css'; // スタイルシートのインポート

export default function Home() {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8000/ws');
    websocket.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, { text: event.data, sender: 'server' }]);
    };
    setWs(websocket);
    return () => {
      websocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws && inputMessage.trim()) {
      ws.send(inputMessage);
      setMessages((prevMessages) => [...prevMessages, { text: inputMessage, sender: 'client' }]);
      setInputMessage('');
    }
  };

  return (
    <div>
      <h1>Messager Center</h1>
      <ul className="messagesList">
        {messages.map((message, index) => (
          <li key={index} className={`messageItem ${message.sender}`}>
            <span className={`message ${message.sender}`}>
              {message.text}
            </span>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            sendMessage();
          }
        }}
        placeholder="Type a message..."
        className="messageInput"
      />
      <button onClick={sendMessage} className="sendButton">Send Message</button>
    </div>
  );
}
