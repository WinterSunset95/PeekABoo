import React from 'react';
import { IonCard, IonImg, IonCardContent, IonCardHeader, IonCardTitle, IonButton, IonIcon } from '@ionic/react';
import { MovieInfo } from '../lib/types';
import './FeaturedCard.css';
import { playCircleOutline } from 'ionicons/icons';

interface FeaturedCardProps {
  item: MovieInfo;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ item }) => {
  return (
    <IonCard className="featured-card" routerLink={`/${item.Type}/${item.Id}`}>
      <IonImg src={item.Poster} className="featured-card-image" />
      <div className="featured-card-gradient" />
      <div className="featured-card-content">
        <IonCardHeader>
          <IonCardTitle>{item.Title}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <p>{item.Overview}</p>
          <IonButton fill="clear">
            <IonIcon slot="start" icon={playCircleOutline} />
            Watch Now
          </IonButton>
        </IonCardContent>
      </div>
    </IonCard>
  );
};

export default FeaturedCard;
