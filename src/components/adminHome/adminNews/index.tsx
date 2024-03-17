import Image from "next/image"
import { useEffect, useState } from "react"
import Api from "src/providers/http/api";
import style from "./style.module.css"
import Cookie from "src/providers/storage/cookie"
import Spinner from "src/components/spinner";
import { toast } from "react-toastify";

function NewsComponent() {

    const [editar, setEdit] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [news, setNews] = useState<any[]>([])

    const [newsEdit, setNewsEdit] = useState({ id: NaN, title: '', content: '' })

    useEffect(() => {
        (async () => {
            setIsLoading(true)
            const news = await Api.get('/api/auth/news')
            setNews(news)
            setIsLoading(false)
        })()
    }, [])

    function add() {
        setEdit(true)
    }

    const save = async () => {
        if (!newsEdit.title || !newsEdit.content) return toast.error('Título e o conteúdo obrigatórios')
        setIsLoading(true)
        const getCookie: any = await Cookie.get('user')
        const user = JSON.parse(getCookie);
        const body = {
            news: {
                id: newsEdit.id ? newsEdit.id : undefined,
                title: newsEdit.title,
                content: newsEdit.content,
                userId: Number(user.id),
            }
        }
        const response = await Api.post('/api/auth/news', body)
        if (response.id) toast.success('Notícia salva com sucesso!')
        const news = await Api.get('/api/auth/news')
        setNews(news)
        setNewsEdit({ id: NaN, title: '', content: '' })
        setEdit(false)
        setIsLoading(false)
    }
    function edit(key: number) {
        setNewsEdit({ id: news[key].id, title: news[key].title, content: news[key].content })
        setEdit(true)
    }

    async function remove() {
        setIsLoading(true)
        const body = {
            id: newsEdit.id
        }
        const response = await Api.delete('/api/auth/news', body)
        if (response.id) toast.success('Notícia excluída com sucesso!')
        const news = await Api.get('/api/auth/news')
        setNews(news)
        setNewsEdit({ id: NaN, title: '', content: '' })
        setEdit(false)
        setIsLoading(false)
    }

    function handlerImage(image: string) {
        if (!image) return ''
        if (image === 'cruzeiro') return '/assets/assets/clubes/Cruzeiro.png'
        if (image === 'atletico') return '/assets/assets/clubes/AtléticoMG.png'
    }

    return (
        <div className={style.jogo}>
            {isLoading && <Spinner></Spinner>}
            <div className={style.title}>
                <h1>Notícias</h1>
                <h3>Administração</h3>
                {!editar && <div className={style.newRound}>
                    <button className={style.buttonAdd} onClick={() => add()} >Nova notícia</button>
                </div>}
            </div>
            {editar && <div className={style.inputsDiv}>
                <input value={newsEdit.title} onChange={(event) => setNewsEdit(prevState => ({ ...prevState, title: event.target.value }))} className={style.inputTitle} type="text" placeholder="Digite o titulo" />
                <textarea maxLength={499} value={newsEdit.content} onChange={(event) => setNewsEdit(prevState => ({ ...prevState, content: event.target.value }))} className={style.textarea} placeholder="Digite o conteúdo" />
                <span className={style.contador}>Caracteres restantes: {499 - newsEdit.content.length}</span>
                <div className={style.acao}>
                    <div>

                    </div>
                    <div>
                        <button className={style.buttonDelete} onClick={() => remove()} >Excluir notícia</button>
                        <button className={style.buttonAdd} onClick={() => save()} >Salvar notícia</button>
                    </div>
                </div>
            </div>}
            {!editar &&
                <div style={{ width: '100%', height: '90%', display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '10px' }}>
                    {!news.length && <p>Sem notícias cadastradas...</p>}
                    {news.map((e, key) => {
                        return (
                            <div key={key} onClick={() => edit(key)} className={style.card}>
                                <div className={style.news}>
                                    <Image src={String(handlerImage(e.author.team))} alt="" width={80} height={80} />
                                    <div className={style.newsContent}>
                                        <span style={{ fontSize: '1.3rem' }}>{e.title}</span>
                                        <span style={{ overflow: 'hidden', fontSize: '0.9rem', textOverflow: 'ellipsis', maxWidth: '40ch' }}>{e.content}</span>
                                        <h6 style={{ fontSize: '0.9rem' }}><b>Autor: </b> {e.author.name}</h6>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    {news.length > 0 && <button onClick={() => { setIsLoading(true); setIsLoading(false) }} className={style.button}>Carregar mais</button>}
                </div>}
        </div>
    )
}

export default NewsComponent