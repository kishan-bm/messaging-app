import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import sendIcon from '../assets/send.png';
import userIcon from '../assets/user.png';
import searchIcon from '../assets/search.png';
import videoIcon from '../assets/video-camera.png';
import telephoneIcon from '../assets/telephone.png';
import ChatProfilePopup from './ChatProfilePopup';
import MessageContextMenu from './MessageContextMenu'; // Import the new component
import { AuthContext } from '../context/AuthContext';

const ChatWindow = ({ contact, onMessageSent }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [contextMenu, setContextMenu] = useState({ visible: false, message: null, position: { x: 0, y: 0 } });

  useEffect(() => {
    const fetchMessagesAndStatus = async () => {
      try {
        const [messagesResponse, blockStatusResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/messages/${user.id}/${contact.id}`),
          axios.get(`http://localhost:5000/api/users/is-blocked/${user.id}/${contact.id}`),
        ]);
        setMessages(messagesResponse.data);
        setIsBlocked(blockStatusResponse.data.isBlocked);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMessagesAndStatus();
  }, [contact, user.id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (isBlocked || !newMessage.trim()) return;

    const messageData = {
      senderId: user.id,
      receiverId: contact.id,
      content: newMessage,
    };

    try {
      const response = await axios.post(`http://localhost:5000/api/messages/send`, messageData);
      setMessages([...messages, response.data.message]);
      setNewMessage('');
      onMessageSent(contact);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleRightClick = (e, message) => {
    e.preventDefault();
    setContextMenu({ visible: true, message, position: { x: e.clientX, y: e.clientY } });
  };

  const onRemoveMessage = (messageId) => {
    setMessages(messages.filter(msg => msg.id !== messageId));
    setContextMenu({ visible: false, message: null, position: { x: 0, y: 0 } });
  };

  return (
    <div className="chat-window-container">
      <div className="chat-header">
        <div className="chat-contact-info" onClick={() => setShowProfilePopup(true)}>
          <img src={userIcon} alt="Profile" className="chat-profile-icon" />
          <span className="chat-contact-name">{contact.username || 'User'}</span>
        </div>
        <div className="chat-header-actions">
          <img src={telephoneIcon} alt="Phone Call" className="icon-btn" />
          <img src={videoIcon} alt="Video Call" className="icon-btn" />
          <img src={searchIcon} alt="Search" className="icon-btn" />
        </div>
      </div>
      <div className="chat-messages" onClick={() => setContextMenu({ visible: false, message: null, position: { x: 0, y: 0 } })}>
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`message-bubble ${msg.sender_id === user.id ? 'sent' : 'received'}`}
            onContextMenu={(e) => msg.sender_id === user.id && handleRightClick(e, msg)}
          >
            <div className="message-content">
              {msg.content}
            </div>
          </div>
        ))}
        {isBlocked && (
          <div className="blocked-message-note">
            <p>You cannot send or receive messages from this user. To receive messages, you need to unblock this user.</p>
          </div>
        )}
        {contextMenu.visible && (
          <MessageContextMenu
            message={contextMenu.message}
            onRemoveMessage={onRemoveMessage}
            position={contextMenu.position}
          />
        )}
      </div>
      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={isBlocked ? 'You cannot send messages to this user' : 'Type a message...'}
          className="chat-input-field"
          disabled={isBlocked}
        />
        <button type="submit" className="chat-send-btn" disabled={isBlocked}>
          <img src={sendIcon} alt="Send" />
        </button>
      </form>

      {showProfilePopup && (
        <ChatProfilePopup
          contact={contact}
          onClose={() => setShowProfilePopup(false)}
          onChatDelete={() => { /* This function needs to be passed down from MainLayout */ }}
        />
      )}
    </div>
  );
};

export default ChatWindow;