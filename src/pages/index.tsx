import { motion } from "framer-motion";
import { NextPage } from "next";
import AsideBlog from "src/components/asideBlog";
import AsideEnquete from "src/components/asideEnquete";
import CardPalpite from "src/components/cardPalpite/index";
import Footer from "src/components/footer/index";
import Api from "src/providers/http/api";
import HeaderPrincipal from "../components/header/index"
import style from "./style.module.css"

const Home: NextPage = () => {


    return (
        <div className={style.contentHome}>
            <HeaderPrincipal />
            <motion.div animate={{ x: 0, opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 1 }} 
            className={style.contentSite}>
                <AsideEnquete />
                <CardPalpite />
                <AsideBlog />
            </motion.div>
            <Footer />
        </div>
    );
}

export default Home