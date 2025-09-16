// import React, { useState } from 'react';
// import axios from 'axios';
// import userIcon from '../assets/user.png'; // User icon for your messages
// import aiIcon from '../assets/ai-icon.png'; // Assuming you have an AI icon

// const AIChatbotPopup = ({ onClose }) => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const newMessage = { type: 'user', text: input };
//     setMessages(prevMessages => [...prevMessages, newMessage]);
//     setInput('');
//     setIsLoading(true);

//     try {
//       const response = await axios.post('http://localhost:5000/api/ai/chat', { prompt: input });
//       const botMessage = { type: 'bot', text: response.data.response };
//       setMessages(prevMessages => [...prevMessages, botMessage]);
//     } catch (error) {
//       console.error("Chatbot API Error:", error);
//       const errorMessage = { type: 'bot', text: 'Sorry, I am having trouble connecting.' };
//       setMessages(prevMessages => [...prevMessages, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="ai-chatbot-popup-overlay" onClick={onClose}>
//       <div className="ai-chatbot-window" onClick={(e) => e.stopPropagation()}>
//         <div className="ai-chatbot-header">
//           <h3>AI Assistant</h3>
//           <button onClick={onClose}>&times;</button>
//         </div>
//         <div className="ai-chatbot-messages">
//           {messages.map((msg, index) => (
//             <div key={index} className={`ai-message-bubble ${msg.type}`}>
//               <img src={msg.type === 'user' ? userIcon : aiIcon} alt={msg.type} />
//               <p>{msg.text}</p>
//             </div>
//           ))}
//           {isLoading && <div className="ai-loading">...</div>}
//         </div>
//         <form onSubmit={handleSendMessage} className="ai-chatbot-input-form">
//           <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question..." disabled={isLoading} />
//           <button type="submit" disabled={isLoading}>Send</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AIChatbotPopup;