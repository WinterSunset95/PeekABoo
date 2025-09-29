import React, { useContext, useEffect, useRef, useState } from 'react';
import { database } from '../lib/firebase';
import { ref, onValue, set, serverTimestamp, remove, off, update } from 'firebase/database';
import { PlaybackState } from '../lib/models';
import { UserContext } from '../App';
import ReactPlayer from 'react-player';
import { Button } from './ui/button';
import { XCircle } from 'lucide-react';

interface WatchTogetherPlayerProps {
  convoId: string;
}

const WatchTogetherPlayer: React.FC<WatchTogetherPlayerProps> = ({ convoId }) => {
  const { user } = useContext(UserContext);
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(null);
  const playerRef = useRef<ReactPlayer>(null);
  const isUpdatingFromRemote = useRef(false);
  const isSeekingLocally = useRef(false);
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
          const player = playerRef.current as any;
          const currentTime = player.currentTime || 0;
          const timeDiff = Math.abs(currentTime - data.progress);
          if (timeDiff > 2) { // 2-second tolerance
            player.currentTime = data.progress;
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
  
  const handlePlay = () => {
    if (!isUpdatingFromRemote.current && playerRef.current) {
      updateRtdbState({ isPlaying: true, progress: (playerRef.current as any).currentTime || 0 });
    }
  };
  const handlePause = () => {
    if (!isUpdatingFromRemote.current && playerRef.current) {
      updateRtdbState({ isPlaying: false, progress: (playerRef.current as any).currentTime || 0 });
    }
  };

  const handleSeek = (seconds: number) => {
    if (!isUpdatingFromRemote.current) {
      updateRtdbState({ progress: seconds });
      lastTimeUpdateSent.current = Date.now();
    }
  };

  const handleSeeking = (seeking: boolean) => {
    if (!isUpdatingFromRemote.current) {
      isSeekingLocally.current = seeking;
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
    <div className="sticky top-0 bg-background z-50 p-2 border-b border-border shadow-lg">
      <div className="flex justify-between items-center mb-1">
        <p className="text-sm font-bold text-foreground truncate">{playbackState.title}</p>
        <Button variant="ghost" size="icon" onClick={handleCloseSession} className="text-muted-foreground">
          <XCircle className="h-6 w-6" />
        </Button>
      </div>
      <div className="relative pt-[56.25%]">
        <ReactPlayer
          ref={playerRef}
          url={playbackState.mediaUrl}
          playing={playbackState.isPlaying}
          controls
          onPlay={handlePlay}
          onPause={handlePause}
          onSeek={handleSeek}
          onSeeking={handleSeeking}
          className="absolute top-0 left-0"
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
};

export default WatchTogetherPlayer;
