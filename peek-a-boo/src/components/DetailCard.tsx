import { IonCard, IonCardHeader, IonCardTitle, IonImg, IonCardSubtitle } from "@ionic/react";
import "./DetailCard.css"

interface DetailCardProps {
    imageUrl: string;
    title: string;
    linkUrl: string;
    subtitle?: string;
}

const DetailCard: React.FC<DetailCardProps> = ({ imageUrl, title, linkUrl, subtitle }) => {
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
                    {subtitle && <IonCardSubtitle>{subtitle}</IonCardSubtitle>}
                </IonCardHeader>
            </div>
          </div>
        </IonCard>
    );
};

export default DetailCard;
