// src/admin/components/AdminNav.jsx
import React from 'react';

export default function AdminNav() {
  const notificationCount = 3; // placeholder count

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      background: '#343a40',
      color: '#fff'
    }}>
      {/* Logo */}
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        Daily Mart
      </div>

      {/* Right‐side icons + Logout */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Notifications */}
        <div
          onClick={() => alert('You have ' + notificationCount + ' new notifications')}
          style={{
            position: 'relative',
            marginRight: '1rem',
            cursor: 'pointer',
            fontSize: '1.25rem'
          }}
        >
          🔔
          {notificationCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-8px',
              background: '#ff3b30',
              color: '#fff',
              borderRadius: '50%',
              padding: '2px 6px',
              fontSize: '0.7rem',
              lineHeight: 1
            }}>
              {notificationCount}
            </span>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={() => alert('Logging out')}
          style={{
            background: 'transparent',
            border: '1px solid #fff',
            color: '#fff',
            padding: '0.5rem 1rem',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
