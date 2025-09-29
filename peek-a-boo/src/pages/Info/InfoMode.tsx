import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { MediaInfo, MediaTypes } from "../../lib/types";
import { getAnimeInfo } from "../../lib/anime";
import LoadingComponent from "../../components/Loading";
import InfoPage from "./InfoPage";
import { toast } from "sonner";
import { getMovieInfo, getTvInfo } from "../../lib/movies";

function InfoMode() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [info, setInfo] = useState<MediaInfo>()

  const loadInfo = async () => {
    if (!id) {
      toast.warning("ID undefined, retrying...")
      return
    }
    console.log(`Media Id: ${id}`)
    const choice = async () => {
      if (type == "anime") return await getAnimeInfo(id)
      else if (type == "movie") return await getMovieInfo(id)
      else if (type == "tv") return await getTvInfo(id)
      else return await getTvInfo(id)
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
    }, [id, type])

    if (!info) return <LoadingComponent choice="full_page" />

    return <InfoPage info={info} />
}

export default InfoMode
