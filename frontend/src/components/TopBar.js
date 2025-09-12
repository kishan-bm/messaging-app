import React from 'react';

const TopBar = ({ title }) => {
  return (
    <div className="top-bar">
      <h2>{title}</h2>
      {/* We can add Dashboard link here later */}
      <div className="top-links">
        <span>Message</span>
        <span>Dashboard</span>
      </div>
    </div>
  );
};

export default TopBar;