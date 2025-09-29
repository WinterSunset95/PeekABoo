import { Link } from "react-router-dom";

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
        <Link to={linkUrl}>
            <div className="flex bg-muted rounded-lg shadow-sm overflow-hidden transition-all hover:bg-accent hover:shadow-md">
                <img
                    src={imageUrl}
                    className="w-20 aspect-[2/3] object-cover flex-shrink-0"
                    alt={`Poster for ${title}`}
                />
                <div className="p-4 flex flex-col justify-center">
                    <h3 className="font-bold text-lg text-foreground leading-tight">{title}</h3>
                    {subtitleParts.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">{subtitleParts.join(" • ")}</p>
                    )}
                    {shortenedOverview && (
                        <p className="text-sm text-muted-foreground mt-2 hidden sm:block">
                            {shortenedOverview}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default DetailCard;
