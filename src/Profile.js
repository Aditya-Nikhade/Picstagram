import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCheck } from '@fortawesome/free-solid-svg-icons';
import './Profile.css';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('displayName');
  const [newUsername, setNewUsername] = useState('');

  const handleEdit = () => {
    setIsEditing(true);
    setNewUsername(username);
  };

  const handleSave = () => {
    setUsername(newUsername);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const editProfile = () => {
    let a = document.getElementById("profile");
    a.click();
  }

  return (
    <div className='profile'>
      <div className='profile_details'>
        <div className='info'>

          <div className='pic_display'>
            <div className='profile_pic'></div>
            <input type="file" accept='image/*' id="profile" hidden />
            <FontAwesomeIcon icon={faEdit} style={{ cursor: "pointer" }} className="edit_profile_pic" size='lg' onClick={editProfile} />
          </div>

          <div className='edit_username'>
            <div className='username'>
              {isEditing ? (
                <input
                  type='text'
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
              ) : (
                `Username: ${username}`
              )}
            </div>
            {isEditing ? (
              <div className='button_group'>
                <button className='cancel_button' onClick={handleCancel}>
                  Cancel
                </button>
                <button className='save_button' onClick={handleSave}>
                  <FontAwesomeIcon icon={faCheck} size='lg' />
                </button>
              </div>
            ) : (
              <button className='edit_button' onClick={handleEdit}>
                <FontAwesomeIcon icon={faEdit} size='lg' />
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
