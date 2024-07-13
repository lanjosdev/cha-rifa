// Funcionalidades / Libs:
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from "js-cookie";

// Contexts:
// import { UserContext } from "../../contexts/userContext";

// Components:

// Utils:
import { formatarCasasNumero } from '../../utils/formatNumbers';

// Assets:
import Logo from '../../assets/logo.png';
// import LogoPix from '../../assets/logo-pix.svg';

// Estilo:
import './style.css';


export default function Fim() {
    // const [loading, setLoading] = useState(false);
    // const [showError, setShowError] = useState(false);

    const [objPedido, setObjPedido] = useState({});

    const navigate = useNavigate();
    const pedidoConfirmadoCookie = Cookies.get('pedidoConfirmado');    


    useEffect(()=> {
        function verificaCookie() {
            console.log('Effect /Fim');

            if(!pedidoConfirmadoCookie) {
                navigate('/');
            }
            else {
                setObjPedido(JSON.parse(pedidoConfirmadoCookie));
            }
        }
        verificaCookie();
    }, [pedidoConfirmadoCookie, navigate]);


    function reset() {
        console.log('reset');

        Cookies.remove('pedidoConfirmado');
        navigate('/');
    }


    return (
        <>
        <header className='Header Fim'>
            <div className="grid">
            
            <Link to='/'>
                <img src={Logo} alt="Logo" />
            </Link>

            </div>
        </header>

        <main className='Page Fim'>

            <div className="content">
                <ion-icon name="checkmark-circle"></ion-icon>
                <h2>Seu pedido foi concluído com sucesso!</h2>

                <div className="resume">
                    <p>{objPedido?.comprado_por}, abaixo está o resumo do pedido que foi confirmado.</p>

                    <div className='resume-dados'>
                        <p>
                            <span>
                                {objPedido?.numeros?.length > 1 ? 'Seus números:' : 'Seu número:'}
                            </span>
                            {objPedido?.numeros?.map((num, idx)=> (
                                <span className='btn active' key={idx}>
                                    {formatarCasasNumero(num)}
                                </span>
                            ))}
                        </p>
                        <p>
                            Valor total do pedido: R${objPedido?.total},00
                        </p>
                    </div>
                </div>

                <div className="btns">
                    <button>Mostrar chave Pix</button>
                    <button>Reenviar pedido</button>
                    <button onClick={reset}>Ir para o início</button>
                </div>
            </div>    

        </main>

        <footer className='Fim'>
            <p>Aplicação web desenvolvida com 🧡 por <a href="https://lanjosdev.github.io/portfolio" target='_blank'>Lucas dos Anjos</a></p>
        </footer>
        </>
    )
}