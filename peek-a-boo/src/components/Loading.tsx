import { useEffect, useRef } from "react"
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react"

const LoadingComponent: React.FC<{ choice: "card" | "card_large" | "list" | "full_page" | "vert-list" | undefined }> = ({ choice }) => {
    /* Loading components here all take up the full size of their parent */

    if (choice == "vert-list") {
        return (
            <div className="space-y-4">
                {Array.from({ length: 5 }, (_, index) => (
                    <div key={index} className="flex items-center w-full animate-pulse">
                        <div className="w-24 h-32 bg-muted rounded-lg flex-shrink-0"></div>
                        <div className="ml-4 flex-1 space-y-2">
                            <div className="h-5 w-3/4 bg-muted rounded-lg"></div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

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
                slidesPerView={2.5}
                centeredSlides={true}
                ref={swiper}
                direction="horizontal"
            >
                {Array.from({ length: 5 }, (_, index) => (
                    <SwiperSlide key={index} className="aspect-[2/3] bg-muted animate-pulse rounded-lg">
                    </SwiperSlide>
                ))}
            </Swiper>
        )
    }

    if (choice == "card_large") {
        return (
            <div className="w-full aspect-video bg-muted animate-pulse rounded-lg">
            </div>
        )
    }

    if (choice == "full_page") {
        return (
            <div className="flex flex-col h-screen bg-background">
                <header className="p-4 border-b">
                    <div className="w-1/2 h-8 bg-muted animate-pulse rounded-md"></div>
                </header>
                <main className="flex-grow p-4 space-y-4 animate-pulse">
                    <div className="w-full aspect-video bg-muted rounded-lg"></div>
                    <div className="w-3/4 h-8 bg-muted rounded-md"></div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {Array.from({ length: 5 }, (_, index) => (
                            <div key={index} className="h-12 bg-muted rounded-md"></div>
                        ))}
                    </div>
                    <div className="w-full h-40 bg-muted rounded-lg"></div>
                </main>
            </div>
        )
    }

    return (
        <div className="w-full aspect-[2/3] bg-muted animate-pulse rounded-lg">
        </div>
    )
}

export default LoadingComponent
