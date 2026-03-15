export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '428px', background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
        
        {/* Header */}
        <div style={{ background: '#003D82', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <button style={{ position: 'absolute', left: '20px', background: 'none', border: 'none', color: 'white', fontSize: '22px', cursor: 'pointer' }}>←</button>
          <div style={{ color: 'white', fontWeight: '500', fontSize: '16px', letterSpacing: '1px' }}>COACH UNITED</div>
        </div>

        {/* Media Toggle */}
        <div style={{ aspectRatio: '16/9', background: '#E8EEF3', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
            <button style={{ background: 'rgba(0,61,130,0.9)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: '500' }}>▶ GIF</button>
            <button style={{ background: 'rgba(255,255,255,0.5)', color: 'rgba(0,61,130,0.8)', border: 'none', padding: '6px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: '500' }}>📷 Foto</button>
          </div>
          <div style={{ textAlign: 'center', color: 'rgba(0,61,130,0.3)', fontSize: '15px' }}>
            <div style={{ width: '80px', height: '80px', border: '3px dashed rgba(0,61,130,0.2)', borderRadius: '12px', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>▶</div>
            <div>GIF Placeholder</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          
          <h1 style={{ fontSize: '28px', fontWeight: '500', margin: '0 0 12px', lineHeight: '1.2' }}>Im Doppelfeld Tore sammeln</h1>
          
          {/* Tags */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <span style={{ background: '#B8D4E8', color: '#003D82', padding: '4px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: '500' }}>E</span>
            <span style={{ background: '#B8D4E8', color: '#003D82', padding: '4px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: '500' }}>D</span>
            <span style={{ color: '#999', fontSize: '14px', margin: '0 2px' }}>|</span>
            <span style={{ background: '#C8E6C9', color: '#2E7D32', padding: '4px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: '500' }}>Torschuss</span>
            <span style={{ background: '#C8E6C9', color: '#2E7D32', padding: '4px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: '500' }}>Spielübersicht</span>
            <span style={{ color: '#999', fontSize: '14px', margin: '0 2px' }}>|</span>
            <span style={{ background: '#FFE0B2', color: '#E65100', padding: '4px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: '500' }}>Spiel</span>
          </div>

          <p style={{ fontSize: '16px', lineHeight: '1.7', margin: '0 0 24px' }}>Jeweils zwei Teams treten auf zwei Feldern parallel gegeneinander an. Nach Torerfolg wird der Ball als Trophäe hinter dem eigenen Tor verwahrt.</p>

          {/* Accordions */}
          <details style={{ border: '0.5px solid #ddd', borderRadius: '12px', marginBottom: '16px', overflow: 'hidden' }}>
            <summary style={{ padding: '18px', fontWeight: '500', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>🎯 Coaching-Fokus</span>
              <span style={{ fontSize: '20px', color: '#999' }}>›</span>
            </summary>
            <div style={{ padding: '0 18px 18px', borderTop: '0.5px solid #ddd', paddingTop: '16px' }}>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '15px', lineHeight: '1.7' }}>
                <li style={{ marginBottom: '8px' }}>Schnell ins Dribbling nach Ballgewinn</li>
                <li style={{ marginBottom: '8px' }}>Torchancen sicher verwerten</li>
                <li>Alle vier Teams gleichzeitig im Blick behalten</li>
              </ul>
            </div>
          </details>

          <details style={{ border: '0.5px solid #ddd', borderRadius: '12px', marginBottom: '16px', overflow: 'hidden' }}>
            <summary style={{ padding: '18px', fontWeight: '500', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>🔧 Aufbau</span>
              <span style={{ fontSize: '20px', color: '#999' }}>›</span>
            </summary>
            <div style={{ padding: '0 18px 18px', borderTop: '0.5px solid #ddd', paddingTop: '16px' }}>
              <div style={{ background: '#E8EEF3', borderRadius: '8px', padding: '40px 16px', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ width: '120px', height: '90px', border: '3px dashed rgba(0,61,130,0.2)', borderRadius: '12px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(0,61,130,0.3)', fontSize: '14px' }}>Aufbau-Grafik</div>
              </div>
              <p style={{ fontSize: '15px', lineHeight: '1.7', margin: 0 }}>Zwei Felder zu je 40m×20m aufstellen. Etwa 10m Abstand zwischen den Feldern. Je zwei Minitore pro Feld. Vier Teams (zu je vier Spielern) mit Leibchen einteilen. Trainer steht mit 10 Bällen in der Mitte der Felder.</p>
            </div>
          </details>

          <details style={{ border: '0.5px solid #ddd', borderRadius: '12px', marginBottom: '16px', overflow: 'hidden' }}>
            <summary style={{ padding: '18px', fontWeight: '500', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>▶️ Durchführung</span>
              <span style={{ fontSize: '20px', color: '#999' }}>›</span>
            </summary>
            <div style={{ padding: '0 18px 18px', fontSize: '15px', lineHeight: '1.7', borderTop: '0.5px solid #ddd', paddingTop: '16px' }}>
              <p style={{ margin: '0 0 14px' }}>Auf beiden Feldern wird parallel ein 4 gegen 4 gespielt, so dass alle vier Teams gleichzeitig spielen. Bei Torerfolg wird der Ball von der erfolgreichen Mannschaft aus dem Tor geholt und hinter dem eigenen Tor abgelegt. Der Trainer spielt einen neuen Ball ein.</p>
              <p style={{ margin: 0 }}>Wer hat die meisten Bälle hinter dem Tor, sobald die 10 Bälle durchgespielt sind?</p>
            </div>
          </details>

          <details style={{ border: '0.5px solid #ddd', borderRadius: '12px', marginBottom: '16px', overflow: 'hidden' }}>
            <summary style={{ padding: '18px', fontWeight: '500', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>👶 Übung leichter machen</span>
              <span style={{ fontSize: '20px', color: '#999' }}>›</span>
            </summary>
            <div style={{ padding: '0 18px 18px', borderTop: '0.5px solid #ddd', paddingTop: '16px' }}>
              <p style={{ fontSize: '15px', lineHeight: '1.7', margin: 0 }}>Kleinere Felder verwenden (30m×15m). Nur 3 gegen 3 spielen lassen.</p>
            </div>
          </details>

          <details style={{ border: '0.5px solid #ddd', borderRadius: '12px', marginBottom: '24px', overflow: 'hidden' }}>
            <summary style={{ padding: '18px', fontWeight: '500', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>💪 Übung schwieriger machen</span>
              <span style={{ fontSize: '20px', color: '#999' }}>›</span>
            </summary>
            <div style={{ padding: '0 18px 18px', borderTop: '0.5px solid #ddd', paddingTop: '16px' }}>
              <p style={{ fontSize: '15px', lineHeight: '1.7', margin: 0 }}>Vor einem Torerfolg muss jeder einzelne Spieler eines Teams den Ball mindestens ein Mal berührt haben.</p>
            </div>
          </details>

          {/* Related Exercises */}
          <div style={{ background: '#CCE0F4', borderRadius: '12px', padding: '18px', marginBottom: '16px' }}>
            <p style={{ fontWeight: '500', fontSize: '14px', margin: '0 0 12px', color: '#003D82', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Übungen mit gleichem Aufbau</p>
            <a href="#" style={{ display: 'block', padding: '12px', background: 'white', border: '0.5px solid rgba(0,61,130,0.15)', borderRadius: '8px', textDecoration: 'none', color: '#003D82', fontSize: '15px' }}>
              Parallel-Spiele mit Torzählung →
            </a>
          </div>

          <div style={{ background: '#CCE0F4', borderRadius: '12px', padding: '18px', marginBottom: '24px' }}>
            <p style={{ fontWeight: '500', fontSize: '14px', margin: '0 0 12px', color: '#003D82', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ähnliche Übungen</p>
            <p style={{ fontSize: '13px', color: '#003D82', opacity: 0.7, margin: '0 0 12px' }}>Weitere Spiel-Übungen für Torschuss</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a href="#" style={{ display: 'block', padding: '12px', background: 'white', border: '0.5px solid rgba(0,61,130,0.15)', borderRadius: '8px', textDecoration: 'none', color: '#003D82', fontSize: '15px' }}>
                4 gegen 4 auf vier Tore →
              </a>
              <a href="#" style={{ display: 'block', padding: '12px', background: 'white', border: '0.5px solid rgba(0,61,130,0.15)', borderRadius: '8px', textDecoration: 'none', color: '#003D82', fontSize: '15px' }}>
                Torschuss-Turnier →
              </a>
              <a href="#" style={{ display: 'block', padding: '12px', background: 'white', border: '0.5px solid rgba(0,61,130,0.15)', borderRadius: '8px', textDecoration: 'none', color: '#003D82', fontSize: '15px' }}>
                Punktespiel mit Minitor →
              </a>
            </div>
          </div>

          {/* Feedback */}
          <div style={{ background: '#F5F8FA', borderRadius: '12px', padding: '20px', border: '0.5px solid #ddd' }}>
            <p style={{ fontSize: '15px', fontWeight: '500', margin: '0 0 12px' }}>Lasst uns die Übung gemeinsam besser machen</p>
            <a href="#" style={{ display: 'block', padding: '14px', background: '#003D82', color: 'white', textAlign: 'center', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>
              Dein Feedback an uns →
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
