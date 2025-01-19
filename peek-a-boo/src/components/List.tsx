import {
	IonPage,
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar
} from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { MovieSearchResult } from '../lib/types';
import Card from './Card';
import 'swiper/css'

const List: React.FC<MovieSearchResult[]> = (list) => {
	return (
		<Swiper
			spaceBetween={5}
			slidesPerView={2}
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
