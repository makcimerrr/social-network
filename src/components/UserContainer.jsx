import React from 'react';

const UserContainer = () => {
  return (
    <div>
      <div className="users">
        <p className="title-users">Contacts</p>
        <p className="online-list">Online</p>
        <div className="online-users"></div>
        <p className="online-list" id="offline-list">Offline</p>
        <div className="offline-users"></div>
        <p className="title-users">Groupes</p>
        <div className="group-list"></div>
      </div>
    </div>
  );
}

export default UserContainer;