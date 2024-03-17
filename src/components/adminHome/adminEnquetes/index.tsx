import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Spinner from 'src/components/spinner';
import Api from 'src/providers/http/api';
import style from './style.module.css'

function AdminEnquetesComponents() {

    const [votes, setVote] = useState<any[]>([])

    const [isLoading, setIsLoading] = useState(false);

    const [editar, setEdit] = useState(NaN)

    useEffect(() => {
        (async () => {
            setIsLoading(true)
            const votes = await Api.get('/api/auth/vote')
            setVote(votes)
            setIsLoading(false)
        })()
    }, [])

    async function save(indexVote: number) {
        if(!votes[indexVote].title) return toast.error('Digite um título')
        if(!votes[indexVote].options || votes[indexVote].options.length < 2) return toast.error('Insira pelo menos duas opções')
        const options = votes[indexVote].options
        let validaTitle = false
        options.forEach((e:any) => {!e.title ? validaTitle = true : '' })
        if(validaTitle) return toast.error('Insira pelo menos duas opções válidas')
        setIsLoading(true)
        const body = votes[indexVote]
        const response = await Api.post('/api/auth/vote', body)
        if (response.id) toast.success('Enquete criada com sucesso!')
        if(!votes[indexVote].id) {
            for (let i = 0; i < options.length; i++) {
                const element = options[i];
                const body = {
                    title: element.title,
                    voteId: response.id
                };
                await Api.post('/api/auth/option', body);
            }
        }
        const responseVote = await Api.get('/api/auth/vote')
        setVote(responseVote)
        setEdit(NaN)
        setIsLoading(false)
    }

    async function del(indexVote: number, indexOption: number) {
        const id = votes[indexVote].id
        const response = await Api.delete(`api/auth/vote?id=${id}`)
        if (response.id) toast.success('Enquete excluída com sucesso!')
        const responseVote = await Api.get('/api/auth/vote')
        setVote(responseVote)
        setEdit(NaN)
        setIsLoading(false)
    }

    function addVote() {
        if(votes.length >= 2) return toast.error('Limite de enquetes ativas atingido')
        const newVote = {
            title: '',
            options: []
        }
        setVote([...votes, newVote])
        setEdit(votes.length)
    }

    function addOption(indexVote: number) {
        const option = {
            voteId: votes[indexVote].id,
            title: ''
          };
          const updatedVote = {
            ...votes[indexVote],
            options: [...votes[indexVote].options, option]
          };
          const newVotes = [
            ...votes.slice(0, indexVote),
            updatedVote,
            ...votes.slice(indexVote + 1)
          ];
          setVote(newVotes);
    }

    function trataProgress(index:number) {
        if(!votes || !votes[index] || !votes[index].options) return 0
        let a = 0
        votes[index].options.forEach((e:any) => {
            a += e.count 
        })
        return a
    }

    function handlerTitle(event: any, key: number) {
        const newVotes = votes.map((vote, index) =>
            index === key ? { ...vote, title: event.target.value } : vote
        )
        setVote(newVotes)
    }
    function handlerOptionTitle(event: any, key: number, index: number) {
        const newOptions = votes[key].options.map((option: any, i: number) =>
          i === index ? { ...option, title: event.target.value } : option
        );
        const newVote = {
          ...votes[key],
          options: newOptions
        };
        const newVotes = [
          ...votes.slice(0, key),
          newVote,
          ...votes.slice(key + 1)
        ];
        setVote(newVotes);
      }

    return (
        <div className={style.jogo}>
            {isLoading && <Spinner></Spinner>}
            <div className={style.title}>
                <h1>Enquetes</h1>
                <h3>Administração</h3>
                <div className={style.newRound}>
                    <button className={style.buttonAdd} onClick={() => addVote()} >Nova Enquete</button>
                </div>
            </div>
            {votes && votes.map((vote, key) => {
                return (
                    <div key={key} className={style['poll-container']}>
                        {editar != key ?
                        <h2 className={style['poll-title']}>{vote.title}</h2>:
                        <input onChange={(event) => handlerTitle(event, key)} type="text" value={vote.title} className={style.inputTitle} placeholder="Digite um título"/>
                        }
                            <div >
                                {vote.options && vote.options.map((option: any, index: number) => {
                                    return (
                                    <div style={{justifyContent:editar !=key ? 'flex-end': 'flex-start'}} key={index} className = {style['poll-option']} >
                                        {editar == key ?
                                        <input value={option.title} onChange={(event) => handlerOptionTitle(event, key, index)} type="text" className={style.inputOption} placeholder="Digite uma opção"/>:
                                        <><div style={{textAlign:'end', whiteSpace: 'nowrap'}}>
                                            {option.title}
                                        </div> 
                                        <div className={style.progress}><div style={{width: `${(option.count / trataProgress(key)) * 100}%`}}></div></div>{option.count}</>}
                                    </div>
                                )})}
                                {editar != key && `total: ${trataProgress(key)}`}
                                {vote.options && vote.options.length < 3 && editar == key && 
                                <div>
                                    <button onClick={() => addOption(key)} style={{background: 'rgb(92, 231, 92)'}} className={style['poll-add-button']}>+</button>
                                    <br />
                                </div>}
                            {editar == key && <button onClick={() => save(key)} style={{background: 'rgb(92, 231, 92)'}} className={style['poll-submit-button']}>Salvar</button>}
                            {/* :<button onClick={() => setEdit(key)} style={{background: 'yellow'}} className={style['poll-submit-button']}>Editar</button>} */}
                            <button onClick={() => del(key, 0)} style={{background: 'red'}} className={style['poll-submit-button']}>Encerrar</button>
                        </div>
                    </div>
                )})}
        </div>
    )
}

export default AdminEnquetesComponents