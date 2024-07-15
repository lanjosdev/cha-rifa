// Funcionalidades / Libs:
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from "js-cookie";

// Contexts:
// import { UserContext } from "../../contexts/userContext";

// Components:
import { ModalPix } from '../../components/ModalPix';

// Utils:
import { formatarCasasNumero } from '../../utils/formatNumbers';

// Assets:
import Logo from '../../assets/logo.png';
import PixLogo from '../../assets/pix-logo-orange.svg';
import LogoPix from '../../assets/pix-logo.svg';

// Estilo:
import './style.css';


export default function Fim() {
    // const [loading, setLoading] = useState(false);
    // const [showError, setShowError] = useState(false);

    const [objPedido, setObjPedido] = useState({});

    const [showModalPix, setShowModalPix] = useState(false);
    const [showModalEnvioPedido, setShowModalEnvioPedido] = useState(false);

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


    function reenviarPedido(contato) {
        let listaMensagem = '';
        for(let item of objPedido.numeros) {
            listaMensagem += `-%20${item}%0A`;
        }
        let mensagem = `Ol%C3%A1%20${contato}%0A%0ASegue%20os%20detalhes%20do%20meu%20pedido%20(identificado%20como:%20${objPedido.comprado_por})%0A*N%C3%BAmeros%20selecionados:*%0A${listaMensagem}%0A*Quantidade%20de%20n%C3%BAmeros:*%20${objPedido.numeros.length}%0A*Valor%20total%20do%20pedido:*%20R$${objPedido.total},00%0A%0A%0A*Chave%20pix%20para%20pagamento:*%20partoetravessia@gmail.com%0A`;
        if(contato == 'Carol') {
            // window.location.href = `https://wa.me/5511982809221?text=${mensagem}`;
            window.open(`https://wa.me/5511982809221?text=${mensagem}`, '_blank');
        }
        else {
            // window.location.href = `https://wa.me/5511949066546?text=${mensagem}`;
            window.open(`https://wa.me/5511949066546?text=${mensagem}`, '_blank');
        }

        setShowModalEnvioPedido(false);
    }
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

            <button className='btn-pix-primary' onClick={()=> setShowModalPix(true)}>
                <img src={PixLogo} alt="" />
                Nosso Pix
            </button>

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
                    <button className='btn-pix' onClick={()=> setShowModalPix(true)}>
                        <img src={LogoPix} alt="" />
                        Mostrar chave Pix
                    </button>

                    <button className='btn-whats' onClick={()=> setShowModalEnvioPedido(true)}>
                        <ion-icon name="logo-whatsapp"></ion-icon>
                        Reenviar pedido
                    </button>

                    <button className='btn-home' onClick={reset}>
                        <ion-icon name="home"></ion-icon>
                        Ir para o início
                    </button>
                </div>
            </div>    

        </main>

        <footer className='Fim'>
            <p>Aplicação web desenvolvida com 🧡 por <a href="https://lanjosdev.github.io/portfolio" target='_blank'>Lucas dos Anjos</a></p>
        </footer>

        
        <ModalPix showModal={showModalPix} closeModal={()=> setShowModalPix(false)} />

        {showModalEnvioPedido && (
        <div className='Modal Envio'>
            <div className="modal-background" onClick={()=> setShowModalEnvioPedido(false)}></div>
            <div className="window-envio showModal">
                <div className="top-window">
                    <h4>Reenviar pedido</h4>

                    <button onClick={()=> setShowModalEnvioPedido(false)}>
                        <ion-icon name="close"></ion-icon>
                    </button>
                </div>

                <div className="content-window">
                    <button onClick={()=> reenviarPedido('Carol')}> 
                        <ion-icon name="logo-whatsapp"></ion-icon>
                        Reenviar pedido p/ a Carol
                    </button>

                    <button onClick={()=> reenviarPedido('Lucas')}> 
                        <ion-icon name="logo-whatsapp"></ion-icon>
                        Reenviar pedido p/ o Lucas
                    </button>                    
                </div>
            </div>
        </div>
        )}
        </>
    )
}