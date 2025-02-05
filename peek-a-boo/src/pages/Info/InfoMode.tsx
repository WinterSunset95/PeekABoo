import { RouteComponentProps } from "react-router";
import AnimeInfoPage from "./AnimeInfo";
import { useEffect, useState } from "react";
import { AnimeInfo } from "../../lib/types";
import { getAnimeInfo } from "../../lib/anime";

interface InfoProps extends RouteComponentProps<{
    id: string
}> {}

const InfoMode: React.FC<InfoProps> = ({ match }) => {
    const [info, setInfo] = useState<AnimeInfo>()

	const loadInfo = async () => {
		if (!match.params.id) {
			console.log("ID undefined, retrying. . .")
			return
		}
		console.log(`Media Id: ${match.params.id}`)
		const res = await getAnimeInfo(match.params.id)
		if (res.peek == false) {
			console.log("Failed to load information")
			return
		}
		setInfo(res.boo)
	}

    useEffect(() => {
        loadInfo()
    }, [])

    if (!info) return ""

    return <AnimeInfoPage info={info} />
}

export default InfoMode