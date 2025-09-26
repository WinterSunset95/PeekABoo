import { IonCard, IonCardHeader, IonCardTitle, IonImg } from "@ionic/react";
import { MovieSearchResult } from "../lib/types";

const DetailCard: React.FC<MovieSearchResult> = (item) => {
    return (
        <IonCard
            routerLink={item.Type === "anime" ? `/anime/${item.Id}` : item.Type === "movie" ? `/movie/${item.Id}` : `/tv/${item.Id}`}
            style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '10px 0' }}
        >
            <IonImg
                src={item.Poster}
                style={{ width: '100px', minWidth: '100px', height: '150px', objectFit: 'cover' }}
            />
            <IonCardHeader>
                <IonCardTitle>{item.Title}</IonCardTitle>
            </IonCardHeader>
        </IonCard>
    );
};

export default DetailCard;
