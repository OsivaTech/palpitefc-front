import { useEffect, useState } from 'react'
import style from './style.module.css'
import Spinner from 'src/components/spinner';
import { ChampionshipType } from 'src/types/ChampionshipType';
import Api from 'src/providers/http/api'
import Image from 'next/image';
import timeBranco from "/public/assets/assets/clubes/branco.png"
import { TeamType } from 'src/types/TeamType';
import { toast } from "react-toastify";
import Select from "react-select"

function PosicaoComponent() {

    const [ligas, setLigas] = useState<ChampionshipType[]>([])

    const [ligaSelecionada, setLiga] = useState({ id: 0, name: 'Selecione uma liga' })

    const [isLoading, setIsLoading] = useState(false);

    const [teamsPositions, setTeamsPositions] = useState<any[]>([])

    const [teams, setTeams] = useState<TeamType[]>([])

    const [editar, setEdit] = useState(NaN)

    const [editarPosicao, setEditarPosicao] = useState(false)


    const customStyles = {
        control: (provided: any) => ({
            ...provided,
            width: 200,
        }),
    };

    useEffect(() => {
        (async () => {
            setIsLoading(true)
            const teams = await Api.get('/api/auth/team')
            setTeams(teams)
            const championship = await Api.get('/api/auth/championship')
            setLigas(championship);
            const teamsPositions = await Api.get('/api/auth/championshipTeamPoints')
            setTeamsPositions(teamsPositions)
            setIsLoading(false)
        })()
    }, [])

    function handlerImage(name: string) {
        name = name.replace(/\s+/g, "").replace(/-/g, "")
        return `/assets/assets/clubes/${name.replace(/\s+/g, "").charAt(0).toUpperCase()}${name.slice(1)}.png`
    }

    async function addTimeChampionship() {
        const a = {
            "position": 0,
            "teamId": 0,
            "points": 0,
            "team": {
                "name": ''
            },
            "championshipsId": ligaSelecionada.id
        }
        setTeamsPositions([a, ...teamsPositions])
        setEdit(0)
    }

    function handlerTeam(teamName: any, index: number, id: number) {
        if (!teamName || teamName == '') {
            setTeamsPositions([...teamsPositions, teamsPositions[index].team.name = ''])
        } else {
            let teamId = 0
            teams.map((team, index) => {
                console.log(team.name, teamName);
                if (team.name == teamName) {
                    return (
                        teamId = team.id,
                        teamName = team.name
                    )
                }
            })
            setTeamsPositions([...teamsPositions, teamsPositions[index].team.name = teamName, teamsPositions[index].teamId = teamId])
        }
    }

    async function saveTeamChampionship(index: any) {
        if(!teamsPositions[index].teamId) {
            const getTeamsPositions = await Api.get('/api/auth/championshipTeamPoints')
            setTeamsPositions(getTeamsPositions)
            setEdit(NaN)
            return
        }
        setIsLoading(true)
        const body = {
            // id: teamsPositions[index].id ? teamsPositions[index].id : null,
            teamId: teamsPositions[index].teamId,
            championshipId: ligaSelecionada.id,
            position: 0,
            points: 0
        }
        const response = await Api.post('/api/auth/championshipTeamPoints', body)
        // if (response?.id) toast.success('Jogo Salvo com sucesso!')
        // if (!response?.id) toast.error('Houve um problema ao salvar o jogo')
        const getTeamsPositions = await Api.get('/api/auth/championshipTeamPoints')
        setTeamsPositions(getTeamsPositions)
        setEdit(NaN)
        setIsLoading(false)
    }

    async function saveTeamPosition() {
        setIsLoading(true)
        let response;
        for (const teamPosition of teamsPositions) {
            if (teamPosition.championshipsId == ligaSelecionada.id) {
                if(teamPosition.edit) {
                    const body = {
                        id: teamPosition.id,
                        teamId: teamPosition.teamId,
                        championshipId: teamPosition.championshipsId,
                        position: teamPosition.position,
                        points: teamPosition.points
                    }
                    response = await Api.post('/api/auth/championshipTeamPoints', body)
                }
            }
        }
        // if (response.id) toast.success('Jogo Salvo com sucesso!')
        // if (!response.id) toast.error('Houve um problema ao salvar o jogo')
        const getTeamsPositions = await Api.get('/api/auth/championshipTeamPoints')
        setTeamsPositions(getTeamsPositions)
        setEditarPosicao(false)
        setIsLoading(false)
    }

    const validateInput = (value: string) => {
        const regex = /^\d+(?:\.\d{0,2})?$/;
        return regex.test(value);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, index: number, id: number) => {
        const { value } = event.target;
        if (!validateInput(value)) return;
        teamsPositions[index].edit = true;
        if (id === 0) setTeamsPositions([...teamsPositions, teamsPositions[index].position = Number(value)])
        if (id === 1) setTeamsPositions([...teamsPositions, teamsPositions[index].points = Number(value)])
    };

    return (
        <div className={style.jogo}>
            {isLoading && <Spinner></Spinner>}
            <div className={style.jogoHeader}>
                <div className={style.title}>
                    <div>
                        <h1>Classificação dos times</h1>
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
                        {
                            !editarPosicao ?
                                <button className={style.buttonAdd} onClick={() => addTimeChampionship()}
                                    disabled={!ligaSelecionada.id || false} style={!ligaSelecionada.id || false ? { opacity: 0.5 } : { opacity: 1 }}>
                                    Adicionar time
                                </button>
                                :
                                <button className={style.buttonAdd} onClick={() => saveTeamPosition()}
                                    disabled={!ligaSelecionada.id || false} style={!ligaSelecionada.id || false ? { opacity: 0.5 } : { opacity: 1 }}>
                                    Salvar
                                </button>
                        }
                        <button className={style.buttonEditar} onClick={() => setEditarPosicao(!editarPosicao)}>
                            {/* <svg className={style.acaoEditar} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
                            </svg> */}
                            Editar
                        </button>
                    </div>
                </div>
            </div>
            <ul className={style.ulPalpite}>
                <li className={style.liPalpite}>
                    <label style={{ paddingLeft: '10px' }}>Clube</label>
                    <label className={style.pts}>Pts</label>
                </li>
                {teamsPositions.map((teamPosition, key) => {
                    if (teamPosition.championshipsId == ligaSelecionada.id)
                        return (
                            <li key={key} className={style.liPalpite}>
                                {
                                    editarPosicao ?
                                        <input value={teamPosition.position || 0} onChange={(event) => handleInputChange(event, key, 0)} className={style.inputPalpite}></input>
                                        :
                                        <label style={{width: '19px'}}>{teamPosition?.position}</label>
                                }
                                <Image className={style.imgPalpite} src={teamPosition?.team && (teamPosition?.team?.name) ? handlerImage(teamPosition?.team?.name) : timeBranco} width={50} height={50} alt="" />
                                {
                                    editar !== key ?
                                        <label>{teamPosition?.team?.name}</label>
                                        :
                                        <Select 
                                        styles={customStyles}
                                        placeholder="Selecione um time"
                                        onChange={(event) => handlerTeam(event && event.value, key, 0)}
                                        options={teams.map((team, index) => ({value:team.name, label:team.name }))}
                                        />
                                        // <select onChange={(event) => handlerTeam(event.target.value, key, 0)} className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" style={{ width: '70%' }}>
                                        //     <option selected={false} value={''} >Selecione um time</option>
                                        //     {teams.map((team, index) => {
                                        //         return (
                                        //             <option value={team.name} key={index}>{team.name}</option>
                                        //         )
                                        //     })}
                                        // </select>
                                }
                                {
                                    editarPosicao ?
                                        <input value={teamPosition.points || 0} onChange={(event) => handleInputChange(event, key, 1)} className={style.inputPts}></input>
                                        :
                                        editar !== key ?
                                            <label className={style.pts}>{teamPosition.points}</label>
                                            :
                                            <button className={style.buttonSalvar} onClick={() => saveTeamChampionship(key)}>
                                                <svg className={style.acaoEditar} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                    <path fill="white" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                                                </svg>
                                            </button>
                                }
                            </li>
                        )
                })
                }
            </ul>
        </div>
    )
}
export default PosicaoComponent