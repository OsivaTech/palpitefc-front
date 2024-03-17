import { NextPage } from "next";
import AdminHomeComponent from "src/components/adminHome";

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