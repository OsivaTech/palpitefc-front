import { NextPage } from "next";
import AdminHomeComponent from "src/components/adminHome";
import Api from "src/providers/http/api";

const index: NextPage = () => {

    return (
        <>
            {/* <div onClick={handleGame}> */}
                <AdminHomeComponent /> 
            {/* </div> */}
        </>
    );
}

export default index