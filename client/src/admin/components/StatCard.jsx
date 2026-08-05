// src/admin/components/StatCard.jsx
import React from 'react';
import './DashboardLayout.css'; // uses the same styles file

export default function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
