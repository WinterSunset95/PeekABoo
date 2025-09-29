import React, { useContext, useEffect, useRef, useState } from 'react';
import { IonButton, IonIcon, IonProgressBar, IonSpinner } from '@ionic/react';
import { closeCircleOutline } from 'ionicons/icons';
import { database } from '../lib/firebase';
import { ref, onValue, set, serverTimestamp, remove, off, update } from 'firebase/database';
import { PlaybackState } from '../lib/models';
import { UserContext } from '../App';
import './WatchTogetherPlayer.css';
import ReactPlayer from 'react-player';

interface WatchTogetherPlayerProps {
  convoId: string;
}

const WatchTogetherPlayer: React.FC<WatchTogetherPlayerProps> = ({ convoId }) => {
  const { user } = useContext(UserContext);
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(null);
  const playerRef = useRef<ReactPlayer>(null);
  const isUpdatingFromRemote = useRef(false);
  const lastTimeUpdateSent = useRef(0);
  const sessionRef = ref(database, `playback_sessions/${convoId}`);

  useEffect(() => {
    const listener = onValue(sessionRef, (snapshot) => {
      const data = snapshot.val() as PlaybackState | null;
      setPlaybackState(data);

      if (data && playerRef.current && user) {
        if (data.lastUpdatedBy !== user.uid) {
          isUpdatingFromRemote.current = true;

          // Note: play/pause state is synced declaratively via the `playing` prop on ReactPlayer.

          // Sync progress, accounting for latency
          const player = playerRef.current;
          const currentTime = player.getCurrentTime() || 0;
          const timeDiff = Math.abs(currentTime - data.progress);
          if (timeDiff > 2) { // 2-second tolerance
            player.seekTo(data.progress, 'seconds');
          }
          
          setTimeout(() => { isUpdatingFromRemote.current = false; }, 100);
        }
      }
    });

    return () => off(sessionRef, 'value', listener);
  }, [convoId, user]);

  const updateRtdbState = (updates: Partial<PlaybackState>) => {
    if (!user) return;
    update(sessionRef, {
      ...updates,
      lastUpdatedBy: user.uid,
      timestamp: serverTimestamp(),
    });
  };
  
  const handlePlay = () => !isUpdatingFromRemote.current && updateRtdbState({ isPlaying: true });
  const handlePause = () => !isUpdatingFromRemote.current && updateRtdbState({ isPlaying: false });
  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number; }) => {
    if (playerRef.current && !isUpdatingFromRemote.current) {
      const currentTime = state.playedSeconds;
      const now = Date.now();
      // Throttle updates to every 1 second
      if (now - lastTimeUpdateSent.current > 1000) {
        lastTimeUpdateSent.current = now;
        updateRtdbState({ progress: currentTime });
      }
    }
  };
  
  const handleCloseSession = () => remove(sessionRef);

  useEffect(() => {
    console.log(playbackState)
  }, [playbackState])

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
      <div className="player-wrapper">
        <ReactPlayer
          ref={playerRef}
          src={playbackState.mediaUrl}
          playing={playbackState.isPlaying}
          controls
          onPlay={handlePlay}
          onPause={handlePause}
          onProgress={handleProgress}
          className="react-player"
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
};

export default WatchTogetherPlayer;
