import { useEffect, useState } from "react"
import { toast } from "react-toastify";
import Spinner from "src/components/spinner";
import Api from "src/providers/http/api"
import style from "./style.module.css"

function AdminUserComponent() {

    const [editar, setEdit] = useState(false)

    const [users, setUsers] = useState<any[]>([]);

    const [editUser, setEditUser] = useState({name: '', email: '', role: 0, document: '', team: '', info: '', birthday: ''});

    const colors = ["#F44336","#E91E63","#9C27B0","#3F51B5","#2196F3","#4CAF50","#FFC107","#FF9800","#607D8B"];

    const [isLoading, setIsLoading] = useState(false);

    const [width, setWidth] = useState<number>(0)
    const [height, setHeight] = useState<number>(0)

    useEffect(() => {
        (async () => {
            setIsLoading(true)
            const response = await Api.get('/api/user')
            setUsers(response)
            setIsLoading(false)
            setWidth(window.innerWidth)
            setHeight(window.innerHeight)
        })()
    }, [])

    function edit(key: number) {
        setEditUser(users[key])
        setEdit(true)
    }

    async function save() {
        if(editUser.role === 200 && !editUser.team) return toast.error('Para usuário do tipo jornalista, é obrigatório selecionar o time')
        setIsLoading(true)
        const body = {
            ...editUser
        }
        const volta = await Api.post('/api/auth/user', body)
        if(volta.id) toast.success(' Usuário salvo com sucesso')
        const response = await Api.get('/api/user')
        setUsers(response)
        setEdit(false)
        setIsLoading(false)
    }

    function brDate(date:any){ return (new Date(date)).toLocaleDateString('pt-BR')}

    return (
        <>
        {isLoading && <Spinner></Spinner>}
            <div className={style.header}>
                <div className={style.title}>
                    <h1>Usuários</h1>
                    <h3>Administração</h3>
                </div>
                {editar ?
                    <div className={style.editUser}>
                        <div className={style.form}>
                            <div className={style.titelForm}>
                                <h1>Detalhes do usuário</h1>
                            </div>
                            <div>
                                <article>
                                    <span>Nome</span>
                                    <input onChange={(event) => setEditUser(e => ({...e, name: event.target.value}))} value={editUser.name} type="text" />
                                </article>
                                <article>
                                    <span>E-mail</span>
                                    <input onChange={(event) => setEditUser(e => ({...e, email: event.target.value}))} value={editUser.email} type="text" />
                                </article>
                                <article>
                                    <span>Cargo</span>
                                    <select defaultValue={editUser.role} onChange={(event) => setEditUser(e => ({...e, role: Number(event.target.value)}))}>
                                        <option value={300}>Usuário</option>
                                        <option value={200}>Jornalista</option>
                                        <option value={100}>Admin</option>
                                    </select>
                                </article>
                                <article>
                                    <span>CPF</span>
                                    <input onChange={(event) => setEditUser(e => ({...e, document: event.target.value}))} value={editUser.document || ''} type="text" />
                                </article>
                                <article>
                                    <span>Time</span>
                                    <select defaultValue={editUser.team || ''} onChange={(event) => setEditUser(e => ({...e, team: event.target.value}))}>
                                        <option value={''}>Selecione o time</option>
                                        <option value={'atletico'}>Atlético-MG</option>
                                        <option value={'cruzeiro'}>Cruzeiro</option>
                                    </select>
                                </article>
                                <article>
                                    <span>Info</span>
                                    <input onChange={(event) => setEditUser(e => ({...e, info: event.target.value}))} value={editUser.info || ''} type="text" />
                                </article>
                                <article>
                                    <span>Nascimento</span>
                                    <input onChange={(event) => setEditUser(e => ({...e, birthday: event.target.value}))} value={brDate(editUser.birthday)} type="date" />
                                </article>
                            </div>
                            <div className={style.formButton}>
                                <button className={style.buttonCancelar} onClick={() => setEdit(false)} >Cancelar</button>
                                <button className={style.buttonAdd} onClick={() => save()} >Salvar</button>
                            </div>
                        </div>
                    </div>
                    :
                    <div className={style.divTable}>

                    <table className={style.table}>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Cargo</th>
                                {width > 500 && <th>E-mail</th>}
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, key) => {
                                const randomIndex = Math.floor(Math.random() * colors.length);
                                const randomColor = colors[randomIndex];
                                return (
                                    <tr key={key}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                {width > 500 && <span className={style.avatar} style={{ backgroundColor: randomColor }}>{user.name.substring(0, 2)}</span>}
                                                {user.name}
                                            </div>
                                        </td>
                                        <td>{user.role === 100 ? 'Admin' : user.role === 200 ? 'Jornalista' : user.role === 300 ? 'Usuário' : ''}</td>
                                        {width > 500 && <td>{user.email}</td>}
                                        <td>
                                            <button className={style.buttonEditar} onClick={() => edit(key)}>
                                                <svg className={style.acaoEditar} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                    <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                }
            </div>
        </>
        )
}

export default AdminUserComponent