import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Layout.css';
import userIcon from '../assets/user.png';

const Sidebar = ({ onAddContactClick, chatHistory, onContactSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
  const fetchResults = async () => {
    if (searchQuery.length > 0) {
      setIsSearching(true);
      try {
        const [userResponse, messageResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/users/search?q=${searchQuery}`),
          axios.get(`http://localhost:5000/api/messages/search?q=${searchQuery}`)
        ]);

        const users = userResponse.data;
        const messages = messageResponse.data;

        const combinedResults = [
          ...users.map(user => ({ ...user, type: 'user' })),
          ...messages.map(msg => ({ ...msg, type: 'message' }))
        ];

        setSearchResults(combinedResults);
      } catch (error) {
        console.error("Error during combined search:", error);
        // Log specific response details if available
        if (error.response) {
          console.error("Status:", error.response.status);
          console.error("Data:", error.response.data);
        }
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const timeoutId = setTimeout(() => {
    fetchResults();
  }, 300);

  return () => clearTimeout(timeoutId);
}, [searchQuery]);

  const displayList = searchQuery ? searchResults : chatHistory;
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Chats</h2>
        <button onClick={onAddContactClick} className="add-contact-btn">
          +
        </button>
      </div>
      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Search chats or start new chat"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="chat-list">
        {isSearching ? (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>Searching...</p>
        ) : displayList.length > 0 ? (
          displayList.map((item) => (
            <div
              key={item.id}
              className="chat-item"
              onClick={() => onContactSelect({ ...item, phone_number: item.phone_number })}
            >
              {/* Profile icon for each chat */}
              <img src={require('../assets/user.png')} alt="Profile" style={{ width: 36, height: 36, borderRadius: '50%', marginRight: 12, objectFit: 'cover', background: '#eee' }} />
              {item.type === 'message' ? (
                <>
                  <h4 style={{ margin: 0 }}>
                    {item.sender} to {item.receiver}
                  </h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                    {item.content}
                  </p>
                </>
              ) : (
                <>
                  <h4 style={{ margin: 0 }}>{item.username}</h4>
                  {item.phone_number && (
                    <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>+{item.phone_number}</p>
                  )}
                </>
              )}
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            {searchQuery.length > 0 ? 'No results found.' : 'No chats found.'}
          </p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;