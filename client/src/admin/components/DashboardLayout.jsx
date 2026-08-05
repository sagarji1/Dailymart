import React, { useState, useEffect } from 'react';
import AdminNav from './AdminNav';
import SmartFresh from './SmartFresh';
export default function DashboardLayout() {
  const tabs = ['Dashboard', 'Products', 'Color Mode', 'Smart AI',  ];
  const [active, setActive] = useState('Dashboard');
  const [dark, setDark] = useState(false);
  const [products, setProducts] = useState([]);

  // Static store info
  const stores = [
    { id: 1, name: 'Mumbai Central', skus: 120 },
    { id: 2, name: 'Delhi Bazaar', skus: 85 },
    { id: 3, name: 'Chennai Plaza', skus: 60 },
    { id: 4, name: 'Bangalore Square', skus: 45 },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:8080/predict');
        const data = await res.json();

        const today = new Date();
        const updated = data.map((item, index) => {
          const expiry = new Date(item.ExpiryDate);
          const daysRemaining = Math.max(0, Math.ceil((expiry - today) / (1000 * 60 * 60 * 24)));

          let riskLevel = 'Low';
          if (daysRemaining < 3) riskLevel = 'High';
          else if (daysRemaining < 7) riskLevel = 'Medium';

          return {
            id: index + 1,
            sku: item.SKU,
            storeId: item.StoreID,
            name: item.stockName,
            image: item.stockUrl,
            qty: item.StockQty,
            avgDailySales: item.AvgDailySales,
            daysRemaining,
            riskLevel
          };
        });

        setProducts(updated);
      } catch (err) {
        console.error('API fetch error:', err);
      }
    };

    fetchProducts();
  }, []);

  const th = {
    textAlign: 'left',
    padding: '0.5rem',
    borderBottom: '2px solid #ccc',
  };
  const td = {
    padding: '0.5rem',
    borderBottom: '1px solid #eee',
    verticalAlign: 'middle',
  };

  const renderDashboard = () => {
    const stats = [
      { label: 'Active Stores', value: products.length },
      { label: 'Total SKUs', value: stores.reduce((sum, s) => sum + s.skus, 0) },
      { label: 'Pending Orders', value: 27 },
      { label: 'New Messages', value: 4 },
    ];

    return (
      <>
        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          margin: '1rem 0'
        }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: '#fff',
              padding: '1rem',
              borderRadius: 4,
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '0.25rem'
              }}>{s.value}</div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Stores Table */}


        {/* Products Table */}
        {renderProductsTable()}
      </>
    );
  };

  const renderProductsTable = () => (
    <div style={{
      background: '#fff',
      padding: '1rem',
      borderRadius: 6,
      overflowX: 'auto'
    }}>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Products</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={th}>ID</th>
            <th style={th}>SKU</th>
            <th style={th}>Store ID</th>
            <th style={th}>Name</th>
            <th style={th}>Image</th>
            <th style={th}>Qty</th>
            <th style={th}>Avg Daily Sales</th>
            <th style={th}>Days Remaining</th>
            <th style={th}>Risk Level</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td style={td}>{p.id}</td>
              <td style={td}>{p.sku}</td>
              <td style={td}>{p.storeId}</td>
              <td style={td}>{p.name}</td>
              <td style={td}>
                <img src={p.image} alt={p.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
              </td>
              <td style={td}>{p.qty}</td>
              <td style={td}>{p.avgDailySales}</td>
              <td style={td}>{p.daysRemaining}</td>
              <td style={{
                ...td,
                color:
                  p.riskLevel === 'High' ? '#f44336' :
                  p.riskLevel === 'Medium' ? '#ff9800' : '#4caf50',
                fontWeight: 'bold'
              }}>{p.riskLevel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

const renderContent = () => {
  if (active === 'Dashboard') return renderDashboard();
  if (active === 'Products') return renderProductsTable();
  if (active === 'Color Mode') {
    return (
      <button
        onClick={() => setDark(d => !d)}
        style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}
      >
        Switch to {dark ? 'Light' : 'Dark'} Mode
      </button>
    );
  }
  if (active === 'Smart AI') {
    return <SmartFresh />;
  }

  return <p style={{ padding: '1rem' }}>{active} content goes here.</p>;
};


  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: dark ? '#1e1e1e' : '#f0f2f5',
      color: dark ? '#ddd' : '#333'
    }}>
      

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <aside style={{
          width: 220,
          background: '#2f3e46',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '1rem'
        }}>
          {tabs.map(tab => (
            <div
              key={tab}
              onClick={() => setActive(tab)}
              style={{
                padding: '0.75rem 1rem',
                cursor: 'pointer',
                background: active === tab ? '#52796f' : 'transparent'
              }}
            >
              {tab}
            </div>
          ))}
          <div
            onClick={() => setDark(d => !d)}
            style={{
              marginTop: 'auto',
              padding: '0.75rem 1rem',
              cursor: 'pointer'
            }}
          >
            {dark ? 'Light Mode' : 'Dark Mode'}
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
          <h2>{active}</h2>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
