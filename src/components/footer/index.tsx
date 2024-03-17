import { BsFacebook, BsTwitter, BsYoutube, BsGithub } from "react-icons/bs"
import { AiFillInstagram } from "react-icons/ai"
import { BiCopyright } from "react-icons/bi"
import style from "./style.module.css"
import Link from "next/link"
import insta from '../../../public/assets/assets/instagramLogo.png'
import youtube from '../../../public/assets/assets/youtubeLogo.png'
import Image from "next/image"

function Footer() {

    return (
        <footer className={style.footerSite}>
            <div className={style.titlePalpiteMobile}>
                <BiCopyright size={20} />  <span className={style.logoText}>Palpite Futebol Clube</span>
            </div>
            <div className={style.contentFooter}>
                <ul className={style.ulRedes}>
                    <span className={style.spanFooter}>Nos siga nas redes</span>
                    <div>
                        <li>
                            <Link href='https://instagram.com/palpitefutebolclube?igshid=YmMyMTA2M2Y=' target="_blank" >
                                <Image alt="instagram" src={insta} height={30} />
                            </Link>
                        </li>
                        <li>
                            <Link href='https://www.youtube.com' target="_blank">
                                <Image alt="youtube" src={youtube} height={33} />
                            </Link>
                        </li>
                    </div>
                </ul>
                <div className={style.titlePalpite}>
                    <BiCopyright size={20} />  <span className={style.logoText}>Palpite Futebol Clube</span>
                </div>
                <div className={style.gitHub}>
                    <span className={style.spanFooter}> Desenvolvido por</span>
                    <div className={style.githubLink}>
                        <Link href='https://github.com/nevesDevWithoutBug' target="_blank" style={{ marginTop: '2px' }}> Contato </Link>
                        <BsGithub size={30} />
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer