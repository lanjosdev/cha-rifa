// Funcionalidades / Libs:
import { useState, useEffect } from 'react';
// import { NUMEROS_CREATE_ALL } from '../../API/requestAPI';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

// Contexts:
// import { UserContext } from "../../contexts/userContext";

// Components:
import { toast } from "react-toastify";
import InputMask from 'react-input-mask';

// Utils:
import { formatarCasasNumero } from '../../utils/formatNumbers';

// Assets:
import Logo from '../../assets/logo.png';
import LogoPix from '../../assets/logo-pix.svg';

// Estilo:
import './style.css';


export default function Checkout() {
    const [loading, setLoading] = useState(false);
    // const [showError, setShowError] = useState(false);
    
    const [numbersCarrinho, setNumbersCarrinho] = useState([]);
    const [subtotalCarrinho, setSubtotalCarrinho] = useState([]);

    const [inputNome, setInputNome] = useState('');
    const [inputPhone, setInputPhone] = useState('');
    const [btnAvancar, setBtnAvancar] = useState(false);

    const navigate = useNavigate();
    const numerosCarrinhoCookie = Cookies.get('numerosCarrinho');
    const sessaoCookie = Cookies.get('sessao');


    useEffect(()=> {
        function verificaCarrinhoCookie() {
            console.log('Effect verifica carrinho cookie');

            if(numerosCarrinhoCookie) {
                if(sessaoCookie) {
                    if(JSON.parse(numerosCarrinhoCookie).length == 0) {
                        navigate('/');
                    }
                    setNumbersCarrinho(JSON.parse(numerosCarrinhoCookie));
                }
                else {
                    toast.info('Sua sessão expirou. Recomece seu carrinho.');
                    Cookies.remove('numerosCarrinho');
                    navigate('/');                    
                }
            }
            else {
                navigate('/');
            }
        }
        verificaCarrinhoCookie();
    }, [numerosCarrinhoCookie, sessaoCookie, navigate]);

    useEffect(()=> {
        function atualizaSubtotal() {
            console.log('Effect atualiza subtotal');

            let valorNum = 20;
            if(numbersCarrinho.length >= 5) {
                valorNum = 15;
            }
            let subtotal = valorNum * numbersCarrinho.length;
            setSubtotalCarrinho(subtotal);
        }
        atualizaSubtotal();
    }, [numbersCarrinho]);


    async function handleSubmitCreateArrayObjs(e)
    {
        e.preventDefault();
        setLoading(true);
    }


    return (
        <>
        <header className='Header'>
            <div className="grid">
            
            <Link to='/'>
                <img src={Logo} alt="Logo" />
            </Link>

            </div>
        </header>

        <main className='Page Checkout'>
            <div className="grid">

            <div className='Carrinho'>
                <h2>Carrinho</h2>

                <div className="content-carrinho">
                    
                    <div className="your-numbers">
                        <div className="top">
                            <h3>Seus números:</h3>

                            <Link to='/' className='btn-add'>
                                Adicionar mais números
                            </Link>
                        </div>

                        <div className="list-numbers">
                            {numbersCarrinho.map((numero)=> (
                            <div key={numero}>
                                <button
                                className='btn active'
                                >
                                    {formatarCasasNumero(numero)}
                                </button>
                                <ion-icon name="trash-outline" onClick={()=> console.log('deleta')}></ion-icon>
                            </div>
                            ))}
                        </div>
                    </div>

                    <div className="separator"></div>

                    <div className="resume">
                        <h3>Seu pedido:</h3>

                        <div className="total">
                            <div className="label-valor">
                            <p className='label'>Preço por número</p>

                            <div className="ligador"></div>
                            
                            {numbersCarrinho.length >= 5 ? (
                                <p className='valor'><span>R$20,00</span> <span>R$15,00</span></p>                  
                            ) : (
                                <p className='valor'>R$20,00</p>
                            )}
                            </div>

                            <div className="label-valor">
                            <p>Quantidade</p>

                            <div className="ligador"></div>
                            
                            <p className='qtd'>{numbersCarrinho.length} unid</p>
                            </div>

                            <div className="label-valor">
                            <p className='total'>Total</p>

                            <div className="ligador"></div>
                            
                            <p className='subtotal'>R${subtotalCarrinho},00</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <h2>Finalizar o Pedido</h2>
            <div className="dados-user">
                <div className="top">
                    <h3><span>1</span> Suas informações:</h3>
                </div>
                <p>Pedimos o preenchimento deste campo apenas com o propósito de identificação do seu pedido.</p>

                <div className="form">
                    <div className="label-input">
                        <label htmlFor="">Nome:</label>
                        <input type="text" value={inputNome} onChange={(e) => setInputNome(e.target.value)} required />
                    </div>
                    <div className="label-input">
                        <label htmlFor="">Celular (WhatsApp):</label>
                        <InputMask 
                        mask="(99) 99999-9999"
                        value={inputPhone}
                        onChange={(e) => setInputPhone(e.target.value)}
                        />
                    </div>

                    <button className='btn-add' disabled={!inputNome} onClick={()=> setBtnAvancar(true)}>Avançar</button>
                </div>

                <div className={`top ${btnAvancar ? '' : 'desativado'}`}>
                    <h3><span>2</span> Confirmar pagamento:</h3>
                </div>
                {btnAvancar && (
                    <div className="concluir-pedido">
                        <p>Basta clicar em um dos botões abaixo para confirmar o seu pedido. Assim você será direcionado para respectivo contato para efetuar o pagamento via Pix.</p>

                        <div className="btns-links">
                            <a href='https://wa.me/5511982809221?text=Lista%0A-%20texto%0A-%20texto'> 
                                <img src={LogoPix} alt="" />
                                Confirmar Pix com a Carol <ion-icon name="logo-whatsapp"></ion-icon>
                            </a>
                            <a href='https://wa.me/5511949066546?text=Lista%0A-%20texto%0A-%20texto'> 
                                <img src={LogoPix} alt="" />
                                Confirmar Pix com o Lucas <ion-icon name="logo-whatsapp"></ion-icon>
                            </a>
                        </div>
                    </div>
                )}
            </div>

            

            </div>
        </main>

        {/* <footer>
            <p>WebApp desenvolvido por <a href="" target='_blank'>Lucas dos Anjos</a></p>
        </footer> */}
        </>
    )
}