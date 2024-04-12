import React from 'react';

const ProfileContainer = ({ users, togglePrivacy }) => {
    const getPrivacyLabel = (privateprofile) => {
        privateprofile = parseInt(privateprofile);
        switch (privateprofile) {
            case 0:
                return 'Private';
            case 1:
                return 'Public';
            default:
                return 'Unknown';
        }
    }
    return (
        <div>
                    <p>ID: {users.id}</p>
                    <p>Email: {users.email}</p>
                    <p>Firstname: {users.firstname}</p>
                    <p>Lastname: {users.lastname}</p>
                    <p>Date of Birth: {users.dateofbirth}</p>
                    <p>Avatar: {users.avatar}</p>
                    <p>Nickname: {users.nickname}</p>
                    <p>About Me: {users.aboutme}</p>
                    <p>Private Profile: {getPrivacyLabel(users.privateprofile)}</p>
                    <button onClick={togglePrivacy}>Toggle Privacy</button>
                    <p>Point of Interest: {users.pointofinterest}</p>

        </div>
    );
}

export default ProfileContainer;