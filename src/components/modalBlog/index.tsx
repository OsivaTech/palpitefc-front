import { createPortal } from "react-dom"
import { motion } from "framer-motion";
import style from "./style.module.css"
import Image from "next/image";
import Close from "../../../public/assets/assets/rectangle-xmark-regular.svg"


const ModalBlog = ({ display, toggle, newsCruzeiro, newsAtletico, open, setOpen }: any) => {

    return createPortal(
        <motion.div animate={{ x: 0, opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <div style={{ display: display ? 'block' : 'none', position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', padding: '50px' }}>
                <div className={style.contentModal}>
                    <div className={style.fecharModal}>
                        <span className={style.logoText}>Blog do Palpite Futebol Clube</span>
                        <button onClick={() => toggle()}>
                            <Image src={Close} alt='fechar' width={25} />
                        </button>
                    </div>
                    {open === 'cruzeiro' && <div className={style.contentModalBlog}>
                        <h1>{newsCruzeiro.title}</h1>
                        <h6>por {newsCruzeiro.author}</h6>
                        <div>{newsCruzeiro.content}</div>
                    </div>}
                    {open === 'atletico' && <div className={style.contentModalBlog}>
                        <h1>{newsAtletico.title}</h1>
                        <h6>por {newsAtletico.author}</h6>
                        <div>{newsAtletico.content}</div>
                    </div>}
                </div>
            </div>
        </motion.div>,
        document.body
    )
}

export default ModalBlog