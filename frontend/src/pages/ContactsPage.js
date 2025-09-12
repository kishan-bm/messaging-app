import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactsPage = ({ onContactSelect }) => {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const userId = 1; // This should be dynamic in a real app

  // Function to fetch the user's saved contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/contacts/${userId}`);
        setContacts(response.data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts();
  }, []);

  // Function to handle the search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5000/api/users/search?q=${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  // Function to add a found user to contacts
  const handleAddContact = async (contactId) => {
    try {
      await axios.post(`http://localhost:5000/api/contacts/add`, {
        userId: userId,
        contactId: contactId,
      });
      // After adding, re-fetch the contacts list to update the UI
      const response = await axios.get(`http://localhost:5000/api/contacts/${userId}`);
      setContacts(response.data);
      setSearchQuery('');
      setSearchResults([]);
      alert('Contact added!');
    } catch (error) {
      console.error('Error adding contact:', error);
      alert('Failed to add contact.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Contacts</h3>
      {/* Search bar section */}
      <div style={{ marginBottom: '20px', display: 'flex' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
          style={{ flexGrow: 1, padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button onClick={handleSearch} style={{ marginLeft: '10px', padding: '8px 15px', borderRadius: '5px' }}>
          Search
        </button>
      </div>

      {/* Display search results */}
      {searchResults.length > 0 && (
        <div style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '20px' }}>
          <h4>Search Results</h4>
          <ul>
            {searchResults.map((user) => (
              <li key={user.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                {user.username}
                <button onClick={() => handleAddContact(user.id)}>Add</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display existing contacts */}
      <h4>My Contacts</h4>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <li
              key={contact.id}
              onClick={() => onContactSelect(contact)}
              style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #eee' }}
            >
              {contact.username}
            </li>
          ))
        ) : (
          <p>No contacts found. Use the search bar to add new ones!</p>
        )}
      </ul>
    </div>
  );
};

export default ContactsPage;