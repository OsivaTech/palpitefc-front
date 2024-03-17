import Ball from "../../../public/assets/ball.svg"
import { useEffect, useState } from "react"
import style from "./style.module.css"
import Image from "next/image"
import CardSkeleton from "../skeleton"
import Api from "src/providers/http/api"
import { objPalpiteType } from "src/types/objPalpiteType"
import { toast } from "react-toastify"
import timeBranco from "/public/assets/assets/clubes/branco.png"
import ModalClassificacao from "../modalClassificacao"

function CardPalpite() {


    const [games, setGames] = useState<any>([])
    const [championships, setChampionships] = useState<any>([])
    const [gamesFiltered, setGamesFiltered] = useState<any>([])
    const [selectedLi, setSelectedLi] = useState<number | null>(null);
    const [unique, setUnique] = useState<boolean>(true)
    const [isLoading, setLoading] = useState<boolean>(true)
    const [man, setMan] = useState<any>('')
    const [vis, setVis] = useState<any>('')
    const [objPalpite, setObjPalpite] = useState<objPalpiteType>({ id: '', mandante: 0, visitante: 0, horario: '', firstTeamId: '', secondTeamId: '' })
    const [attList, setAttList] = useState<boolean>(true)
    const [prefer, setPrefer] = useState<any>('')

    useEffect(() => {
        (async () => {
            const [championships, games] = await Promise.all([
                Api.get('/api/championship'),
                Api.get('/api/game'),
            ]);
            setGames(games); setChampionships(championships);            
            // setLoading(false);
        })()
    }, [])

    useEffect(() => {
            const preference = localStorage.getItem(prefer)
            setPrefer(preference)
    }, [])

    useEffect(() => {
        setObjPalpite({ ...objPalpite, mandante: man, visitante: vis })
    }, [man, vis])

    const setGamesExhibition = (id: any) => {
        setGamesFiltered(games.filter((jogos: any) => jogos.championshipId === id))
    }

    const handleMandante = (e: any) => {
        setMan(e.target.value)
    }

    const handleVisitante = (e: any) => {
        setVis(e.target.value)
    }

    const sendPalpite = async (objPalpite: objPalpiteType) => {
        const myObj = {
            gameId: objPalpite.id,
            firstTeam: {
                id: objPalpite.firstTeamId,
                gol: objPalpite.mandante
            },
            secondTeam: {
                id: objPalpite.secondTeamId,
                gol: objPalpite.visitante
            }
        }

        const { horario } = objPalpite
        const dataDoJogo = new Date(Date.parse(horario));
        const horaAtual = new Date();

        if (dataDoJogo <= horaAtual) {
            // O jogo já começou ou está em andamento, então não pode enviar o palpite
            return toast.error('Jogo já começou ou está em andamento, você não pode enviar um palpite')
        } else {
            // O jogo ainda não começou, pode enviar o palpite
            const { message, ...res } = await Api.post('/api/auth/palpitation', myObj)
            if (message) { return toast.error('Faça login para enviar seu palpite') }
            return toast.success(`Palpite enviado! Boa sorte!`)
        }
    }

    async function attListFunc(){
            const [championships, games] = await Promise.all([
                Api.get('/api/championship'),
                Api.get('/api/game'),
            ]);
        setGames(games); setChampionships(championships);
        setGamesExhibition(0)
        toast.success(`Lista de jogos atualizada!`)
    }

    function dinamicId(data: string): boolean {
        const banco = new Date(data).getTime();
        const atual = new Date().getTime();
        return banco < atual;
    }


    function handlerImage(name: string) {
        name = name.replace(/\s+/g, "").replace(/-/g, "")
        return `/assets/assets/clubes/${name.replace(/\s+/g, "").charAt(0).toUpperCase()}${name.slice(1)}.png`
    }


    useEffect(() => {
        //aqui eu controlo qual card é o padrao da tela por meio de um state.
        function verificarTamanhoTela() {
            if (window.matchMedia("(max-width: 450px)").matches) {
                setUnique(false);
            } else if (window.matchMedia("(max-width: 727px)").matches) {
                setUnique(true);
            } else if (window.matchMedia("(min-width: 728px)").matches) {
                setUnique(true);
            }
        }
        verificarTamanhoTela();
        window.addEventListener('resize', verificarTamanhoTela);

        return () => {
            window.removeEventListener('resize', verificarTamanhoTela);
        };
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    function transformaString(str: string) {
        let newS:string = ''
        let dia
        let mes
        let hora

        newS = str.replace('T', '').slice(0, str.length - 6).slice(5).replace('-', '/')
        mes = newS.slice(0, newS.length - 11)
        dia = newS.slice(3, newS.length - 8)
        hora = newS.slice(5, newS.length - 3)

        return `${dia}/${mes}  ${hora}`
      }
    //MODAL DE CLASSIFICACAO
    const [displayModal, setDisplayModal] = useState(false)
    const toggle = () => {
        setDisplayModal(!displayModal)
    }
      const clubes = []

    // function recebeIndex(x: any){
    //     Api.post('/api/auth/team', {team: {name: `${x}`}})
    // }

    // function salvaTime(){
    //     for(let i = 0; i < clubes.length; i++){
    //         setTimeout(() => {
    //             recebeIndex(clubes[i])
    //         }, i * 5000);
    //     }
    // }

    // salvaTime()

    return (
        <div className={style.bodyPalpite}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1rem 1rem 0rem 1rem', boxSizing: 'border-box' }}>
                <ul className={style.listaLigas} style={{flexWrap: 'wrap'}}>
                    <>
                    {
                        championships.map((liga: any, index: any) => (
                            <li key={index} className={style.listaLigaLI} onClick={() => setGamesExhibition(liga.id)} style={{order:`-${index}`}}>{liga.name}</li>
                        ))
                    }
                    </>
                    <div className="flex" style={{marginLeft: 'auto'}}>
                        <button onClick={()=>toggle()} className="bg-white hover:bg-gray-100 text-gray-800 my-5 px-4 shadow">
                          Classificação
                        </button>
                        <button type="button" className={style.btnAttList} onClick={() => attListFunc()}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M89.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L370.3 160H320c-17.7 0-32 14.3-32 32s14.3 32 32 32H447.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L398.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C57.2 122 39.6 150.7 28.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM23 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V448c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L109.6 352H160c17.7 0 32-14.3 32-32s-14.3-32-32-32H32.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z"/>
                            </svg>
                        </button>
                    </div>
                </ul>
                <div className={style.visaoJogos}>
                    <span>Visualizacao: </span>
                    <svg className={style.uniqueVis} tabIndex={1} onClick={() => setUnique(true)} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z" fill=""></path>
                    </svg>
                    <svg className={style.multiplyVis} tabIndex={2} onClick={() => setUnique(false)} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" fill=""></path>
                    </svg>
                </div>
            </div>
            <ul className={!unique ? style.ulPalpiteMult : style.ulPalpite}>
                {isLoading && <li> <CardSkeleton ranking={false} video={false} blog={false} cards={games.length} enquete={false} /> </li>}
                {!isLoading && (!gamesFiltered.length ? games : gamesFiltered).map((game: any, key: any) => (
                    <li key={key} id={style[dinamicId(game.start) ? 'backgroundLiActive' : 'backgroundLiActiveNot']} className={!unique ? style.liPalpiteMult : style.liPalpite} onClick={() => { setSelectedLi(key); setObjPalpite({ id: '', mandante: '0', visitante: '0', horario: '', firstTeamId: '', secondTeamId: '' }) }}>
                        {!unique &&
                            <div className={style.titleCard}>
                                <span className={style.titleCardContent}>
                                    <Image src={Ball} alt="" />
                                    {championships.filter((campeonato: any) => campeonato.id === game.championshipId).map((campeonato: any) => campeonato.name)}
                                </span>
                                <p className={style.pPalpite}>
                                    {game.start ? transformaString(game.start): '00/00/0000, 00:00:00'}
                                </p>
                            </div>}
                        <div className={!unique ? style.contentContainerMult : style.contentContainer}>
                            <span className={style.spanPalpiteTime}>
                                <Image className={style.imgPalpite} src={game.firstTeam && game.firstTeam.name ? handlerImage(game.firstTeam.name) : timeBranco} width={50} height={50} alt="" />
                                <p className={style.nomeTimeCard}>
                                    {game.firstTeam.name}
                                </p>
                            </span>
                            <input type='text' pattern="\d{1,2}" placeholder="0" name="mandante" onChange={handleMandante} onInput={(e: any) => { e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 2); }} className={style.inputPalpite} />
                            <div className={style.spanPalpiteX}>
                                <p>X</p>
                                {unique && <p className={style.pPalpiteUnique}>
                                    {game.start ? transformaString(game.start): '00/00/0000, 00:00:00'}
                                </p>}
                            </div>
                            <input type='text' pattern="\d{1,2}" placeholder="0" name="visitante" onChange={handleVisitante} onInput={(e: any) => { e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 2); }} className={style.inputPalpite} />
                            <span className={style.spanPalpiteTime}>
                                <Image className={style.imgPalpite} src={game.secondTeam && game.secondTeam.name ? handlerImage(game.secondTeam.name) : timeBranco} width={50} height={50} alt="" />
                                <p className={style.nomeTimeCard}>
                                    {game.secondTeam.name}
                                </p>
                            </span>
                        </div>
                        <button type="button" className={selectedLi === key ? style.btnPalpite : style.btnPalpiteOff} onClick={() => sendPalpite({ ...objPalpite, id: game.id, mandante: man, visitante: vis, horario: game.start, firstTeamId: game.firstTeam.id, secondTeamId: game.secondTeam.id })}>PALPITAR</button>
                    </li>
                )
                )}
            </ul>
            {displayModal && <ModalClassificacao display={displayModal} toggle={toggle}/>}
        </div>
    )
}

export default CardPalpite