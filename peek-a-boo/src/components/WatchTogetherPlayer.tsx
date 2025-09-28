import React, { useContext, useEffect, useRef, useState } from 'react';
import { IonButton, IonIcon, IonProgressBar, IonSpinner } from '@ionic/react';
import { closeCircleOutline } from 'ionicons/icons';
import { database } from '../lib/firebase';
import { ref, onValue, set, serverTimestamp, remove, off } from 'firebase/database';
import { PlaybackState } from '../lib/models';
import { UserContext } from '../App';
import './WatchTogetherPlayer.css';

interface WatchTogetherPlayerProps {
  convoId: string;
}

const WatchTogetherPlayer: React.FC<WatchTogetherPlayerProps> = ({ convoId }) => {
  const { user } = useContext(UserContext);
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(null);
  const playerRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const isUpdatingFromRemote = useRef(false);
  const sessionRef = ref(database, `playback_sessions/${convoId}`);

  useEffect(() => {
    const listener = onValue(sessionRef, (snapshot) => {
      const data = snapshot.val() as PlaybackState | null;
      setPlaybackState(data);

      if (data && playerRef.current && user) {
        isUpdatingFromRemote.current = true;
        
        if (data.lastUpdatedBy !== user.uid) {
          const player = playerRef.current;
          // Sync play/pause state
          if (data.isPlaying && player.paused) {
            player.play().catch(e => console.error("Autoplay failed", e));
          } else if (!data.isPlaying && !player.paused) {
            player.pause();
          }

          // Sync progress, accounting for latency
          const timeDiff = Math.abs(player.currentTime - data.progress);
          if (timeDiff > 2) { // 2-second tolerance
            player.currentTime = data.progress;
          }
        }
        
        setTimeout(() => { isUpdatingFromRemote.current = false; }, 100);
      }
    });

    return () => off(sessionRef, 'value', listener);
  }, [convoId, user]);

  const updateRtdbState = (updates: Partial<PlaybackState>) => {
    if (!user) return;
    set(sessionRef, {
      ...playbackState,
      ...updates,
      lastUpdatedBy: user.uid,
      timestamp: serverTimestamp(),
    });
  };
  
  const handlePlay = () => !isUpdatingFromRemote.current && updateRtdbState({ isPlaying: true });
  const handlePause = () => !isUpdatingFromRemote.current && updateRtdbState({ isPlaying: false });
  const handleTimeUpdate = () => {
    if (playerRef.current && !isUpdatingFromRemote.current) {
      updateRtdbState({ progress: playerRef.current.currentTime });
    }
  };
  
  const handleCloseSession = () => remove(sessionRef);

  if (!playbackState) {
    return null;
  }

  return (
    <div className="watch-together-player">
      <div className="player-header">
        <p className="player-title">{playbackState.title}</p>
        <IonButton fill="clear" color="light" onClick={handleCloseSession}>
          <IonIcon slot="icon-only" icon={closeCircleOutline} />
        </IonButton>
      </div>
      {playbackState.mediaType === 'video' ? (
        <video
          ref={playerRef as React.RefObject<HTMLVideoElement>}
          src={playbackState.mediaUrl}
          controls
          onPlay={handlePlay}
          onPause={handlePause}
          onTimeUpdate={handleTimeUpdate}
          className="media-element"
        />
      ) : (
        <audio
          ref={playerRef as React.RefObject<HTMLAudioElement>}
          src={playbackState.mediaUrl}
          controls
          onPlay={handlePlay}
          onPause={handlePause}
          onTimeUpdate={handleTimeUpdate}
          className="media-element"
        />
      )}
    </div>
  );
};

export default WatchTogetherPlayer;
