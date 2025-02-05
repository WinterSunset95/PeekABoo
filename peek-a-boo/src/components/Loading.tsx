import { useEffect, useRef } from "react"
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react"
import "./Loading.css"

const LoadingComponent: React.FC<{ choice: "card" | "card_large" | "list" | undefined }> = ({ choice }) => {
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
                spaceBetween={5}
                slidesPerView={2}
                centeredSlides={true}
                ref={swiper}
                direction="horizontal"
            >
                {Array.from({ length: 5}, (_, index) => (
                    <SwiperSlide key={index}>
                        <div className="loading-component-list loading-component">
                            <div className="spinner"></div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        )
    }

    if (choice == "card_large") {
        return (
            <div className="loading-component-card-large loading-component">
                <div className="spinner"></div>
            </div>
        )
    }

    return (
        <div className="loading-component-card loading-component">
            <div className="spinner"></div>
        </div>
    )
}

export default LoadingComponent