// import React, { useState, useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import userIcon from '../assets/user.png';
// import statusIcon from '../assets/status.png';
// import settingsIcon from '../assets/settings.png';
// import chatBubbleIcon from '../assets/chat-bubble.png';
// import telephoneIcon from '../assets/telephone.png';
// // import AIChatbotPopup from '.AiChatbotPopup'; // Import AI chatbot

// const LeftSidebar = ({ user }) => {
//   const { logout } = useContext(AuthContext);
//   const [popupView, setPopupView] = useState('none');
//   const [settingsView, setSettingsView] = useState('main');
//   const [isAIChatbotOpen, setIsAIChatbotOpen] = useState(false); // New state for AI chatbot

//   const randomPhone = '9876543210';
//   const randomEmail = 'help@relatim.com';

//   const handleLogout = () => {
//     logout();
//     setPopupView('none');
//   };

//   const renderSettingsContent = () => {
//     if (settingsView === 'main') {
//       return (
//         <ul className="settings-menu">
//           <li onClick={() => setSettingsView('account')}>Account</li>
//           <li onClick={() => setSettingsView('notification')}>Notification</li>
//           <li onClick={() => setSettingsView('help')}>Help</li>
//         </ul>
//       );
//     } else if (settingsView === 'account') {
//       return (
//         <div className="popup-content-body">
//           <p>Name: {user.username || 'N/A'}</p>
//           <p>Phone: {user.phone_number || 'N/A'}</p>
//         </div>
//       );
//     } else if (settingsView === 'notification') {
//       return (
//         <div className="popup-content-body">
//           <p>No new notifications.</p>
//         </div>
//       );
//     } else if (settingsView === 'help') {
//       return (
//         <div className="popup-content-body">
//           <p>Contact Details:</p>
//           <p>Phone: {randomPhone}</p>
//           <p>Email: {randomEmail}</p>
//         </div>
//       );
//     }
//   };

//   return (
//     <>
//       <div className="left-sidebar">
//         <div className="main-icons">
//           <img src={chatBubbleIcon} alt="Chats" className="icon-btn active" />
//           <img src={telephoneIcon} alt="Calls" className="icon-btn" />
//           <img src={statusIcon} alt="Status" className="icon-btn" onClick={() => setIsAIChatbotOpen(true)} />
//         </div>

//         <div className="bottom-icons">
//           <img src={settingsIcon} alt="Settings" className="icon-btn" onClick={() => { setPopupView('settings'); setSettingsView('main'); }} />
//           <img src={userIcon} alt="Profile" className="icon-btn" onClick={() => setPopupView('profile')} />
//         </div>

//         {popupView !== 'none' && (
//           <div className="popup-overlay" onClick={() => setPopupView('none')}>
//             {popupView === 'profile' && (
//               <div className="popup-window profile-popup">
//                 <div className="profile-popup-header">
//                   <img src={userIcon} alt="Profile" className="profile-popup-avatar" />
//                   <div className="profile-info">
//                     <h3>{user.username || 'User'}</h3>
//                     <p className="about-text">About: Hey there! I am using Relatim.</p>
//                     <p>Phone number: {user.phone_number || 'N/A'}</p>
//                   </div>
//                 </div>
//                 <button onClick={handleLogout} className="logout-btn">Log Out</button>
//               </div>
//             )}

//             {popupView === 'settings' && (
//               <div className="popup-window settings-popup">
//                 <div className="popup-content-header">
//                   {settingsView !== 'main' && (
//                     <div className="popup-back" onClick={() => setSettingsView('main')}>
//                       <span className="back-icon">←</span> Back
//                     </div>
//                   )}
//                   <h4>Settings</h4>
//                 </div>
//                 <div className="popup-content-body">
//                   {renderSettingsContent()}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {isAIChatbotOpen && (
//         <AIChatbotPopup onClose={() => setIsAIChatbotOpen(false)} />
//       )}
//     </>
//   );
// };

// export default LeftSidebar;


import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import userIcon from '../assets/user.png';
import statusIcon from '../assets/status.png';
import settingsIcon from '../assets/settings.png';
import chatBubbleIcon from '../assets/chat-bubble.png';
import telephoneIcon from '../assets/telephone.png';

const LeftSidebar = ({ user }) => {
  const { logout } = useContext(AuthContext);
  const [popupView, setPopupView] = useState('none');
  const [settingsView, setSettingsView] = useState('main');

  const randomPhone = '9876543210';
  const randomEmail = 'help@relatim.com';

  const handleLogout = () => {
    logout();
    setPopupView('none');
  };

  const renderSettingsContent = () => {
    if (settingsView === 'main') {
      return (
        <ul className="settings-menu">
          <li onClick={() => setSettingsView('account')}>Account</li>
          <li onClick={() => setSettingsView('notification')}>Notification</li>
          <li onClick={() => setSettingsView('help')}>Help</li>
        </ul>
      );
    } else if (settingsView === 'account') {
      return (
        <div className="popup-content-body">
          <p>Name: {user.username || 'N/A'}</p>
          <p>Phone: {user.phone_number || 'N/A'}</p>
        </div>
      );
    } else if (settingsView === 'notification') {
      return (
        <div className="popup-content-body">
          <p>No new notifications.</p>
        </div>
      );
    } else if (settingsView === 'help') {
      return (
        <div className="popup-content-body">
          <p>Contact Details:</p>
          <p>Phone: {randomPhone}</p>
          <p>Email: {randomEmail}</p>
        </div>
      );
    }
  };

  return (
    <div className="left-sidebar">
      <div className="main-icons">
        <img src={chatBubbleIcon} alt="Chats" className="icon-btn active" />
        <img src={telephoneIcon} alt="Calls" className="icon-btn" />
        <img src={statusIcon} alt="Status" className="icon-btn" />
      </div>

      <div className="bottom-icons">
        <img src={settingsIcon} alt="Settings" className="icon-btn" onClick={() => { setPopupView('settings'); setSettingsView('main'); }} />
        <img src={userIcon} alt="Profile" className="icon-btn" onClick={() => setPopupView('profile')} />
      </div>

      {popupView !== 'none' && (
        <div className="popup-overlay" onClick={() => setPopupView('none')}>
          {popupView === 'profile' && (
            <div className="popup-window profile-popup">
              <div className="profile-popup-header">
                <img src={userIcon} alt="Profile" className="profile-popup-avatar" />
                <div className="profile-info">
                  <h3>{user.username || 'User'}</h3>
                  <p className="about-text">About: Hey there! I am using Relatim.</p>
                  <p>Phone number: {user.phone_number || 'N/A'}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="logout-btn">Log Out</button>
            </div>
          )}

          {popupView === 'settings' && (
            <div className="popup-window settings-popup">
              <div className="popup-content-header">
                {settingsView !== 'main' && (
                  <div className="popup-back" onClick={() => setSettingsView('main')}>
                    <span className="back-icon">←</span> Back
                  </div>
                )}
                <h4>Settings</h4>
              </div>
              <div className="popup-content-body">
                {renderSettingsContent()}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;