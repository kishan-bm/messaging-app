import React from 'react';
import axios from 'axios';

const MessageContextMenu = ({ message, onRemoveMessage, position }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/messages/${message.id}`);
      onRemoveMessage(message.id);
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message.');
    }
  };

  return (
    <div className="message-context-menu" style={{ top: position.y, left: position.x }}>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default MessageContextMenu;