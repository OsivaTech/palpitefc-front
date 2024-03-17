import { createPortal } from "react-dom"
import { motion } from "framer-motion";
import style from "./style.module.css"
import { useEffect, useState } from "react";
import { userCreateType } from "src/types/UserCreateType";
import { UserType } from "src/types/UserType";
import Image from "next/image";
import Close from "../../../public/assets/assets/rectangle-xmark-regular.svg"
import Api from "src/providers/http/api";
import { toast } from "react-toastify";
import ModalRecuperarSenha from "../modalRecuperarSenha";


const Modal = ({ display, toggle, open, setOpen, setUserExibition, setHigherRole }: any) => {


    const [endereco, setEndereco] = useState<any>({ estado: '', cidade: '', rua: '' })
    const [user, setUser] = useState<UserType|any>({ name: '', email: '', password: '', role: 300, info: `${endereco.estado},${endereco.cidade},${endereco.rua}`, team: '', document: '', birthday: '', number: '', points: '' })
    const [senhaOk, setSenhaOk] = useState<boolean>(false)
    const [cadastroCompleto, setCadastroCompleto] = useState<boolean>(false)
    const [displayRecover, setDisplayRecover] = useState(false)
    const [count, setCount] = useState<number>(1)

    const toggleRecover = () => {
        setDisplayRecover(!displayRecover)
    }

    function handleNomeChange(e: any) {
        setUser({ ...user, name: e.target.value })
    }

    function handleEmailChange(e: any) {
        setUser({ ...user, email: e.target.value })
    }

    function handleSenhaChange(e: any) {
        setUser({ ...user, password: e.target.value })
        setSenhaOk(false)
    }

    function handleTeamChange(e: any) {
        setUser({ ...user, team: e.target.value })
    }

    function handleAniversarioChange(e: any) {
        setUser({ ...user, birthday: e.target.value })
    }

    function handleDocChange(e: any) {
        setUser({ ...user, document: e.target.value })
    }

    function handleEstadoChange(e: any) {
        setEndereco({ ...endereco, estado: e.target.value })
    }

    function handleCidadeChange(e: any) {
        setEndereco({ ...endereco, cidade: e.target.value })
    }

    function handleRuaChange(e: any) {
        setEndereco({ ...endereco, rua: e.target.value })
    }

    function handleNumberChange(e: any) {
        setUser({ ...user, number: e.target.value })
    }

    function handleVerifySenhaChange(e: any) {
        if (user.password === e.target.value) return setSenhaOk(true)
        return setSenhaOk(false)
    }

    useEffect(() => {
        setUser({ ...user, info: `${endereco.estado},${endereco.cidade},${endereco.rua}` });
    }, [endereco]);


    const handlerRole =(param: any) => {
        console.log('oi', param);
        
        if (Number(param) <= 200) return setHigherRole(true)
        return setHigherRole(false)
    }



    async function signup() {
        if ((user.email.includes('@')) && (user.password.length >= 6)) {
            const { message, ...response } = await Api.auth('api/signup', user)
            if (message) { return toast.error(message) }
            setOpen('login')
            return toast.success(`Olá ${response.user.name}, agora faça login!`)
        }
        return toast.error('Confira email e/ou senha.')
    }

    async function signin() {
        if (user.email.includes('@')) {
            const { message, ...response } = await Api.auth('api/signin', user)
            if (message) { return toast.error(message) }
            toggle()
            setUserExibition({ name: response.user.name })
            console.log(response.user);
            
            const infoUser = {
                name: response.user.name,
                birthday: response.user.birthday,
                number: response.user.number,
                document: response.user.document,
                email: response.user.email,
                team: response.user.team,
                info: response.user.info,
                role: response.user.role,
                points: response.user.points
            };
            handlerRole(response.user.role)
            localStorage.setItem('UserPalpite', response.user.name)
            localStorage.setItem('UserInfos', JSON.stringify(infoUser))
            return toast.success(`Seja bem vindo ${response.user.name}`)
        }
        return toast.error('Confira os dados digitados.')
    }

    return createPortal(
        <motion.div animate={{ x: 0, opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <div style={{ display: display ? 'block' : 'none', position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', padding: '50px' }}>
                <div className={style.contentModal}>
                    <div className={style.fecharModal}>
                        <span className={style.logoText}>Palpite Futebol Clube</span>
                        <button onClick={() => toggle()}>
                            <Image src={Close} alt='fechar' width={25} />
                        </button>
                    </div>
                    {open === 'cadastro' &&
                        <><motion.form initial={{ x: 15 }} animate={{ x: 0 }} transition={{ duration: 0.3 }} className={style.formModal}>
                            <span>Nome</span>
                            <input placeholder="Informe seu nome" type="text" name="nome" value={user.name} onChange={handleNomeChange} />
                            <span>Email</span>
                            <input placeholder="palpitefc@mail.com" type="email" name="email" value={user.email} onChange={handleEmailChange} />
                            {cadastroCompleto && <motion.div initial={{ y: -15 }} animate={{ y: 0 }} transition={{ duration: 0.3 }}>
                                <span> Documento de identificação </span>
                                <input style={{ width: '100%' }} type="text" placeholder="CPF/ID" name="doc" value={user.document} onChange={handleDocChange} />
                                <div className={style.dadosComplementares}>
                                    <div>
                                        <span>Time do coração</span>
                                        <input placeholder="Qual time voce torce" type="text" name="Nos diga seu time" value={user.team} onChange={handleTeamChange} />
                                        <span>Estado</span>
                                        <input placeholder="Seu estado" type="text" name="estado" value={endereco.estado} onChange={handleEstadoChange} />
                                        <span>Cidade</span>
                                        <input placeholder="Sua cidade" type="text" name="cidade" value={endereco.cidade} onChange={handleCidadeChange} />
                                    </div>
                                    <div>
                                        <span>Data de nascimento</span>
                                        <input type="date" name="date" value={user.birthday} onChange={handleAniversarioChange} />
                                        <span>Logradouro</span>
                                        <input placeholder="Rua,avenida,bloco,etc..." type="text" name="endereco" value={endereco.rua} onChange={handleRuaChange} />
                                        <span>Telefone</span>
                                        <input placeholder="Informe seu telefone" type="text" name="telefone" value={user.number} onChange={handleNumberChange} pattern="^\(?\d{2}\)?[- ]?\d{4,5}[- ]?\d{4}$" />
                                    </div>
                                </div> </motion.div>}
                            <span>Senha <span style={{ fontSize: '12px' }}>(minimo 6 digitos)</span>{user.password.length >= 6 && <span style={{ color: 'green', fontWeight: 'bolder' }}> &#10003; </span>}</span>
                            <input placeholder="********" type="password" name="senha" value={user.password} onChange={handleSenhaChange} />
                            <span>Confirme sua senha {senhaOk && <span style={{ color: 'green', fontWeight: 'bolder' }}> &#10003; </span>}</span>
                            <input placeholder="********" type="password" name="senha" onChange={handleVerifySenhaChange} />
                        </motion.form>
                            <span className={style.btnCadastroCompleto}> <span> Clique aqui para fazer o cadastro completo e concorrer a premios </span><input type="checkbox" onClick={() => setCadastroCompleto(!cadastroCompleto)} /></span>
                            <button className={style.btnOn} type="button" disabled={user.name && user.email && user.password && senhaOk ? false : true}
                                onClick={() => signup()} >Cadastrar</button>
                            <button className={style.modalNav} onClick={() => { setOpen('login'), setCadastroCompleto(false) }}>Entrar</button></>
                    }
                    {open === 'login' &&
                        <><motion.form initial={{ x: -15 }} animate={{ x: 0 }} transition={{ duration: 0.3 }} className={style.formModal}>
                            <span>Email</span>
                            <input placeholder="palpitefc@mail.com" type="email" name="email" value={user.email} onChange={handleEmailChange} />
                            <span>Senha</span>
                            <input placeholder="********" type="password" name="senha" value={user.password} onChange={handleSenhaChange} />
                            <button style={{ display: 'flex', justifyContent: 'end', fontSize: '14px' }} type="button" onClick={() => toggleRecover()}>Recuperar senha</button>
                        </motion.form >
                            <button className={style.btnOn} type="button" disabled={user.email && user.password ? false : true}
                                onClick={() => signin()} >Entrar</button>
                            <button className={style.modalNav} onClick={() => setOpen('cadastro')}>Cadastrar</button></>
                    }
                </div>
            </div>
            {displayRecover && <ModalRecuperarSenha toggleRecover={toggleRecover} displayRecover={displayRecover} />}
        </motion.div>,
        document.body
    )
}

export default Modal