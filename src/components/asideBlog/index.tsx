import Image from "next/image"
import cruzeiro from "../../../public/assets/assets/cruzeiro.svg"
import atletico from "../../../public/assets/assets/atletico.svg"
import noticias from "../../../public/assets/assets/noticiasIcon.png"
import style from "./style.module.css"
import { useEffect, useState } from "react"
import CardSkeleton from "../skeleton"
import Api from "src/providers/http/api"
import YouTube from 'react-youtube';
import { newsRenderType } from "src/types/newsRenderType"
import ModalBlog from "../modalBlog"
import anuncio from "../../../public/assets/assets/Anuncie-aqui.png"


function AsideBlog() {

    const [isLoading, setLoading] = useState<boolean>(true)
    const [linkVideo, setLinkVideo] = useState<string>('')
    const [newsCruzeiro, setNewsCruzeiro] = useState<newsRenderType>({ title: '', content: '', author: '' })
    const [newsAtletico, setNewsAtletico] = useState<newsRenderType>({ title: '', content: '', author: '' })
    const [displayModal, setDisplayModal] = useState(false)
    const [open, setOpen] = useState('')


    const toggle = () => {
        setDisplayModal(!displayModal)
    }

    //personalizacao do video player
    const opts = {
        height: '180',
        width: '100%',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    }

    useEffect(() => {
        (async () => {
            const { value } = await Api.get('/api/urlvideo')
            setLinkVideo(value && value.split('=')[1])
            const res = await Api.get('/api/news')
            const cruzeiro = res.filter((team: any) => team.author.team === 'cruzeiro').sort((a: any, b: any) => b.id - a.id)
            const atletico = res.filter((team: any) => team.author.team === 'atletico').sort((a: any, b: any) => b.id - a.id)
            setNewsCruzeiro({
                title: cruzeiro[0]?.title,
                content: cruzeiro[0]?.content,
                author: cruzeiro[0]?.author.name
            })

            setNewsAtletico({
                title: atletico[0]?.title,
                content: atletico[0]?.content,
                author: atletico[0]?.author.name
            })
        })()
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    return (
        <aside className={style.paiAsideBlog}>
            {isLoading && <CardSkeleton ranking={false} video={false} blog={true} cards={null} enquete={false} />}
            {!isLoading &&
            <div className={style.cardInfo}>
                <div className={style.headerBlog}>
                    <Image src={noticias} width={25} height={10} style={{ marginRight: '0.5rem' }} alt="noticias" />
                    Blog
                </div>
                <div className={style.contentBlogMobile}>
                    <section>
                        <div className={style.contentNoticias}>
                            <div style={{ display: "flex", flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}>
                                <h1 style={{ marginTop: '4px' }}>{newsCruzeiro.author}</h1> <Image src={cruzeiro} width={50} height={50} alt="Cruzeiro" />
                            </div>
                            <article>
                                <h1>{newsCruzeiro.title}</h1>
                                <div>{newsCruzeiro.content}</div>
                            </article>
                            <button onClick={() => { toggle(); setOpen('cruzeiro') }}>ver mais ...</button>
                        </div>
                    </section>
                    <section>
                        <div className={style.contentNoticias}>
                            <div style={{ display: "flex", flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}>
                                <h1 style={{ marginTop: '5px' }}>{newsAtletico.author}</h1> <Image src={atletico} width={40} height={30} alt="Atletico" />
                            </div>
                            <article>
                                <h1>{newsAtletico.title}</h1>
                                <div>{newsAtletico.content}</div>
                            </article>
                            <button onClick={() => { toggle(); setOpen('atletico') }}>ver mais ...</button>
                        </div>
                    </section>
                </div>
            </div>
            }
                        <div className={style.cardInfo}>
                <Image src={anuncio} height={100} style={{ width: '100%' }} alt='anuncie conosco' />
            </div>
            <div className={style.cardInfo}>
                <div className={style.headerBlog}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="red" style={{ width: '40px', height: '40px', marginRight: '5px' }}>
                        <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
                    </svg>
                    Videos
                </div>
                <section className={style.video}>
                    {isLoading && <CardSkeleton ranking={false} video={true} blog={false} cards={null} enquete={false} />}
                    {!isLoading && <>
                        <YouTube className={style.iframeV} videoId={linkVideo} opts={opts} />
                    </>}
                </section>
            </div>
            {displayModal && <ModalBlog toggle={toggle} display={displayModal} newsAtletico={newsAtletico} newsCruzeiro={newsCruzeiro} open={open} setOpen={setOpen} />}
        </aside >
    )
}

export default AsideBlog