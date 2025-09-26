import { IonList } from "@ionic/react";
import { MovieSearchResult, MovieInfo } from "../lib/types";
import DetailCard from "./DetailCard";

const ListVert: React.FC<MovieInfo[]> = (list) => {
    return (
        <IonList style={{ padding: "0.5rem" }}>
            {Object.values(list).map((item, index) => (
                <DetailCard
                    key={index}
                    imageUrl={item.Poster}
                    title={item.Title}
                    linkUrl={item.Type === "anime" ? `/anime/${item.Id}` : item.Type === "movie" ? `/movie/${item.Id}` : `/tv/${item.Id}`}
                    subtitle={item.Type ? item.Type.charAt(0).toUpperCase() + item.Type.slice(1) : undefined}
                />
            ))}
        </IonList>
    );
}

export default ListVert;
