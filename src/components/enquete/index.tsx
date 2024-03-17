import style from "./style.module.css"
import Api from "src/providers/http/api"
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react"
import { toast } from "react-toastify";

function Enquete() {
    const [prox, setProx] = useState<boolean>(true)
    const [enquete, setEnquete] = useState<any>([])
    const [votos, setVotos] = useState<any>([])
    const [count, setCount] = useState<number>(1)

    useEffect(() => {
        (async () => {
            const res = await Api.get('/api/vote')
            setEnquete(res)
        })()
    }, [])

    function toggle() {
        setProx(!prox)
    }

    async function sendVote(clicked: any) {
        const vote = { id: clicked }
        const { message, ...res } = await Api.post('/api/auth/option', vote)
        if (message) { return toast.error('Faça login para poder votar') }
        setVotos(res.options)
        setCount(count + 1)
        return toast.success(`Voto recebido!`)
    }

    useEffect(() => {

        const totalCount = votos.reduce((sum: any, option: any) => sum + option.count, 0);
        const newVotos = votos.map((option: any) => ({
            ...option,
            percentage: (option.count / totalCount) * 100,
        }));
        setVotos(newVotos);
    }, [count])

    const hasPercentage = votos.some((option: any) => option.percentage !== undefined);

    useEffect(() => {
        const interval = setInterval(() => {
            setProx(!prox);
        }, 30000);
        return () => clearInterval(interval);
    });

    return (
        <div className={style.containerEnquete}>
            {Array.isArray(enquete) && (
                <>
                    {enquete.sort((a: any, b: any) => b.id - a.id).map((enq: any, index: number) => (
                        prox && index === 0 && (
                            <motion.div animate={{ x: 0, opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 0.5 }} className={style.content} key={index}>
                                <div className={style.title}>
                                    <span>Opine </span>
                                    <button onClick={() => toggle()}>Prox</button>
                                </div>
                                <textarea disabled name="" id="" cols={10} rows={2} value={enq.title} />
                                {enq.options?.map((opt: any, key: any) => (
                                    <button key={key} type="button" className={style.btnEnquete} onClick={() => sendVote(opt.id)}>
                                        <h4> {opt.title} </h4>
                                        {hasPercentage && (votos.find((option: any) => option.id === opt.id)?.percentage || 0) > 0 && (
                                            <h5>{(votos.find((option: any) => option.id === opt.id)?.percentage || 0).toFixed(2)}%</h5>
                                        )}
                                    </button>
                                ))}
                            </motion.div>
                        )
                    ))}
                    {enquete.sort((a: any, b: any) => b.id - a.id).map((enq: any, index: number) => (
                        !prox && index === 1 && (
                            <motion.div animate={{ x: 0, opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 0.3 }} className={style.content} key={index}>
                                <div className={style.title}>
                                    <span>Interaja </span>
                                    <button onClick={() => toggle()}>Prox</button>
                                </div>
                                <textarea disabled name="" id="" cols={10} rows={2} value={enq.title} />
                                {enq.options?.map((opt: any, key: any) => (
                                    <button key={key} type="button" className={style.btnEnquete} onClick={() => sendVote(opt.id)}>
                                        <h4> {opt.title} </h4>
                                        {hasPercentage && (votos.find((option: any) => option.id === opt.id)?.percentage || 0) > 0 && (
                                            <h5>{(votos.find((option: any) => option.id === opt.id)?.percentage || 0).toFixed(2)}%</h5>
                                        )}
                                    </button>
                                ))}
                            </motion.div>
                        )
                    ))}
                </>
            )}
        </div>
    );

}

export default Enquete