import React, { useState, useEffect } from "react";
import axios from "axios";
import fetchProfileImage from "../requests/getProfileImage";

function RequestsSection({
  requests,
  accepting,
  refusing,
  actionError,
  handleAccept,
  handleRefuse,
  address,
  port,
  title = "Requests"
}) {
  const [names, setNames] = useState({});
  const [profilePictures, setProfilePictures] = useState({});

  useEffect(() => {
    const fetchInfo = async () => {
      const newNames = {};
      const newPics = {};
      for (let i = 0; i < requests.length; i++) {
        const id = requests[i];
        if (!names[id]) {
          try {
            const res = await axios.post(`http://${address}:${port}/api/users`, {
              command: "getUserName",
              data: { userId: id }
            });
            newNames[id] = res.data.name || id;
          } catch (e) {
            newNames[id] = id;
          }
        }
        if (!profilePictures[id]) {
          try {
            newPics[id] = await fetchProfileImage(id);
          } catch (e) {
            newPics[id] = "";
          }
        }
      }
      setNames(prev => ({ ...prev, ...newNames }));
      setProfilePictures(prev => ({ ...prev, ...newPics }));
    };
    if (requests.length > 0) fetchInfo();
    // eslint-disable-next-line
  }, [requests]);

  if (!requests.length) return null;
  return (
    <div style={{
      background: '#23272a',
      borderRadius: '1rem',
      padding: '1rem',
      margin: '1rem 0',
      border: '1px solid #444',
    }}>
      <h2 style={{ color: '#e6c47a', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '0.5rem' }}>{title}</h2>
      {requests.map((id) => (
        <div key={id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.2rem', marginBottom: '0.75rem', background: '#2c2f33', borderRadius: '0.75rem', padding: '0.75rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <img src={profilePictures[id] || '/images/noProfile.png'} alt="profile" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '1px solid #666' }} />
            <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem', minWidth: 100 }}>{names[id] || id}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', marginLeft: '0.5rem' }}>
            <button
              onClick={() => handleAccept(id)}
              disabled={accepting === id}
              style={{ background: '#22c55e', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.3rem 1.2rem', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95rem' }}
            >
              {accepting === id ? 'Accepting...' : 'Accept'}
            </button>
            <button
              onClick={() => handleRefuse(id)}
              disabled={refusing === id}
              style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.3rem 1.2rem', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95rem' }}
            >
              {refusing === id ? 'Refusing...' : 'Refuse'}
            </button>
          </div>
        </div>
      ))}
      {actionError && <div style={{ color: 'red', marginTop: '0.5rem' }}>{actionError}</div>}
    </div>
  );
}

export default RequestsSection;
