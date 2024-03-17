import style from "./style.module.css"
import Image from "next/image"
import { useEffect, useState } from "react"
import Api from "src/providers/http/api"
import { TeamType } from "src/types/TeamType"
import { ChampionshipType } from "src/types/ChampionshipType"
import Spinner from "src/components/spinner"
import { toast } from "react-toastify";
import timeBranco from "/public/assets/assets/clubes/branco.png"
import Alert from "src/components/alert"
import Select from "react-select"

function RodadaComponent() {

    const [ligas, setLigas] = useState<ChampionshipType[]>([])

    const [ligaSelecionada, setLiga] = useState({ id: 0, name: 'Selecione uma liga' })

    const [teams, setTeams] = useState<TeamType[]>([])

    const [games, setGames] = useState<any[]>([])

    const [isLoading, setIsLoading] = useState(false);

    const [editar, setEdit] = useState(NaN)

    const [width, setWidth] = useState<number>(0)

    const [showAlert, setShowAlert] = useState({show: false, index: NaN });

    const [resalert, setResalert] = useState(false);

    useEffect(() => {
        (async () => {
            setWidth(window.innerWidth)
            setIsLoading(true)
            const teams = await Api.get('/api/auth/team')
            setTeams(teams)
            const championship = await Api.get('/api/auth/championship')
            setLigas(championship);
            const games = await Api.get('/api/auth/game')
            setGames(games)
            setIsLoading(false)
        })()
    }, [])

    const addGame = async (id: Number) => {
        const game = {
            name: 'games',
            championshipId: id,
            start: Date.now,
            firstTeam: { gol: 0, name: '' },
            secondTeam: { gol: 0, name: '' },
        }
        setGames([game, ...games])
        setEdit(0)
    };

    const removeGame = async (key: number) => {
        setIsLoading(true)
        const body = {
            id: games[key].id
        }
        const response = await Api.delete('/api/auth/game', body)
        if (response.id) toast.success('Jogo excluído com sucesso!')
        if (!response.id) toast.error('Houve um problema ao excluir o jogo')
        const game = await Api.get('/api/auth/game')
        setGames(game);
        setEdit(NaN);
        setIsLoading(false)
    };

    const saveGame = async (idLiga: number, index: number) => {
        if (!games[index].firstTeam.id || !games[index].secondTeam.id) return toast.error('Selecione os times')
        if (String(convertToISODateTime(games[index].start)).includes('NaN')) return toast.error('Selecione a data e hora do jogo')
        setIsLoading(true)
        const body = {
            id: games[index].id ? games[index].id : null,
            name: 'jogo 2',
            championshipId: idLiga,
            start: convertToISODateTime(games[index].start),
            firstTeam: { id: games[index].firstTeam.id, gol: 0 },
            secondTeam: { id: games[index].secondTeam.id, gol: 0 }
        }
        const response = await Api.post('/api/auth/game', body)
        if (response.id) toast.success('Jogo Salvo com sucesso!')
        if (!response.id) toast.error('Houve um problema ao salvar o jogo')
        const game = await Api.get('/api/auth/game')
        setGames(game)
        setEdit(NaN)
        setIsLoading(false)
    }

    function handlerGameFirst(teamId: any, index: number, id: number) {
        if (!teamId || teamId == '') {
            setGames([...games, games[index].firstTeam.id = '', games[index].firstTeam.name = ''])
        } else {
            let teamName = ''
            teams.map((team, index) => {
                if (team.id == teamId) {
                    return (
                        teamName = team.name
                    )
                }
            })
            setGames([...games, games[index].firstTeam.id = Number(teamId), games[index].firstTeam.name = teamName])
        }
    }

    function handlerGameSecond(teamId: any, index: number, id: number) {
        if (!teamId || teamId == '') {
            setGames([...games, games[index].secondTeam.id = '', games[index].secondTeam.name = ''])
        } else {
            let teamName = ''
            teams.map((team, index) => {
                if (team.id == teamId) {
                    return (
                        teamName = team.name
                    )
                }
            })
            setGames([...games, games[index].secondTeam.id = Number(teamId), games[index].secondTeam.name = teamName])
        }
    }

    async function handlerEdit(index: number) {
        if (editar && (!games[editar].firstTeam.id || !games[editar].secondTeam.id)) {
            return toast.error('Selecione os times')
        }
        setEdit(index)
    }

    function convertToISODateTime(datetimeLocalValue: any) {
        if(!datetimeLocalValue) return false
        const date = new Date(datetimeLocalValue);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);
        const isoDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
        return isoDateTime;
    }

    function transformaString(str: string) {
        let newS:string = ''
        let dia
        let mes
        let hora

        newS = str.replace('T', '').slice(0, str.length - 6).slice(5).replace('-', '/')
        mes = newS.slice(0, newS.length - 11)
        dia = newS.slice(3, newS.length - 8)
        hora = newS.slice(5, newS.length - 3)

        return `${dia}/${mes} - ${hora}`
      }
      

    function handlerImage(name: string) {
        name = name.replace(/\s+/g, "").replace(/-/g, "")
        return `/assets/assets/clubes/${name.replace(/\s+/g, "").charAt(0).toUpperCase()}${name.slice(1)}.png`
    }

    function aletRes(a: boolean) {
        console.log(a)
        if(a){
            handlerEdit(showAlert.index)
        }
        setShowAlert({show:false, index:NaN})
    }

    const customStyles = {
        control: (provided: any) => ({
            ...provided,
            width: 200,
        }),
    };

    return (
        <div className={style.jogo}>
            {isLoading && <Spinner></Spinner>}
            <Alert
                isOpen={showAlert.show}
                onConfirm={() => aletRes(true)}
                onCancel={() => aletRes(false)}
                message="Deseja mesmo excluir?"
            />
            <div className={style.jogoHeader}>
                <div className={style.title}>
                    <div>
                        <h1>Jogos da rodada</h1>
                        <h3>Administração</h3>
                    </div>
                    <select onChange={(event) => setLiga(prevState => ({ ...prevState, id: Number(event.target.value) }))} style={{ textAlign: 'center' }}>
                        <option value={NaN}>Selecione uma liga</option>
                        {ligas.map((liga, key) => {
                            return (
                                <option value={liga.id} key={key}>{liga.name}</option>
                            )
                        })}
                    </select>
                    <div className={style.newRound}>
                        <button className={style.buttonAdd} onClick={() => addGame(ligaSelecionada.id)} 
                            disabled={!ligaSelecionada.id || !isNaN(editar)} style={!ligaSelecionada.id || !isNaN(editar) ? {opacity: 0.5} : {opacity: 1}}>
                            Nova rodada
                        </button>
                    </div>
                </div>
                {/* <div className="relative">
                    <select onChange={(event) => setLiga(prevState => ({ ...prevState, id: Number(event.target.value) }))} className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" style={{ textAlign: 'center' }}>
                        <option value={NaN}>Selecione uma liga</option>
                        {ligas.map((liga, key) => {
                            return (
                                <option value={liga.id} key={key}>{liga.name}</option>
                            )
                        })}
                    </select>
                </div> */}
            </div>
            <div className={style.jogoContent}>
                {/* <div className={style.tituloContent}>
                    {ligas.map((liga, key) => {
                        if(liga.id === ligaSelecionada.id){
                            ligaSelecionada.name = ''
                            return(
                                liga.name
                                )
                        }
                    })}
                    {width > 500 && ligaSelecionada.name}
                    <div className={style.newRound}>
                        <button className={style.buttonAdd} onClick={() => addGame(ligaSelecionada.id)} 
                            disabled={!ligaSelecionada.id || !isNaN(editar)} style={!ligaSelecionada.id || !isNaN(editar) ? {opacity: 0.5} : {opacity: 1}}>
                            Nova rodada
                        </button>
                    </div>
                </div> */}
                <div>
                    <ul className={style.ulPalpite}>
                        {games.map((game, key) => {
                            if (game.championshipId == ligaSelecionada.id)
                                return (
                                    <li key={key} className={style.liPalpite}>
                                        <div className={style.contentContainer}>
                                            <span className={style.spanPalpiteTime}>
                                                <Image className={style.imgPalpite} src={game.firstTeam && game.firstTeam.name ? handlerImage(game.firstTeam.name) : timeBranco} width={50} height={50} alt="" />
                                                {
                                                    editar !== key ?
                                                        <p className={style.nomeTimeCard}>
                                                            {game.firstTeam && game.firstTeam.name}
                                                        </p>
                                                        :
                                                        // <select onChange={(event) => handlerGameFirst(event.target.value, key, 0)} className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" style={{ textAlign: 'center' }}>
                                                        //     <option selected={false} value={''} >Selecione um time</option>
                                                        //     {teams.map((team, index) => {
                                                        //         return (
                                                        //             <option value={team.id} selected={game.firstTeam.name ? (team.id == game.firstTeam.id) : false} key={index}>{team.name}</option>
                                                        //         )
                                                        //     })}
                                                        // </select>
                                                        <Select
                                                            styles={customStyles}
                                                            placeholder="Selecione um time"
                                                            options={teams.map((team, index) => ({ value: team.id, label: team.name }))}
                                                            onChange={(selectedOption) => handlerGameFirst(selectedOption && selectedOption.value, key, 0)}
                                                        />
                                                }   
                                            </span>
                                            <div className={style.spanPalpiteX}>
                                                <p>X</p>
                                                {editar !== key ?
                                                    <p className={style.pPalpite}>{game.start ? transformaString(game.start) : '00/00/0000, 00:00:00'}</p>
                                                    :
                                                    <input type="datetime-local" onChange={(event) => games[key].start = event.target.value} />
                                                }
                                            </div>
                                            <span className={style.spanPalpiteTime}>
                                                <Image className={style.imgPalpite} src={game.secondTeam && game.secondTeam.name ? handlerImage(game.secondTeam.name) : timeBranco} width={50} height={50} alt="" />
                                                {
                                                    editar !== key ?
                                                        <p className={style.nomeTimeCard}>
                                                            {game.secondTeam && game.secondTeam.name}
                                                        </p>
                                                        :
                                                        // <select onChange={(event) => handlerGameSecond(event.target.value, key, 1)} className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" style={{ textAlign: 'center' }}>
                                                        //     <option value={''}>Selecione um time</option>
                                                        //     {teams.map((team, index) => {
                                                        //         return (
                                                        //             <option value={team.id} selected={game.secondTeam.name ? (team.id == game.secondTeam.id) : false} key={index} >{team.name}</option>
                                                        //         )
                                                        //     })}
                                                        // </select>
                                                        <Select
                                                            styles={customStyles}
                                                            placeholder="Selecione um time"
                                                            options={teams.map((team, index) => ({ value: team.id, label: team.name }))}
                                                            onChange={(selectedOption) => handlerGameSecond(selectedOption && selectedOption.value, key, 0)}
                                                        />

                                                }
                                            </span>
                                        </div>
                                        <div className={style.acao}>
                                            {editar !== key ?
                                                <button className={style.buttonEditar} onClick={() => handlerEdit(key)}>
                                                    <svg className={style.acaoEditar} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                        <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
                                                    </svg>
                                                </button>
                                                :
                                                <button className={style.buttonSalvar} onClick={() => saveGame(ligaSelecionada.id, key)}>
                                                    <svg className={style.acaoEditar} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                        <path fill="white" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                                                    </svg>
                                                </button>
                                            }
                                            <button className={style.buttonExcluir} onClick={() => removeGame(key)}>
                                                <svg className={style.acaoEditar} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                    <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </li>
                                )
                        })}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default RodadaComponent