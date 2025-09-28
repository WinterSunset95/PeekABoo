import React from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton, IonIcon } from '@ionic/react';
import { MovieInfo } from '../lib/types';
import './FeaturedCard.css';
import { playCircleOutline } from 'ionicons/icons';

interface FeaturedCardProps {
  item: MovieInfo;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ item }) => {
  const backgroundStyle = {
    backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.9) 10%, transparent 90%), url(${item.Poster})`,
  };

  return (
    <IonCard className="featured-card" style={backgroundStyle} routerLink={`/${item.Type}/${item.Id}`}>
      <div className="featured-card-content">
        <IonCardHeader>
          <IonCardTitle>{item.Title}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <p>{item.Overview}</p>
          <IonButton fill="clear" color="light">
            <IonIcon slot="start" icon={playCircleOutline} />
            Watch Now
          </IonButton>
        </IonCardContent>
      </div>
    </IonCard>
  );
};

export default FeaturedCard;
