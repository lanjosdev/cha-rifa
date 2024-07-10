// Funcionalidades / Libs:
import { Routes, Route } from "react-router-dom";

// Pages:
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import Admin from "./pages/admin";
// import Termos from "./pages/Termos";
// import Brocked from "./pages/Brocked";

// Components:
// import PrivateRoute from "./utils/PrivateRoute";


export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={ <Home/> } />

            <Route path="/checkout" element={ <Checkout/> } />

            <Route path='/admin' element={ <Admin/> } />
        </Routes>
    )
}