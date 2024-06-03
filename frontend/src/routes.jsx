// Funcionalidades / Libs:
import { Routes, Route } from "react-router-dom";

// Pages:
import Home from "./pages/Home";
//import Grupo from './pages/Grupo';
// import Termos from "./pages/Termos";
// import Brocked from "./pages/Brocked";

// Components:
// import PrivateRoute from "./utils/PrivateRoute";


export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={ <Home/> } />

            {/* <Route path="/grupo/:idGrupo" element={ <Grupo/> } /> */}


            {/* <Route path="/termos" element={ 
                <PrivateRoute> <Termos/> </PrivateRoute>  
            }/> */}


            {/* <Route path="/edite/:idCliente" element={ <EditaCliente /> } /> */}


            {/* <Route path="/blocked" element={ <Brocked/> } /> */}


            {/* <Route element={<PrivateRoute />}>
                <Route path="/home" element={<Home/>} />
            </Route> */}
        </Routes>
    )
}