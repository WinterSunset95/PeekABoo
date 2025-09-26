import { IonList } from "@ionic/react";
import { MovieSearchResult } from "../lib/types";
import DetailCard from "./DetailCard";

const ListVert: React.FC<MovieSearchResult[]> = (list) => {
    return (
        <IonList style={{ padding: "0.5rem" }}>
            {Object.values(list).map((item, index) => (
                <DetailCard key={index} {...item} />
            ))}
        </IonList>
    );
}

export default ListVert;
