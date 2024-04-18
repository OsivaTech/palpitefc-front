import Logo from "../../../public/assets/assets/logo_topo.png"
import style from "./style.module.css"
import Image from "next/image"
import { useEffect, useState } from "react"
import Modal from '../modal'
import Api from "src/providers/http/api"
import { userExhibitionType } from "src/types/userExhibitionType"
import ModalUpdateUser from "../modalUpdateUser"
import Link from "next/link"
import { log } from "console"

function HeaderPrincipal() {

    const [closeBan, setCloseBan] = useState<boolean>(false)
    const [displayModal, setDisplayModal] = useState(false)
    const [displayModalUpdate, setDisplayModalUpdate] = useState(false)
    const [open, setOpen] = useState('')
    const [userExibition, setUserExibition] = useState<userExhibitionType>({ name: '' })
    const [higherRole, setHigherRole] = useState<boolean>(false)

    const toggle = () => {
        setDisplayModal(!displayModal)
    }

    const toggleUpdate = () => {
        setDisplayModalUpdate(!displayModalUpdate)
    }

    useEffect(() => {
        const nameUser = localStorage.getItem('UserPalpite')
        setUserExibition({ name: !nameUser ? '' : nameUser })
    }, [])

    async function Sair() {
        localStorage.clear()
        return Api.signOut()
    }

    useEffect(() => {
        const prefer = localStorage.setItem('prefer', 'prefer')
        console.log(higherRole);
        
    }, [higherRole])


    return (
        <header className={style.headerPai}>
            <div className={style.Header1}>
                <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                    <Image src={Logo} height={40} width={400} alt="palpite.com" className={style.imagemLogomarcaHeaderMobile} />
                    <h6>Seu palpite é gol de placa! </h6>
                </div>
                <div className={style.containerHeader}>
                    {!userExibition.name.length ? <span onClick={() => { toggle(); setOpen('cadastro') }}>Cadastre-se</span>
                        :
                        <span className={!higherRole ? style.nomeExibir : style.nomeOcultar} onClick={() => toggleUpdate()}>Olá {`${userExibition.name.replace(/^\w/, c => c.toUpperCase()).split(' ')[0]}`}</span>}
                        {higherRole && (<Link href="/admin" target="_blank" style={{color: 'white'}}> Painel de gestão</Link>)}
                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                        <Image src={Logo} height={40} width={400} alt="palpite.com" className={style.imagemLogomarcaHeader} />
                        <h6>Seu palpite é gol de placa!</h6>
                    </div>
                    {!userExibition.name.length ? <span onClick={() => { toggle(); setOpen('login') }}>Login</span>
                        :
                        <span onClick={() => Sair()}>Sair</span>}
                </div>
            </div>
            {displayModal && <Modal toggle={toggle} display={displayModal} open={open} setOpen={setOpen} setUserExibition={setUserExibition} setHigherRole={setHigherRole}/>}
            {displayModalUpdate && <ModalUpdateUser toggleUpdate={toggleUpdate} displayModalUpdate={displayModalUpdate} />}
        </header>
    )
}

export default HeaderPrincipal