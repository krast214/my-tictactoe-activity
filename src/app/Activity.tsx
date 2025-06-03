// /src/app/Activity.tsx - Enhanced with Discord user info

import { useDiscordSdk } from '../hooks/useDiscordSdk';
import { useEffect, useState } from 'react';

export default function Activity() {
  const { discordSdk, status } = useDiscordSdk();
  const [user, setUser] = useState(null);
  const [channelId, setChannelId] = useState(null);
  
  useEffect(() => {
    if (discordSdk && status === 'ready') {
      // Get current user info
      discordSdk.commands.authenticate({
        scope: ['identify']
      }).then((auth) => {
        setUser(auth.user);
        
        // Pass user info to Unity
        if (window.unityInstance) {
          window.unityInstance.SendMessage('MultiplayerManager', 'SetDiscordUser', JSON.stringify({
            id: auth.user.id,
            username: auth.user.username,
            avatar: auth.user.avatar
          }));
        }
      });
      
      // Get channel info for multiplayer matching
      setChannelId(discordSdk.channelId);
    }
  }, [discordSdk, status]);

  // Function to create multiplayer game for this channel
  const createChannelGame = () => {
    if (window.unityInstance && channelId) {
      window.unityInstance.SendMessage('MultiplayerManager', 'CreateChannelGame', channelId);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Unity Game */}
      <iframe 
        id="dissonity-child" 
        src=".proxy/index.html" 
        height="100vh" 
        width="100vw" 
        scrolling="no"
        style={{ border: 'none' }}
      />
      
      {/* Discord UI Overlay */}
      {user && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          <div>Playing as: {user.username}</div>
          <button 
            onClick={createChannelGame}
            style={{
              marginTop: '5px',
              padding: '5px 10px',
              background: '#5865F2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Start Multiplayer Game
          </button>
        </div>
      )}
    </div>
  );
}