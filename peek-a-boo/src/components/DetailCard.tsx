import { IonCard, IonCardHeader, IonCardTitle, IonImg, IonCardSubtitle } from "@ionic/react";
import "./DetailCard.css"

interface DetailCardProps {
    imageUrl: string;
    title: string;
    linkUrl: string;
    type?: string;
    year?: string;
    duration?: string;
}

const DetailCard: React.FC<DetailCardProps> = ({ imageUrl, title, linkUrl, type, year, duration }) => {
    const subtitleParts = [
        type ? type.charAt(0).toUpperCase() + type.slice(1) : undefined,
        year,
        duration
    ].filter(Boolean);

    return (
        <IonCard
            routerLink={linkUrl}
        >
          <div className="detail-card-container">
            <IonImg
                src={imageUrl}
                style={{ width: '5rem', aspectRatio: '9/16', objectFit: 'cover' }}
            />
            <div>
                <IonCardHeader>
                    <IonCardTitle>{title}</IonCardTitle>
                    {subtitleParts.length > 0 && <IonCardSubtitle>{subtitleParts.join(" • ")}</IonCardSubtitle>}
                </IonCardHeader>
            </div>
          </div>
        </IonCard>
    );
};

export default DetailCard;
