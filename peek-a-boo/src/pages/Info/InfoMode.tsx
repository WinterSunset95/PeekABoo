import { RouteComponentProps } from "react-router";
import AnimeInfoPage from "./AnimeInfo";
import { useEffect, useState } from "react";
import { AnimeInfo, MediaInfo, MediaTypes } from "../../lib/types";
import { getAnimeInfo } from "../../lib/anime";
import LoadingComponent from "../../components/Loading";
import InfoPage from "./InfoPage";
import { toast } from "sonner";
import { getMovieInfo, getTvInfo } from "../../lib/movies";

interface InfoProps extends RouteComponentProps<{
  type: MediaTypes
  id: string
}> {}

const InfoMode: React.FC<InfoProps> = ({ match }) => {
  const [info, setInfo] = useState<MediaInfo>()

  const loadInfo = async () => {
    if (!match.params.id) {
      toast.warning("ID undefined, retrying...")
      return
    }
    console.log(`Media Id: ${match.params.id}`)
    const choice = async () => {
      if (match.params.type == "anime") return await getAnimeInfo(match.params.id)
      else if (match.params.type == "movie") return await getMovieInfo(match.params.id)
      else if (match.params.type == "tv") return await getTvInfo(match.params.id)
      else return await getTvInfo(match.params.id)
    }
    const res = await choice()
    console.log(res)
    if (res.peek == false || typeof res.boo == "string") {
      toast.error(`Error: ${res.boo}`)
      return
    }
    setInfo(res.boo)
  }


    useEffect(() => {
    loadInfo()
    }, [])

    if (!info) return <LoadingComponent choice="full_page" />

    return <InfoPage info={info} />
}

export default InfoMode
