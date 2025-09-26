import { IonCard, IonCardHeader, IonCardTitle, IonImg, IonCardSubtitle } from "@ionic/react";

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
            style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '10px 0' }}
        >
            <IonImg
                src={imageUrl}
                style={{ width: '100px', minWidth: '100px', height: '150px', objectFit: 'cover' }}
            />
            <div style={{ flex: 1 }}>
                <IonCardHeader>
                    <IonCardTitle>{title}</IonCardTitle>
                    {subtitle && <IonCardSubtitle>{subtitle}</IonCardSubtitle>}
                </IonCardHeader>
            </div>
        </IonCard>
    );
};

export default DetailCard;
