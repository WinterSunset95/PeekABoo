import { IonCard, IonCardHeader, IonCardTitle, IonImg, IonCardSubtitle, IonCardContent } from "@ionic/react";
import "./DetailCard.css"

interface DetailCardProps {
    imageUrl: string;
    title: string;
    linkUrl: string;
    type?: string;
    year?: string;
    duration?: string;
    overview?: string;
}

const DetailCard: React.FC<DetailCardProps> = ({ imageUrl, title, linkUrl, type, year, duration, overview }) => {
    const subtitleParts = [
        type ? type.charAt(0).toUpperCase() + type.slice(1) : undefined,
        year,
        duration
    ].filter(Boolean);

    const shortenedOverview = overview && overview.length > 100 ? `${overview.substring(0, 100)}...` : overview;

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
                {shortenedOverview &&
                    <IonCardContent style={{ paddingTop: 0, fontSize: '0.9em' }}>
                        {shortenedOverview}
                    </IonCardContent>}
            </div>
          </div>
        </IonCard>
    );
};

export default DetailCard;
