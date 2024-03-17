import RodadaComponent from "../adminRodada"
import JogosComponent from "../adminJogos"
import style from "./style.module.css"
import CampeonatoCamponent from "../adminCampeonato"
import NewsComponent from "../adminNews"
import AdminHomeInfoComponent from "../adminHomeInfo"
import AdminUserComponent from "../adminUser"
import AdminEnquetesComponents from "../adminEnquetes"
import PosicaoComponent from "../adminPosicao"

function ContentComponent(props: any) {
    const page = props.page

    return (
        <div className={style.content}>
            {page === 'home' && <AdminHomeInfoComponent />}
            {page === 'jogo' && <JogosComponent />}
            {page === 'rodada' && <RodadaComponent />}
            {page === 'campeonato' && <CampeonatoCamponent />}
            {page === 'news' && <NewsComponent />}
            {page === 'user' && <AdminUserComponent />}
            {page === 'enquetes' && <AdminEnquetesComponents />}
            {page === 'posicao' && <PosicaoComponent />}
        </div>
    )
}

export default ContentComponent