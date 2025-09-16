import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Popup.css';

const ContactsPopup = ({ onClose, onContactSelect }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isCreatingContact, setIsCreatingContact] = useState(false);
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactUsername, setNewContactUsername] = useState('');
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/search?q=`);
        setAllUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchAllUsers();
  }, []);

  useEffect(() => {
    const results = allUsers.filter(user =>
      (user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone_number?.includes(searchQuery))
    );
    setFilteredUsers(results);
  }, [searchQuery, allUsers]);

  const handleCreateContact = async () => {
    if (!newContactPhone) {
      setPhoneError('Phone number is required!');
      return;
    }
    if (newContactPhone.length !== 10 || isNaN(newContactPhone)) {
      setPhoneError('Please enter a valid 10-digit number.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/users/create-contact', {
        username: newContactUsername,
        phoneNumber: newContactPhone,
      });
      // alert('Contact saved successfully!');
      const response = await axios.get(`http://localhost:5000/api/users/search?q=`);
      setAllUsers(response.data);
      
      setIsCreatingContact(false);
      setNewContactPhone('');
      setNewContactUsername('');
      setPhoneError('');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to save contact.';
      // alert(errorMessage);
      console.error('Error saving contact:', error);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-header">
          <h3>{isCreatingContact ? 'Create New Contact' : 'Contacts'}</h3>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        {!isCreatingContact ? (
          <>
            <div className="popup-search-container">
            <div className="popup-search">
                <input
                type="text"
                placeholder="Search contacts by name or number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <button
              onClick={() => setIsCreatingContact(true)}
              style={{ width: '100%', padding: '10px' }}
            >
              Create New Contact
            </button>
            <div className="contact-list">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="contact-item"
                  onClick={() => onContactSelect(user)}
                >
                  {user.username} ({user.phone_number || 'N/A'})
                </div>
              ))}
            </div>
            
            </div>
          </>
        ) : (
          <div className="create-contact-view">
            <input
                type="tel" // Use type="tel" for better mobile support
                placeholder="Enter phone number"
                value={newContactPhone}
                onChange={(e) => {
                    const value = e.target.value;
                    // Check if the value is a number and its length is not more than 10
                    if (!isNaN(value) && value.length <= 10) {
                    setNewContactPhone(value);
                    setPhoneError('');
                    }
              }}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: phoneError ? '5px' : '15px',
                border: `1px solid ${phoneError ? 'red' : '#ccc'}`,
                boxSizing: 'border-box'
              }}
            />
            {phoneError && <p style={{ color: 'red', fontSize: '12px', marginTop: '0', marginBottom: '10px' }}>{phoneError}</p>}
            <input
              type="text"
              placeholder="Enter username (optional)"
              value={newContactUsername}
              onChange={(e) => setNewContactUsername(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '15px', boxSizing: 'border-box' }}
            />
            <button
              onClick={handleCreateContact}
              style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none' }}
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsPopup;