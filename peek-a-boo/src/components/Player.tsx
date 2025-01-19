import { useEffect, useRef } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import { PlayerOptions } from '../lib/types';

import "./Player.css"
import Player from 'video.js/dist/types/player';

const PlayerComponent: React.FC<PlayerOptions> = (options) => {

	const videoRef = useRef<HTMLDivElement>(null);
	const playerRef = useRef<Player>(null);

	const setupPlayer = () => {
		const videoElement = document.createElement("video-js")
		videoElement.classList.add('vjs-big-play-centered')
		videoRef.current!.appendChild(videoElement)

		const player = playerRef.current = videojs(videoElement, options, () => console.log("Player initialized"))
		console.log(player)
	}

	const resetPlayer = () => {
		if (!playerRef.current) return;
		const player = playerRef.current
		player.dispose()
		setupPlayer()
	}

	useEffect(() => {
		if (!playerRef.current) {
			setupPlayer()
		} else {
			resetPlayer()
		}
		console.log("Options changed")
	}, [options])

	return (
		<div data-vjs-player className="player-container">
			<div ref={videoRef}></div>
		</div>
	)
}

export default PlayerComponent
