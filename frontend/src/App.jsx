import { useState, useEffect } from 'react';

function App() {
  const [ile, setIle] = useState(0);

  useEffect(() => {
    // Używamy względnego path — w dev Vite użyje proxy z vite.config.js,
    // w produkcji trzeba zapewnić routing /api -> backend (np. nginx)
    fetch('/api/visit')
      .then(r => r.json())
      .then(data => setIle(data.ile))
      .catch(err => console.error('fetch /api/visit error', err));
  }, []);


  const catStyle = {
    display: 'block',
    margin: '0 auto 20px', 
    width: '220px',
    maxWidth: '40%',      
    height: 'auto',
    pointerEvents: 'none', 
    filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.25))'
  };

  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '50px', 
      fontFamily: 'Arial, sans-serif',
      background: '#1ca800ff',
      color: 'white',
      minHeight: '100vh',
      position: 'relative'
    }}>
      <h1>Siemka, ta apka w ogóle nie zapisuje twojego ip :)</h1>
      <h2>Pozdrawiam Hubert</h2>

      {}
      <img
        src="/dancing-cat.gif"
        alt="Tańczący kot"
        style={catStyle}
      />

      <p style={{ fontSize: '28px', margin: '40px' }}>
        Ta strona została odwiedzona już
      </p>
      <div style={{ 
        fontSize: '72px', 
        fontWeight: 'bold',
        background: 'white',
        color: '#1ca800ff',
        display: 'inline-block',
        padding: '20px 50px',
        borderRadius: '20px'
      }}>
        {ile}
      </div>
      <p style={{ marginTop: '40px', fontSize: '24px' }}>
        razy!
      </p>
    </div>
  );
}

export default App;