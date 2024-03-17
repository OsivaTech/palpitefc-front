import { createPortal } from "react-dom"
import { motion } from "framer-motion";
import style from "./style.module.css"
import Image from "next/image";
import Close from "../../../public/assets/assets/rectangle-xmark-regular.svg"
import Api from "src/providers/http/api";
import { useEffect, useState } from "react";
import { ChampionshipType } from "src/types/ChampionshipType";
import Select from "react-select";


const ModalClassificacao = ({ display, toggle }: any) => {
    const [ligas, setLigas] = useState<ChampionshipType[]>([])
    const [teamsPositions, setTeamsPositions] = useState<any[]>([])
    const [allteams, setAllTeams] = useState<any[]>([])
    const [first, setFirst] = useState<any[]>([])
    const [second, setSecond] = useState<any[]>([])
    

    useEffect(() => {
        (async () => {
            const championship = await Api.get('/api/championship')
            setLigas(championship);
            const getTeamsPositions = await Api.get('/api/championshipTeamPoints')
            setAllTeams(getTeamsPositions)
        })()
    }, [])

    const filtrarCampeonato = (id: number) => {
        const filteredTeams = allteams.filter((champ: any) => champ.championshipsId === id);
        setTeamsPositions(filteredTeams);

        const halfLength = Math.ceil(filteredTeams.length / 2);

        // Atualiza os estados de first e second com base nas equipes filtradas
        setFirst(filteredTeams.slice(0, halfLength));
        setSecond(filteredTeams.slice(halfLength));
    }

    return createPortal(
        <motion.div animate={{ x: 0, opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <div style={{ display: display ? 'block' : 'none', position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', padding: '50px' }}>
                <div className={style.contentModal}>
                    <div className={style.fecharModal}>
                        <span className={style.logoText} onClick={()=>console.log(first)}>Palpite Futebol Clube</span>
                        <button onClick={() => toggle()}>
                            <Image src={Close} alt='fechar' width={25} />
                        </button>
                    </div>
                    <Select
                        placeholder="Selecione um campeonato"
                        onChange={(event) => filtrarCampeonato(Number(event && event.value))}
                        options={ligas.map((liga, key) => ({value:liga.id, label:liga.name}))}
                    />
                    <ul className={style.classificacao}>
                        <div>
                        {first.map((team, key) => (
                            <li key={key} id={team.position < 5 ? style.g4 : ''}>
                                    <div>
                                        <span>{team.position}</span>
                                        <span>{team.team.name}</span>
                                    </div>
                                    <span className="font-bold">{team.points}</span>
                                </li>
                            ))}
                        </div>
                        {/* <div style={{borderLeft: '0.5px solid gray'}}></div> */}
                        <div>
                        {second.map((team, key) => (
                            <li key={key} className={team.position > 16 ? style.z4 : ''}>
                                    <div>
                                        <span>{team.position}</span>
                                        <span>{team.team.name}</span>
                                    </div>
                                    <span className="font-bold">{team.points}</span>
                                </li>
                            ))}
                        </div>
                    </ul>
                </div>
            </div>
        </motion.div>,
        document.body
    )
}

export default ModalClassificacao