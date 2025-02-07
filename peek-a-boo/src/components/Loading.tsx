import { useEffect, useRef } from "react"
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react"
import "./Loading.css"
import { IonContent, IonPage, IonText, IonTitle, IonToolbar } from "@ionic/react"

const LoadingComponent: React.FC<{ choice: "card" | "card_large" | "list" | "full_page" | undefined }> = ({ choice }) => {
    /* Loading components here all take up the full size of their parent */

    if (choice == "list") {
        const swiper = useRef<SwiperRef>(null)
        useEffect(() => {
            const swiperRef = swiper.current?.swiper
            if (!swiperRef) return;
            swiperRef.slideTo(1)
        }, [swiper])
        return (
            <Swiper
                spaceBetween={10}
                slidesPerView={2}
                centeredSlides={true}
                ref={swiper}
                direction="horizontal"
            >
                {Array.from({ length: 5}, (_, index) => (
                    <SwiperSlide key={index} className="loading-component-list">
                    </SwiperSlide>
                ))}
            </Swiper>
        )
    }

    if (choice == "card_large") {
        return (
            <div className="loading-component-card-large">
            </div>
        )
    }

    if (choice == "full_page") {
        return (
            <IonPage>
                <IonToolbar style={{ padding: '0.5rem'}}>
                    <IonTitle slot="start"><div className="loading-episode-name"></div></IonTitle>
                </IonToolbar>
                <IonContent>
                    <div className="loading-container">
                        <div className="loading-top">
                            <div className="loading-image"></div>
                            <div className="loading-episode-name"></div>
                            <div className="loading-episodes">
                                <div className="loading-episode"></div>
                                <div className="loading-episode"></div>
                                <div className="loading-episode"></div>
                                <div className="loading-episode"></div>
                                <div className="loading-episode"></div>
                            </div>
                        </div>
                        <div className="loading-bottom"></div>
                    </div>
                </IonContent>
            </IonPage>
        )
    }

    return (
        <div className="loading-component-card loading-component">
        </div>
    )
}

export default LoadingComponent