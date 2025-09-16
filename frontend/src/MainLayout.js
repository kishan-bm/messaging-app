import React, { useState, useEffect, useContext } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import ContactsPopup from './components/ContactsPopup';
import LeftSidebar from './components/LeftSidebar';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MainLayout = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
        navigate('/login');
        return;
    }

    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/messages/recent-chats/${user.id}`);
        setChatHistory(response.data);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };
    fetchChatHistory();
  }, [user, navigate]);

  const handleAddContactClick = () => {
    setIsContactsOpen(true);
  };

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    setIsContactsOpen(false);
  };

  const updateChatHistory = (contact) => {
    const isAlreadyInHistory = chatHistory.some(c => c.id === contact.id);
    if (!isAlreadyInHistory) {
      setChatHistory(prevHistory => [{ id: contact.id, username: contact.username }, ...prevHistory]);
    }
  };

  const handleChatDelete = () => {
  setSelectedContact(null);
  setChatHistory(chatHistory.filter(c => c.id !== selectedContact.id));
};

  return (
    <div className="app-container">
      <LeftSidebar user={user} />
      <Sidebar
        onAddContactClick={handleAddContactClick}
        chatHistory={chatHistory}
        onContactSelect={handleContactSelect}
      />
      <div className="main-content">
        {selectedContact ? (
          <ChatWindow
            contact={selectedContact}
            onMessageSent={updateChatHistory}
            onChatDelete={handleChatDelete}
          />
        ) : (
          <div className="default-message">
            <h3>Welcome to Relatim</h3>
            <p>Start the conversation.</p>
          </div>
        )}
      </div>
      {isContactsOpen && (
        <ContactsPopup
          onClose={() => setIsContactsOpen(false)}
          onContactSelect={handleContactSelect}
        />
      )}
      
    </div>
  );
};

export default MainLayout;