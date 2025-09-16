import React, { useState, useContext } from 'react';
import axios from 'axios';
import userIcon from '../assets/user.png';
import { AuthContext } from '../context/AuthContext';

const ChatProfilePopup = ({ contact, onClose, onChatDelete }) => {
  const { user } = useContext(AuthContext);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete chat history with ${contact.username}?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/messages/${user.id}/${contact.id}`);
        // alert('Chat history deleted successfully.');
        onChatDelete();
        onClose();
      } catch (error) {
        console.error('Error deleting chat:', error);
        // alert('Failed to delete chat history.');
      }
    }
  };

  const handleBlock = () => {
    // Implement block user logic here
    if (window.confirm(`Are you sure you want to block ${contact.username}?`)) {
      // alert('User blocked.');
      onClose();
    }
  };
  
  return (
    <div className="chat-profile-popup-overlay" onClick={onClose}>
      <div className="chat-profile-popup-window" onClick={(e) => e.stopPropagation()}>
        <div className="profile-popup-header">
          <div className="profile-avatar-container">
            <img src={userIcon} alt="Profile" className="profile-popup-avatar" />
            <div className="profile-options-menu">
              <button>View Profile Picture</button>
              <button>Status</button>
            </div>
          </div>
          <div className="profile-info-text">
            <h3>{contact.username || 'User'}</h3>
            {contact.phone_number && (
              <p>Phone number: +{contact.phone_number}</p>
            )}
            {!contact.phone_number && (
              <p>Phone number: N/A</p>
            )}
          </div>
        </div>
        <div className="profile-actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button className="profile-action-btn block-btn" onClick={handleBlock}>Block User</button>
          <button className="profile-action-btn delete-btn" onClick={handleDelete}>Delete Chat</button>
        </div>
      </div>
    </div>
  );
};

export default ChatProfilePopup;