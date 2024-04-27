import { createPortal } from "react-dom"
import { motion } from "framer-motion";
import style from "./style.module.css"
import { useEffect, useState } from "react";
import Image from "next/image";
import Close from "../../../public/assets/assets/rectangle-xmark-regular.svg"
import Api from "src/providers/http/api";
import { toast } from "react-toastify";
import { UserTypeUpdate } from "src/types/UserTypeUpdate";


const ModalUpdateUser = ({ displayModalUpdate, toggleUpdate }: any) => {

    const [endereco, setEndereco] = useState<any>({ estado: '', cidade: '', rua: '' })
    const [user, setUser] = useState<UserTypeUpdate>({ name: '', email: '', info: `${endereco.estado},${endereco.cidade},${endereco.rua}`, team: '', document: '', birthday: '', number: '' })
    const [updUser, setUpdUser] = useState(false)

    function handleNomeChange(e: any) {
        setUser({ ...user, name: e.target.value })
    }

    function handleEmailChange(e: any) {
        setUser({ ...user, email: e.target.value })
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

    useEffect(() => {
        setUser({ ...user, info: `${endereco.estado},${endereco.cidade},${endereco.rua}` });
    }, [endereco]);


    useEffect(() => {
        const infos = JSON.parse(localStorage.getItem('UserInfos') ?? '{}');

        const end = infos && infos.info ? infos.info.split(',') : [];
        setEndereco({
            estado: end[0],
            cidade: !end[1] ? '' : end[1],
            rua: !end[2] ? '' : end[2],
        });


        const lograd = end.length > 1 ? end[2] : '';

        setUser({
            name: infos.name,
            birthday: infos.birthday,
            number: infos.number,
            document: infos.document,
            email: infos.email,
            team: infos.team,
            info: `${end[0]},${end[1]},${end[2]}, ${end[3]}`
        });
    }, []);


    async function updateUser() {
        const { message, ...response } = await Api.post('api/users', user)

        if (message) { return toast.error(message) }
        const end = response && response.info ? response.info.split(',') : [];
        setUser({
            name: response.name,
            birthday: response.birthday,
            number: response.number,
            document: response.document,
            email: response.email,
            team: response.team,
            info: `${end[0]},${end[1]},${end[2]}, ${end[3]}`
        });
        localStorage.setItem('UserInfos', JSON.stringify(user))
        toggleUpdate()
        // setUserExibition({ name: response.user.name })
        return toast.success(`Dados atualizados com sucesso ${response.name}`)
    }

    return createPortal(
        <motion.div animate={{ x: 0, opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <div style={{ display: displayModalUpdate ? 'block' : 'none', position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', padding: '50px' }}>
                <div className={style.contentModal}>
                    <div className={style.fecharModal}>
                        <span className={style.logoText}>Atualizar Perfil</span>
                        <button onClick={() => toggleUpdate()}>
                            <Image src={Close} alt='fechar' width={25} />
                        </button>
                    </div>
                    <motion.form initial={{ x: 15 }} animate={{ x: 0 }} transition={{ duration: 0.3 }} className={style.formModal}>
                        <span>Nome</span>
                        <input placeholder="Informe seu nome" type="text" name="nome" value={user.name} onChange={handleNomeChange} />
                        <span>Email</span>
                        <input placeholder="palpitefc@mail.com" type="email" name="email" value={user.email} onChange={handleEmailChange} />
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
                        </div>
                    </motion.form>
                    <button className={style.btnOn} type="button" disabled={user.name && user.email ? false : true} onClick={() => updateUser()} >Salvar</button>
                </div>
            </div>
        </motion.div>,
        document.body
    )
}

export default ModalUpdateUser