import { createPortal } from "react-dom"
import { motion } from "framer-motion";
import style from "./style.module.css"
import Image from "next/image";
import Close from "../../../public/assets/assets/rectangle-xmark-regular.svg"
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Api from "src/providers/http/api";
import { RecoverSenha } from "src/types/RecoverSenha";


const ModalRecuperarSenha = ({ displayRecover, toggleRecover }: any) => {

    const [codeOk, setCodeOk] = useState<boolean>(false)
    const [email, setEmail] = useState<string>('')
    const [codeRecebido, setCodeRecebido] = useState<string>('')
    const [newPass, setNewPass] = useState<string>('')

    const [senhaOk, setSenhaOk] = useState<boolean>(false)
    const [user, setUser] = useState<RecoverSenha>({ email: email, password: '', code: codeRecebido })


    function handleEmailChange(e: any) {
        setEmail(e.target.value)
    }

    function handleCodeChange(e: any) {
        setCodeRecebido(e.target.value)
    }

    function handleSenhaChange(e: any) {
        setNewPass(e.target.value)
        setSenhaOk(false)
    }

    function handleVerifySenhaChange(e: any) {
        if (newPass === e.target.value) {
            setUser({ email: email, password: newPass, code: codeRecebido })
            return setSenhaOk(true)
        }
        return setSenhaOk(false)
    }

    useEffect(() => {
        if (codeRecebido.length === 6) return setCodeOk(true)
        return setCodeOk(false)
    }, [codeRecebido])

    async function sendEmail() {
        if (email.includes('@')) {
            const { message, ...response } = await Api.auth('api/sendemailcode', { email: email })
            if (message) { return toast.error('Email nao encontrado.') }
            return toast.success(`Email com codigo de recuperação enviado!`)
        }
        return toast.error('Confira o email digitado.')
    }

    async function recuperarSenha() {

        const { message, ...response } = await Api.auth('api/resetpassword', user)
        if (message) { return toast.error('Codigo invalido ou expirado') }
        toggleRecover()
        return toast.success(`Senha alterada com sucesso!`)
    }

    return createPortal(
        <motion.div animate={{ x: 0, opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <div style={{ display: displayRecover ? 'block' : 'none', position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', padding: '50px' }}>
                <div className={style.contentModal}>
                    <div className={style.fecharModal}>
                        <span className={style.logoText}>Suporte de senha Palpite Futebol Clube</span>
                        <button onClick={toggleRecover}>
                            <Image src={Close} alt='fechar' width={25} />
                        </button>
                    </div>
                    <div className={style.senEmail}>
                        <input placeholder="Digite seu email cadastrado" type="email" name="email" value={email} onChange={handleEmailChange} />
                        <button className={style.btnOn} onClick={() => sendEmail()} >ENVIAR CÓDIGO</button>
                    </div>
                    <div className={style.senCode}>
                        <span>Insira o código que chegou no seu email</span>
                        <input type="text" maxLength={6} placeholder="******" name="code" value={codeRecebido} onChange={handleCodeChange} />
                    </div>
                    {codeOk && <motion.div initial={{ y: -15 }} animate={{ y: 0 }} transition={{ duration: 0.8 }} className={style.contentModalBlog}>
                        <span>Senha <span style={{ fontSize: '12px' }}>(minimo 6 digitos)</span>{newPass.length >= 6 && <span style={{ color: 'green', fontWeight: 'bolder' }}> &#10003; </span>}</span>
                        <input placeholder="********" type="password" name="senha" value={newPass} onChange={handleSenhaChange} />
                        <span>Confirme sua senha {senhaOk && <span style={{ color: 'green', fontWeight: 'bolder' }}> &#10003; </span>}</span>
                        <input placeholder="********" type="password" name="senha" onChange={handleVerifySenhaChange} />
                        <button className={style.btnOn} type="button" disabled={user.email && user.code && user.password ? false : true} onClick={() => recuperarSenha()} >ALTERAR SENHA</button>
                    </motion.div>}
                </div>
            </div>
        </motion.div>,
        document.body
    )
}

export default ModalRecuperarSenha