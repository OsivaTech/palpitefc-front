import { useEffect, useState } from "react";
import Spinner from "src/components/spinner";
import Api from "src/providers/http/api"
import style from "./style.module.css"

function MenuComponent({setMenu}:any) {

    const [role, setRole] = useState<any>(200)

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => { 
        (async() => {
            setIsLoading(true)
            const role = await Api.get('/api/auth/user')
            if(!role.role) return window.location.href = '/'
            setRole(role)
            setIsLoading(false)
        })()
    }, []);
    

    async function Sair() {
        localStorage.clear()
        return Api.signOut()
    }
    
    return (
        <aside className={style.menu}>
            {isLoading && <Spinner></Spinner>} 
            { role.role === 100 && <a onClick={() => setMenu('home')}>Home</a> }
            { role.role === 100 && <a onClick={() => setMenu('campeonato')}>Campeonatos</a>}
            { role.role === 100 && <a onClick={() => setMenu('rodada')}>Rodadas</a>}
            { role.role === 100 && <a onClick={() => setMenu('jogo')}>Jogos</a> }
            { role.role === 100 && <a onClick={() => setMenu('posicao')}>Classificação</a> }
            { role.role <   300 && <a onClick={() => setMenu('news')}>Notícias</a> }
            { role.role === 100 && <a onClick={() => setMenu('enquetes')}>Enquetes</a>     }    
            { role.role === 100 && <a onClick={() => setMenu('user')}>Usuários</a>         }
            <a href="/">Palpites 
                <svg className={style.exitIcon} fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M352 96h64c17.7 0 32 14.3 32 32V384c0 17.7-14.3 32-32 32H352c-17.7 0-32 14.3-32 32s14.3 32 32 32h64c53 0 96-43 96-96V128c0-53-43-96-96-96H352c-17.7 0-32 14.3-32 32s14.3 32 32 32zm-7.5 177.4c4.8-4.5 7.5-10.8 7.5-17.4s-2.7-12.9-7.5-17.4l-144-136c-7-6.6-17.2-8.4-26-4.6s-14.5 12.5-14.5 22v72H32c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32H160v72c0 9.6 5.7 18.2 14.5 22s19 2 26-4.6l144-136z"/>
                </svg>
            </a>
            <a onClick={() => Sair()}> Sair
                <svg className={style.exitIcon} fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M352 96h64c17.7 0 32 14.3 32 32V384c0 17.7-14.3 32-32 32H352c-17.7 0-32 14.3-32 32s14.3 32 32 32h64c53 0 96-43 96-96V128c0-53-43-96-96-96H352c-17.7 0-32 14.3-32 32s14.3 32 32 32zm-7.5 177.4c4.8-4.5 7.5-10.8 7.5-17.4s-2.7-12.9-7.5-17.4l-144-136c-7-6.6-17.2-8.4-26-4.6s-14.5 12.5-14.5 22v72H32c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32H160v72c0 9.6 5.7 18.2 14.5 22s19 2 26-4.6l144-136z"/>
                </svg>
            </a>                         
       </aside>
    )
}

export default MenuComponent