'use client';

import { useEffect } from 'react';
import Head from 'next/head';

export default function PlausibleVerifyPage() {
  useEffect(() => {
    // 定义全局函数
    let eventCount = 0;
    
    function log(message: string) {
      const logContent = document.getElementById('logContent');
      const timestamp = new Date().toLocaleTimeString();
      if (logContent) {
        logContent.innerHTML += `[${timestamp}] ${message}<br>`;
      }
      console.log(message);
    }
    
    function checkPlausible() {
      const statusDiv = document.getElementById('status');
      
      if (typeof (window as any).plausible !== 'undefined') {
        if (statusDiv) {
          statusDiv.className = 'status success';
          statusDiv.innerHTML = '✅ Plausible Analytics loaded successfully!';
        }
        log('✅ Plausible Analytics detected and working');
        
        setTimeout(() => {
          sendTestEvent();
          sendPageView();
        }, 1000);
        
      } else {
        if (statusDiv) {
          statusDiv.className = 'status loading';
          statusDiv.innerHTML = '❌ Plausible Analytics not detected';
        }
        log('❌ Plausible Analytics not found');
      }
    }
    
    function sendTestEvent() {
      if ((window as any).plausible) {
        eventCount++;
        (window as any).plausible('Verification Test', {
          props: {
            test_type: 'manual',
            event_number: eventCount,
            page: 'verification',
            timestamp: new Date().toISOString()
          }
        });
        log(`📊 Test event #${eventCount} sent`);
      } else {
        log('❌ Cannot send test event - Plausible not loaded');
      }
    }
    
    function sendPageView() {
      if ((window as any).plausible) {
        (window as any).plausible('pageview', {
          props: {
            page: 'plausible-verify',
            verification: 'true'
          }
        });
        log('📄 Page view event sent');
      } else {
        log('❌ Cannot send page view - Plausible not loaded');
      }
    }
    
    function sendMultipleEvents() {
      const events = [
        { name: 'Verification Start', props: { action: 'start' } },
        { name: 'Feature Test', props: { feature: 'analytics' } },
        { name: 'Integration Check', props: { status: 'active' } },
        { name: 'Verification Complete', props: { action: 'complete' } }
      ];
      
      events.forEach((event, index) => {
        setTimeout(() => {
          if ((window as any).plausible) {
            (window as any).plausible(event.name, { props: event.props });
            log(`📊 Event sent: ${event.name}`);
          }
        }, index * 500);
      });
    }
    
    // 将函数绑定到window对象
    (window as any).sendTestEvent = sendTestEvent;
    (window as any).sendPageView = sendPageView;
    (window as any).sendMultipleEvents = sendMultipleEvents;
    
    // 初始化
    log('🚀 Verification page loaded');
    checkPlausible();
    setTimeout(checkPlausible, 2000);
    
    // 定期心跳
    const heartbeatInterval = setInterval(() => {
      if ((window as any).plausible) {
        (window as any).plausible('Heartbeat', {
          props: {
            timestamp: new Date().toISOString(),
            session_duration: Math.floor(Date.now() / 1000)
          }
        });
        log('💓 Heartbeat event sent');
      }
    }, 30000);
    
    // 页面卸载事件
    const handleBeforeUnload = () => {
      if ((window as any).plausible) {
        (window as any).plausible('Verification End', {
          props: {
            events_sent: eventCount,
            session_end: new Date().toISOString()
          }
        });
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // 清理函数
    return () => {
      clearInterval(heartbeatInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Plausible Verification - Refill AI</title>
      </Head>
      
      <div style={{
        fontFamily: 'Arial, sans-serif',
        maxWidth: '600px',
        margin: '50px auto',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1>🔍 Plausible Analytics Verification</h1>
        <p>This page helps verify Plausible Analytics integration for refillai.online</p>
        
        <div 
          id="status" 
          style={{
            padding: '20px',
            margin: '20px 0',
            borderRadius: '8px',
            fontWeight: 'bold',
            background: '#fff3cd',
            color: '#856404'
          }}
        >
          ⏳ Checking Plausible Analytics...
        </div>
        
        <button 
          onClick={() => (window as any).sendTestEvent?.()}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            margin: '10px'
          }}
        >
          Send Test Event
        </button>
        
        <button 
          onClick={() => (window as any).sendPageView?.()}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            margin: '10px'
          }}
        >
          Send Page View
        </button>
        
        <button 
          onClick={() => (window as any).sendMultipleEvents?.()}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            margin: '10px'
          }}
        >
          Send Multiple Events
        </button>
        
        <div 
          id="log" 
          style={{
            marginTop: '20px',
            textAlign: 'left',
            background: '#f8f9fa',
            padding: '15px',
            borderRadius: '5px'
          }}
        >
          <strong>Event Log:</strong><br />
          <div id="logContent"></div>
        </div>
      </div>
    </>
  );
} 