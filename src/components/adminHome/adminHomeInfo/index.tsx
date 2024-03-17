import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Spinner from "src/components/spinner";
import Api from "src/providers/http/api"
import style from './style.module.css'


function AdminHomeInfoComponent() {

    const [urlVídeo, setUrlVídeo] = useState<String>('')

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true)
            const { value } = await Api.get('/api/auth/config?name=URLvideo')
            setUrlVídeo(value)
            setIsLoading(false)
        })()
    }, [])

    async function handlerUrl() {
        setIsLoading(true)
        const body = {
            id: 1,
            name: 'URLvideo',
            value: urlVídeo
        }

        const response = await Api.post('/api/auth/config', body)
        if (response.id) toast.success('Vídeo adicionado com sucesso!')
        const { value } = await Api.get('/api/auth/config?name=URLvideo')
        setUrlVídeo(value)
        setIsLoading(false)
    }

    return (
        <div className={style.jogo}>
            {isLoading && <Spinner></Spinner>}
            <div className={style.jogoHeader}>
                <div className={style.title}>
                    <div>
                        <h1>Bem vindo!</h1>
                        <h3>Painel de administração</h3>
                    </div>
                </div>
            </div>
            <div className={style['poll-container']}>
                <h2 className={style['poll-title']}>URl do vídeo</h2>
                <div style={{ justifyContent: 'flex-start' }} className={style['poll-option']} >
                    <input value={String(urlVídeo)} onChange={(event) => setUrlVídeo(event.target.value)} type="text" className={style.inputOption} />
                </div>
                <button onClick={() => handlerUrl()} className={style['poll-submit-button']}>Salvar</button>
            </div>
        </div>
    )
}

export default AdminHomeInfoComponent