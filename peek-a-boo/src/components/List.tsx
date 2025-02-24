import {
	IonPage,
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar
} from '@ionic/react';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import { MovieSearchResult } from '../lib/types';
import Card from './Card';
import 'swiper/css'
import 'swiper/css/bundle'
import { useEffect, useRef } from 'react';
import { AutoplayOptions } from 'swiper/types';
import { Autoplay, Navigation, Zoom } from 'swiper/modules';

const List: React.FC<MovieSearchResult[]> = (list) => {
	const swiper = useRef<SwiperRef>(null)
	useEffect(() => {
		const swiperRef = swiper.current?.swiper
		if (!swiperRef) return;
		swiperRef.slideTo(1)
		swiperRef.loopCreate()
		if (!swiperRef.autoplay) return;
	},[swiper])
	return (
		<Swiper
			spaceBetween={5}
			slidesPerView={2}
			centeredSlides={true}
			autoplay={true}
			ref={swiper}
			modules={[Autoplay, Navigation, Zoom]}
		>
			{Object.keys(list).map((item, index) => (
				<SwiperSlide key={index}>
					<Card {...list[index]} />
				</SwiperSlide>
			))}
		</Swiper>
	)
}

export default List
