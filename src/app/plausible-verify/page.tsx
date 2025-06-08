export default function PlausibleVerifyPage() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Plausible Verification - Refill AI</title>
        
        <style dangerouslySetInnerHTML={{
          __html: `
            body {
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 50px auto;
              padding: 20px;
              text-align: center;
            }
            .status {
              padding: 20px;
              margin: 20px 0;
              border-radius: 8px;
              font-weight: bold;
            }
            .success { background: #d4edda; color: #155724; }
            .loading { background: #fff3cd; color: #856404; }
            button {
              background: #007bff;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 5px;
              cursor: pointer;
              margin: 10px;
            }
          `
        }} />
      </head>
      <body>
        <h1>🔍 Plausible Analytics Verification</h1>
        <p>This page helps verify Plausible Analytics integration for refillai.online</p>
        
        <div id="status" className="status loading">
          ⏳ Checking Plausible Analytics...
        </div>
        
        <button onClick={() => (window as any).sendTestEvent?.()}>Send Test Event</button>
        <button onClick={() => (window as any).sendPageView?.()}>Send Page View</button>
        <button onClick={() => (window as any).sendMultipleEvents?.()}>Send Multiple Events</button>
        
        <div id="log" style={{marginTop: '20px', textAlign: 'left', background: '#f8f9fa', padding: '15px', borderRadius: '5px'}}>
          <strong>Event Log:</strong><br />
          <div id="logContent"></div>
        </div>

        <script dangerouslySetInnerHTML={{
          __html: `
            let eventCount = 0;
            
            function log(message) {
              const logContent = document.getElementById('logContent');
              const timestamp = new Date().toLocaleTimeString();
              logContent.innerHTML += '[' + timestamp + '] ' + message + '<br>';
              console.log(message);
            }
            
            function checkPlausible() {
              const statusDiv = document.getElementById('status');
              
              if (typeof window.plausible !== 'undefined') {
                statusDiv.className = 'status success';
                statusDiv.innerHTML = '✅ Plausible Analytics loaded successfully!';
                log('✅ Plausible Analytics detected and working');
                
                setTimeout(() => {
                  sendTestEvent();
                  sendPageView();
                }, 1000);
                
              } else {
                statusDiv.className = 'status loading';
                statusDiv.innerHTML = '❌ Plausible Analytics not detected';
                log('❌ Plausible Analytics not found');
              }
            }
            
            window.sendTestEvent = function() {
              if (window.plausible) {
                eventCount++;
                window.plausible('Verification Test', {
                  props: {
                    test_type: 'manual',
                    event_number: eventCount,
                    page: 'verification',
                    timestamp: new Date().toISOString()
                  }
                });
                log('📊 Test event #' + eventCount + ' sent');
              } else {
                log('❌ Cannot send test event - Plausible not loaded');
              }
            };
            
            window.sendPageView = function() {
              if (window.plausible) {
                window.plausible('pageview', {
                  props: {
                    page: 'plausible-verify',
                    verification: 'true'
                  }
                });
                log('📄 Page view event sent');
              } else {
                log('❌ Cannot send page view - Plausible not loaded');
              }
            };
            
            window.sendMultipleEvents = function() {
              const events = [
                { name: 'Verification Start', props: { action: 'start' } },
                { name: 'Feature Test', props: { feature: 'analytics' } },
                { name: 'Integration Check', props: { status: 'active' } },
                { name: 'Verification Complete', props: { action: 'complete' } }
              ];
              
              events.forEach((event, index) => {
                setTimeout(() => {
                  if (window.plausible) {
                    window.plausible(event.name, { props: event.props });
                    log('📊 Event sent: ' + event.name);
                  }
                }, index * 500);
              });
            };
            
            document.addEventListener('DOMContentLoaded', function() {
              log('🚀 Verification page loaded');
              
              checkPlausible();
              
              setTimeout(checkPlausible, 2000);
              
              setInterval(() => {
                if (window.plausible) {
                  window.plausible('Heartbeat', {
                    props: {
                      timestamp: new Date().toISOString(),
                      session_duration: Math.floor(Date.now() / 1000)
                    }
                  });
                  log('💓 Heartbeat event sent');
                }
              }, 30000);
            });
            
            window.addEventListener('beforeunload', function() {
              if (window.plausible) {
                window.plausible('Verification End', {
                  props: {
                    events_sent: eventCount,
                    session_end: new Date().toISOString()
                  }
                });
              }
            });
          `
        }} />
      </body>
    </html>
  );
} 