'use client';

export default function Home() {
  const submitFeedback = () => {
    const feedbackElement = document.getElementById('feedbackText') as HTMLTextAreaElement;
    const feedback = feedbackElement?.value || '';
    
    if (feedback.trim()) {
      alert('Vielen Dank für dein Feedback!\n\n' + feedback);
      if (feedbackElement) feedbackElement.value = '';
    } else {
      alert('Bitte gib dein Feedback ein.');
    }
  };

  const shareExercise = async () => {
    const title = "Im Doppelfeld Tore sammeln";
    const url = "https://test.coachunited.de/uebung/doppelfeld-tore-sammeln";
    const text = `Ich habe folgende Übung auf COACH UNITED gefunden:\n\n${title}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: url
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.log('Share failed:', err);
        }
      }
    } else {
      const shareText = `${text}\n${url}`;
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Link wurde kopiert! Du kannst ihn jetzt in WhatsApp, Signal etc. einfügen.');
      });
    }
  };

  return (
    <div style={{ 
      maxWidth: '430px', 
      margin: '0 auto', 
      backgroundColor: 'white',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ 
        background: '#003D82', 
        padding: '12px 16px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        position: 'relative' 
      }}>
        <button style={{ 
          position: 'absolute', 
          left: '16px', 
          background: 'none', 
          border: 'none', 
          color: 'white', 
          fontSize: '20px', 
          cursor: 'pointer', 
          padding: '4px' 
        }}>
          ←
        </button>
        <div style={{ 
          color: 'white', 
          fontWeight: 500, 
          fontSize: '16px', 
          letterSpacing: '1px' 
        }}>
          COACH UNITED
        </div>
      </div>

      {/* Grafik Container */}
      <div style={{ 
        background: 'white', 
        aspectRatio: '16/9', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        overflow: 'hidden', 
        marginBottom: '-24px' 
      }}>
        <svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', objectFit: 'contain' }}>
          <defs>
            <g id="player-orange">
              <circle cx="0" cy="-6" r="3" fill="#FF8C42" stroke="#D16A2E" strokeWidth="0.5"/>
              <rect x="-2.5" y="-3" width="5" height="7" rx="1" fill="#FF8C42" stroke="#D16A2E" strokeWidth="0.5"/>
              <line x1="-2" y1="4" x2="-2" y2="10" stroke="#D16A2E" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="2" y1="4" x2="2" y2="10" stroke="#D16A2E" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="-2.5" y1="-1" x2="-4" y2="2" stroke="#D16A2E" strokeWidth="1" strokeLinecap="round"/>
              <line x1="2.5" y1="-1" x2="4" y2="2" stroke="#D16A2E" strokeWidth="1" strokeLinecap="round"/>
            </g>
            
            <g id="player-green">
              <circle cx="0" cy="-6" r="3" fill="#4CAF50" stroke="#388E3C" strokeWidth="0.5"/>
              <rect x="-2.5" y="-3" width="5" height="7" rx="1" fill="#4CAF50" stroke="#388E3C" strokeWidth="0.5"/>
              <line x1="-2" y1="4" x2="-2" y2="10" stroke="#388E3C" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="2" y1="4" x2="2" y2="10" stroke="#388E3C" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="-2.5" y1="-1" x2="-4" y2="2" stroke="#388E3C" strokeWidth="1" strokeLinecap="round"/>
              <line x1="2.5" y1="-1" x2="4" y2="2" stroke="#388E3C" strokeWidth="1" strokeLinecap="round"/>
            </g>
            
            <g id="player-blue">
              <circle cx="0" cy="-6" r="3" fill="#2196F3" stroke="#1976D2" strokeWidth="0.5"/>
              <rect x="-2.5" y="-3" width="5" height="7" rx="1" fill="#2196F3" stroke="#1976D2" strokeWidth="0.5"/>
              <line x1="-2" y1="4" x2="-2" y2="10" stroke="#1976D2" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="2" y1="4" x2="2" y2="10" stroke="#1976D2" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="-2.5" y1="-1" x2="-4" y2="2" stroke="#1976D2" strokeWidth="1" strokeLinecap="round"/>
              <line x1="2.5" y1="-1" x2="4" y2="2" stroke="#1976D2" strokeWidth="1" strokeLinecap="round"/>
            </g>
            
            <g id="player-gray">
              <circle cx="0" cy="-6" r="3" fill="#BDBDBD" stroke="#757575" strokeWidth="0.5"/>
              <rect x="-2.5" y="-3" width="5" height="7" rx="1" fill="#BDBDBD" stroke="#757575" strokeWidth="0.5"/>
              <line x1="-2" y1="4" x2="-2" y2="10" stroke="#757575" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="2" y1="4" x2="2" y2="10" stroke="#757575" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="-2.5" y1="-1" x2="-4" y2="2" stroke="#757575" strokeWidth="1" strokeLinecap="round"/>
              <line x1="2.5" y1="-1" x2="4" y2="2" stroke="#757575" strokeWidth="1" strokeLinecap="round"/>
            </g>
            
            <g id="trainer">
              <circle cx="0" cy="-6" r="3.5" fill="#003D82" stroke="#002855" strokeWidth="0.5"/>
              <rect x="-3" y="-2.5" width="6" height="8" rx="1" fill="#003D82" stroke="#002855" strokeWidth="0.5"/>
              <line x1="-2.5" y1="5.5" x2="-2.5" y2="12" stroke="#002855" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="2.5" y1="5.5" x2="2.5" y2="12" stroke="#002855" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="-3" y1="0" x2="-5" y2="3" stroke="#002855" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="3" y1="0" x2="5" y2="3" stroke="#002855" strokeWidth="1.2" strokeLinecap="round"/>
              <ellipse cx="0" cy="-7" rx="4" ry="1.5" fill="#003D82" stroke="#002855" strokeWidth="0.5"/>
            </g>
            
            <g id="ball">
              <circle cx="0" cy="0" r="3" fill="white" stroke="#333" strokeWidth="0.8"/>
              <path d="M -2,0 Q 0,-2 2,0 Q 0,2 -2,0" fill="none" stroke="#333" strokeWidth="0.6"/>
            </g>
            
            <g id="cone">
              <path d="M 0,-8 L -4,0 L 4,0 Z" fill="#FF6B35" stroke="#D94A1F" strokeWidth="0.5"/>
              <rect x="-4" y="0" width="8" height="2" rx="1" fill="#FF6B35" stroke="#D94A1F" strokeWidth="0.5"/>
            </g>
            
            <g id="goal">
              <rect x="0" y="0" width="30" height="18" fill="none" stroke="#333" strokeWidth="2"/>
              <pattern id="net" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
                <path d="M 0,0 L 6,6 M 6,0 L 0,6" stroke="#666" strokeWidth="0.5"/>
              </pattern>
              <rect x="1" y="1" width="28" height="16" fill="url(#net)" opacity="0.3"/>
            </g>
          </defs>
          
          <rect x="50" y="80" width="220" height="150" fill="none" stroke="#757575" strokeWidth="2" strokeDasharray="8,4"/>
          <rect x="330" y="80" width="220" height="150" fill="none" stroke="#757575" strokeWidth="2" strokeDasharray="8,4"/>
          
          <use href="#cone" transform="translate(50, 72)"/>
          <use href="#cone" transform="translate(270, 72)"/>
          <use href="#cone" transform="translate(50, 238)"/>
          <use href="#cone" transform="translate(270, 238)"/>
          <use href="#cone" transform="translate(330, 72)"/>
          <use href="#cone" transform="translate(550, 72)"/>
          <use href="#cone" transform="translate(330, 238)"/>
          <use href="#cone" transform="translate(550, 238)"/>
          
          <use href="#goal" transform="translate(145, 62)"/>
          <use href="#goal" transform="translate(145, 230)"/>
          <use href="#goal" transform="translate(425, 62)"/>
          <use href="#goal" transform="translate(425, 230)"/>
          
          <use href="#player-orange" transform="translate(100, 110)"/>
          <use href="#player-orange" transform="translate(140, 95)"/>
          <use href="#player-orange" transform="translate(90, 150)"/>
          <use href="#player-orange" transform="translate(130, 185)"/>
          
          <use href="#player-green" transform="translate(180, 110)"/>
          <use href="#player-green" transform="translate(220, 95)"/>
          <use href="#player-green" transform="translate(170, 150)"/>
          <use href="#player-green" transform="translate(210, 185)"/>
          
          <use href="#player-blue" transform="translate(380, 110)"/>
          <use href="#player-blue" transform="translate(420, 95)"/>
          <use href="#player-blue" transform="translate(370, 150)"/>
          <use href="#player-blue" transform="translate(410, 185)"/>
          
          <use href="#player-gray" transform="translate(460, 110)"/>
          <use href="#player-gray" transform="translate(500, 95)"/>
          <use href="#player-gray" transform="translate(450, 150)"/>
          <use href="#player-gray" transform="translate(490, 185)"/>
          
          <use href="#ball" transform="translate(285, 270)"/>
          <use href="#ball" transform="translate(295, 270)"/>
          <use href="#ball" transform="translate(305, 270)"/>
          <use href="#ball" transform="translate(315, 270)"/>
          <use href="#ball" transform="translate(290, 280)"/>
          <use href="#ball" transform="translate(300, 280)"/>
          <use href="#ball" transform="translate(310, 280)"/>
          <use href="#ball" transform="translate(300, 290)"/>
          
          <use href="#trainer" transform="translate(300, 250)"/>
          
          <use href="#ball" transform="translate(160, 155)"/>
          <use href="#ball" transform="translate(440, 155)"/>
        </svg>
      </div>

      {/* Content */}
      <div style={{ padding: '24px' }}>
        
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 600, 
          margin: '0 0 14px', 
          lineHeight: 1.2, 
          color: '#1a1a1a' 
        }}>
          Im Doppelfeld Tore sammeln
        </h1>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          flexWrap: 'wrap', 
          marginBottom: '20px' 
        }}>
          <span style={{ background: '#B8D4E8', color: '#003D82', padding: '4px 8px', borderRadius: '10px', fontSize: '13px', fontWeight: 500 }}>E</span>
          <span style={{ background: '#B8D4E8', color: '#003D82', padding: '4px 8px', borderRadius: '10px', fontSize: '13px', fontWeight: 500 }}>D</span>
          <span style={{ color: '#999', fontSize: '14px', margin: '0 2px' }}>|</span>
          <span style={{ background: '#C8E6C9', color: '#2E7D32', padding: '4px 8px', borderRadius: '10px', fontSize: '13px', fontWeight: 500 }}>Torschuss</span>
          <span style={{ background: '#C8E6C9', color: '#2E7D32', padding: '4px 8px', borderRadius: '10px', fontSize: '13px', fontWeight: 500 }}>Spielübersicht</span>
          <span style={{ color: '#999', fontSize: '14px', margin: '0 2px' }}>|</span>
          <span style={{ background: '#FFE0B2', color: '#E65100', padding: '4px 8px', borderRadius: '10px', fontSize: '13px', fontWeight: 500 }}>Spiel</span>
        </div>

        <p style={{ 
          fontSize: '17px', 
          lineHeight: 1.8, 
          color: '#2a2a2a', 
          margin: '0 0 24px' 
        }}>
          Jeweils zwei Teams treten auf zwei Feldern parallel gegeneinander an. Nach Torerfolg wird der Ball als Trophäe hinter dem eigenen Tor verwahrt.
        </p>

        <details style={{ 
          border: '0.5px solid #e0e0e0', 
          borderRadius: '12px', 
          marginBottom: '16px', 
          overflow: 'hidden' 
        }}>
          <summary style={{ 
            padding: '18px', 
            fontWeight: 500, 
            fontSize: '17px', 
            cursor: 'pointer', 
            userSelect: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: '#1a1a1a' 
          }}>
            <span style={{ flex: 1 }}>🎯 Coaching-Fokus</span>
            <span style={{ fontSize: '20px', color: '#999' }}>›</span>
          </summary>
          <div style={{ 
            padding: '0 18px 18px', 
            borderTop: '0.5px solid #e0e0e0', 
            paddingTop: '16px' 
          }}>
            <ul style={{ 
              margin: 0, 
              paddingLeft: '20px', 
              fontSize: '16px', 
              lineHeight: 1.8, 
              color: '#2a2a2a' 
            }}>
              <li style={{ marginBottom: '10px' }}>Schnell ins Dribbling nach Ballgewinn</li>
              <li style={{ marginBottom: '10px' }}>Torchancen sicher verwerten</li>
              <li>Alle vier Teams gleichzeitig im Blick behalten</li>
            </ul>
          </div>
        </details>

        <details style={{ 
          border: '0.5px solid #e0e0e0', 
          borderRadius: '12px', 
          marginBottom: '16px', 
          overflow: 'hidden' 
        }}>
          <summary style={{ 
            padding: '18px', 
            fontWeight: 500, 
            fontSize: '17px', 
            cursor: 'pointer', 
            userSelect: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: '#1a1a1a' 
          }}>
            <span style={{ flex: 1 }}>🔧 Aufbau</span>
            <span style={{ fontSize: '20px', color: '#999' }}>›</span>
          </summary>
          <div style={{ 
            padding: '0 18px 18px', 
            borderTop: '0.5px solid #e0e0e0', 
            paddingTop: '16px' 
          }}>
            <p style={{ fontSize: '16px', lineHeight: 1.8, margin: 0, color: '#2a2a2a' }}>
              Zwei Felder zu je 40m×20m aufstellen. Etwa 10m Abstand zwischen den Feldern. Je zwei Minitore pro Feld. Vier Teams (zu je vier Spielern) mit Leibchen einteilen. Trainer steht mit 10 Bällen in der Mitte der Felder.
            </p>
          </div>
        </details>

        <details style={{ 
          border: '0.5px solid #e0e0e0', 
          borderRadius: '12px', 
          marginBottom: '16px', 
          overflow: 'hidden' 
        }}>
          <summary style={{ 
            padding: '18px', 
            fontWeight: 500, 
            fontSize: '17px', 
            cursor: 'pointer', 
            userSelect: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: '#1a1a1a' 
          }}>
            <span style={{ flex: 1 }}>▶️ Durchführung</span>
            <span style={{ fontSize: '20px', color: '#999' }}>›</span>
          </summary>
          <div style={{ 
            padding: '0 18px 18px', 
            fontSize: '16px', 
            lineHeight: 1.8, 
            borderTop: '0.5px solid #e0e0e0', 
            paddingTop: '16px', 
            color: '#2a2a2a' 
          }}>
            <p style={{ margin: '0 0 14px' }}>
              Auf beiden Feldern wird parallel ein 4 gegen 4 gespielt, so dass alle vier Teams gleichzeitig spielen. Bei Torerfolg wird der Ball von der erfolgreichen Mannschaft aus dem Tor geholt und hinter dem eigenen Tor abgelegt. Der Trainer spielt einen neuen Ball ein.
            </p>
            <p style={{ margin: 0 }}>
              Wer hat die meisten Bälle hinter dem Tor, sobald die 10 Bälle durchgespielt sind?
            </p>
          </div>
        </details>

        <details style={{ 
          border: '0.5px solid #e0e0e0', 
          borderRadius: '12px', 
          marginBottom: '16px', 
          overflow: 'hidden' 
        }}>
          <summary style={{ 
            padding: '18px', 
            fontWeight: 500, 
            fontSize: '17px', 
            cursor: 'pointer', 
            userSelect: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: '#1a1a1a' 
          }}>
            <span style={{ flex: 1 }}>👶 Übung leichter machen</span>
            <span style={{ fontSize: '20px', color: '#999' }}>›</span>
          </summary>
          <div style={{ 
            padding: '0 18px 18px', 
            borderTop: '0.5px solid #e0e0e0', 
            paddingTop: '16px' 
          }}>
            <p style={{ fontSize: '16px', lineHeight: 1.8, margin: 0, color: '#2a2a2a' }}>
              Kleinere Felder verwenden (30m×15m). Nur 3 gegen 3 spielen lassen.
            </p>
          </div>
        </details>

        <details style={{ 
          border: '0.5px solid #e0e0e0', 
          borderRadius: '12px', 
          marginBottom: '24px', 
          overflow: 'hidden' 
        }}>
          <summary style={{ 
            padding: '18px', 
            fontWeight: 500, 
            fontSize: '17px', 
            cursor: 'pointer', 
            userSelect: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: '#1a1a1a' 
          }}>
            <span style={{ flex: 1 }}>💪 Übung schwieriger machen</span>
            <span style={{ fontSize: '20px', color: '#999' }}>›</span>
          </summary>
          <div style={{ 
            padding: '0 18px 18px', 
            borderTop: '0.5px solid #e0e0e0', 
            paddingTop: '16px' 
          }}>
            <p style={{ fontSize: '16px', lineHeight: 1.8, margin: 0, color: '#2a2a2a' }}>
              Vor einem Torerfolg muss jeder einzelne Spieler eines Teams den Ball mindestens ein Mal berührt haben.
            </p>
          </div>
        </details>

        <div style={{ 
          background: '#CCE0F4', 
          borderRadius: '12px', 
          padding: '18px', 
          marginBottom: '24px' 
        }}>
          <p style={{ 
            fontWeight: 500, 
            fontSize: '14px', 
            margin: '0 0 12px', 
            color: '#003D82', 
            textTransform: 'uppercase', 
            letterSpacing: '0.5px' 
          }}>
            Übungen mit gleichem Aufbau
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a href="#" style={{ 
              display: 'block', 
              padding: '12px', 
              background: 'white', 
              border: '0.5px solid rgba(0,61,130,0.15)', 
              borderRadius: '8px', 
              textDecoration: 'none', 
              color: '#003D82', 
              fontSize: '15px' 
            }}>
              Parallel-Spiele mit Torzählung →
            </a>
          </div>
        </div>

        <div style={{ 
          background: '#F5F8FA', 
          borderRadius: '12px', 
          padding: '20px', 
          border: '0.5px solid #e0e0e0', 
          marginBottom: '20px' 
        }}>
          <p style={{ 
            fontSize: '16px', 
            fontWeight: 500, 
            margin: '0 0 14px', 
            color: '#1a1a1a' 
          }}>
            Lasst uns die Übung gemeinsam besser machen:
          </p>
          <textarea 
            id="feedbackText"
            placeholder="Dein Feedback an uns"
            style={{ 
              width: '100%', 
              minHeight: '100px', 
              padding: '14px', 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              fontSize: '16px', 
              fontFamily: 'inherit', 
              resize: 'vertical', 
              marginBottom: '12px', 
              boxSizing: 'border-box' 
            }}
          />
          <button 
            onClick={submitFeedback} 
            style={{ 
              width: '100%', 
              padding: '14px', 
              background: '#003D82', 
              color: 'white', 
              textAlign: 'center', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '16px', 
              fontWeight: 500, 
              cursor: 'pointer' 
            }}
          >
            Feedback absenden
          </button>
        </div>

        <div style={{ 
          background: '#F5F8FA', 
          borderRadius: '12px', 
          padding: '20px', 
          border: '0.5px solid #e0e0e0' 
        }}>
          <button 
            onClick={shareExercise} 
            style={{ 
              width: '100%', 
              padding: '14px', 
              background: 'white', 
              color: '#003D82', 
              textAlign: 'center', 
              border: '1px solid #003D82', 
              borderRadius: '8px', 
              fontSize: '16px', 
              fontWeight: 500, 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px' 
            }}
          >
            <span style={{ fontSize: '18px' }}>↗</span>
            <span>Übung weiterempfehlen</span>
          </button>
        </div>

      </div>

      <style jsx>{`
        details summary::-webkit-details-marker { 
          display: none; 
        }
        details[open] summary span:last-child { 
          transform: rotate(90deg); 
        }
        details summary span:last-child { 
          transition: transform 0.2s; 
        }
        textarea::placeholder {
          color: #999;
        }
      `}</style>
    </div>
  );
}
