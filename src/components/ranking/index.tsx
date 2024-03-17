import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Api from "src/providers/http/api";
import CardSkeleton from "../skeleton";
import style from "./style.module.css"

function Ranking() {

    const [isLoading, setLoading] = useState<boolean>(true)
    const [points, setPoints] = useState<number>(0)
    const [name, setName] = useState<string>('')
    const [verify, setVerify] = useState<boolean>(false)

    useEffect(() => {
        (async () => {
            const res = await Api.get('/api/ranking')
            setUsers(res);
        })()

        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    const verificarPosicao = () => {
        const infos = JSON.parse(localStorage.getItem('UserInfos') ?? '{}');        
        if(!!infos.name || infos.name !== undefined) return setVerify(!verify)
        return toast.error('Você deve fazer login!')        
    }

    useEffect(() => {
        const infos = JSON.parse(localStorage.getItem('UserInfos') ?? '{}');
        setPoints(Number(infos.points))
        setName(infos.name)

    }, [verify])

    const [users, setUsers] = useState<any>([])

    return (<>
        <ul className={style.containerRanking}>
            {isLoading && <li> <CardSkeleton ranking={true} video={false} blog={false} cards={null} enquete={false} /> </li>}
            <div className={style.cabecalhoRanking}><span>Posição</span><span>Nome</span><span>Pontos</span></div>
            {!isLoading &&
                users.slice(0, 6).map((user: any, key: any) => (
                    <li className={style.rankingContent} key={key}>
                        <span className={style.classification}>{key + 1}</span>
                        <span className={style.nameUser}>{user.name}</span>
                        <span className={style.points}>{user.points}</span>
                    </li>
                ))
            }
            { !verify && <button className={style.btnDesempenho} type="button" onClick={() => verificarPosicao()}>Meus resultados</button> }
            {verify && <li  onClick={() => verificarPosicao()} className={style.liDesempenho}>{name ? name.charAt(0).toUpperCase() + name.slice(1).split(' ')[0] : ''} você tem <h2>{points}</h2> pontos/palpites certos!</li>}
        </ul>
    </>
    )
}

export default Ranking