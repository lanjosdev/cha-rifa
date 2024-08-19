// Funcionalidades / Libs:
import { useState, useEffect } from 'react';
import { NUMEROS_UPDATE_ID } from '../../API/requestAPI';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

// Contexts:
// import { UserContext } from "../../contexts/userContext";

// Components:
import { toast } from "react-toastify";
import InputMask from 'react-input-mask';
import { ModalPix } from '../../components/ModalPix';

// Utils:
import { formatarCasasNumero } from '../../utils/formatNumbers';

// Assets:
import Logo from '../../assets/logo.png';
import PixLogo from '../../assets/pix-logo-orange.svg';
// import LogoPix from '../../assets/logo-pix.svg';

// Estilo:
import './style.css';


export default function Checkout() {
    const [loading, setLoading] = useState(false);
    // const [showError, setShowError] = useState(false);
    const [showModalPix, setShowModalPix] = useState(false);
    
    const [numbersCarrinho, setNumbersCarrinho] = useState([]);
    const [subtotalCarrinho, setSubtotalCarrinho] = useState([]);

    const [inputNome, setInputNome] = useState('');
    const [inputPhone, setInputPhone] = useState('');
    const [btnAvancar, setBtnAvancar] = useState(false);

    const navigate = useNavigate();
    const numerosCarrinhoCookie = Cookies.get('numerosCarrinho');
    const sessaoCookie = Cookies.get('sessao');
    const pedidoConfirmadoCookie = Cookies.get('pedidoConfirmado');


    useEffect(()=> {
        function verificaCookies() {
            console.log('Effect /Checkout verifica cookies');

            if(pedidoConfirmadoCookie) {
                navigate('/fim');
                return;
            }

            if(numerosCarrinhoCookie) {
                if(sessaoCookie) {
                    if(JSON.parse(numerosCarrinhoCookie).length == 0) {
                        navigate('/');
                    }
                    setNumbersCarrinho(JSON.parse(numerosCarrinhoCookie));
                }
                else {
                    // toast.info('Sua sessão expirou. Recomece seu carrinho.');
                    // Cookies.remove('numerosCarrinho');
                    navigate('/');                    
                }
            }
            else {
                navigate('/');
            }
        }
        verificaCookies();
    }, [numerosCarrinhoCookie, sessaoCookie, pedidoConfirmadoCookie, navigate]);

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


    async function handleDelNumberCarrinho(numeroDel) 
    {
        const sessionCookie = Cookies.get('sessao');
        if(!sessionCookie) {
            navigate('/');
            return;
        }
        
        console.log('update carrinho false...');
        setLoading(true);

        try {
        let idCliente = numeroDel;
        // carrinho false
        let obj = {
            preco: 20,
            carrinho: false,
            comprado_por: null,
            contato: null
        };
        
        let formData = new FormData();
        formData.append('id', idCliente);
        formData.append('editObj', JSON.stringify(obj));

        const response = await NUMEROS_UPDATE_ID(formData);
        let newNumbersCarrinho = numbersCarrinho.filter((number)=> number.id != response?.id);
        console.log('Novo carrinho: ', newNumbersCarrinho);      

        setNumbersCarrinho(newNumbersCarrinho);
        Cookies.set('numerosCarrinho', JSON.stringify(newNumbersCarrinho), {
            expires: 1
        });

        if(newNumbersCarrinho.length == 0) {
            navigate('/');
        }
        }
        catch(erro) {
        console.log('DEU ERRO: ', erro);
        toast.error('Algum erro ao remover número do carrinho');
        }
        
        console.log('fim handleDelNumberCarrinho()');
        setLoading(false);
    }

    async function handleSubmitConfirmarCompra(contato)
    {
        const sessionCookie = Cookies.get('sessao');
        if(!sessionCookie) {
            navigate('/');
            return;
        }
        else {
            setLoading(true);

            console.log('Nome: ', inputNome);
            console.log('Telefone: ', inputPhone);
            console.log('Seus numeros: ', numbersCarrinho);
            console.log('Total: ', subtotalCarrinho);

            let btn;
            if(contato == 'Carol') {
                btn = document.querySelector('.lucas');
                btn.classList.add('hidden');
            } 
            else {
                const btn = document.querySelector('.carol');
                btn.classList.add('hidden');
            }

            try {
                await updateNumComprado(numbersCarrinho);


                let listaMensagem = '';
                for(let item of numbersCarrinho) {
                    listaMensagem += `-%20${item.id}%0A`;
                }
                let mensagem = `Ol%C3%A1%20${contato}%0A%0ASegue%20os%20detalhes%20do%20meu%20pedido%20(identificado%20como:%20${inputNome})%0A*N%C3%BAmeros%20selecionados:*%0A${listaMensagem}%0A*Quantidade%20de%20n%C3%BAmeros:*%20${numbersCarrinho.length}%0A*Valor%20total%20do%20pedido:*%20R$${subtotalCarrinho},00%0A%0A%0A*Chave%20pix%20para%20pagamento:*%20partoetravessia@gmail.com%0A`; ////
                if(contato == 'Carol') {
                    // window.location.href = `https://wa.me/5511982809221?text=${mensagem}`;
                    window.open(`https://wa.me/5511982809221?text=${mensagem}`, '_blank');
                }
                else {
                    // window.location.href = `https://wa.me/5511949066546?text=${mensagem}`;
                    window.open(`https://wa.me/5511949066546?text=${mensagem}`, '_blank');
                }


                let objCookie = {
                    comprado_por: inputNome,
                    numeros: numbersCarrinho,
                    total: subtotalCarrinho
                };
                Cookies.set('pedidoConfirmado', JSON.stringify(objCookie), {
                    expires: 2 //48h
                });

                Cookies.remove('sessao');
                Cookies.remove('numerosCarrinho');
                setNumbersCarrinho([]);
            }
            catch(erro) {
                console.log('DEU ERRO: ', erro);
                toast.error('Algum erro ao confirmar o pedido!');
            }

            console.log('Fim handleSubmitConfirmarCompra()');
            btn.classList.remove('hidden');
            setLoading(false);
        }
    }

    async function updateNumComprado(arrayNumCarrinho) 
    {
        //=> Atualiza como comprado (UPDATE)
        console.log('inicia update comprado...');
        console.log(arrayNumCarrinho);

        try {
            for(let num of arrayNumCarrinho) {
                let idNum = num.id;
                let obj = {
                    preco: 20,
                    carrinho: true,
                    comprado_por: inputNome,
                    contato: inputPhone || null
                };
                
                let formData = new FormData();
                formData.append('id', idNum);
                formData.append('editObj', JSON.stringify(obj));
    
                const response = await NUMEROS_UPDATE_ID(formData);
                console.log(response);
            }
        }
        catch(erro) {
            console.log('DEU ERRO: ', erro);
            toast.error('Erro ao confirmar algum número!');
        }
    }


    return (
        <>
        <header className='Header'>
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
                            <div key={numero.id}>
                                <button
                                className='btn active'
                                >
                                    {formatarCasasNumero(numero.id)}
                                </button>
                                <ion-icon name="trash-outline" onClick={()=> handleDelNumberCarrinho(numero.id)}></ion-icon>
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

                    {loading && (
                        <div className="loading-window">
                        <p>Atualizando...</p>
                        </div>
                    )}
                </div>
            </div>

            <h2>Concluir pedido</h2>
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

                    <button className='btn-add' disabled={inputNome.length < 2} onClick={()=> setBtnAvancar(true)}>Avançar</button>
                </div>

                <div className={`top ${btnAvancar ? '' : 'desativado'}`}>
                    <h3><span>2</span> Confirmar pedido:</h3>
                </div>
                {btnAvancar && 
                <div className="concluir-pedido">
                    <p>Basta clicar em um dos botões abaixo para confirmar o seu pedido. Assim que clicar, será gerado os detalhes do seu pedido e direcionado para o respectivo contato para seguir com pagamento.</p>

                    <div className="btns-links">
                        <button className='carol' onClick={()=> handleSubmitConfirmarCompra('Carol')} disabled={loading}> 
                            {/* <img src={LogoPix} alt="" /> */}
                            <ion-icon name="logo-whatsapp"></ion-icon>
                            {loading ? 'Direcionando p/ a Carol...' : 'Confirmar Pedido com a Carol'}
                        </button>

                        <button className='lucas' onClick={()=> handleSubmitConfirmarCompra('Lucas')} disabled={loading}> 
                            {/* <img src={LogoPix} alt="" /> */}
                            <ion-icon name="logo-whatsapp"></ion-icon>
                            {loading ? 'Direcionando p/ o Lucas...' : 'Confirmar Pedido com o Lucas'}
                        </button>
                    </div>
                </div>
                }
            </div>

            <p className="suporte-link">
                Em caso de problemas ou precisar de suporte, só chamar no <a href="https://wa.me/5511949066546?text=Ola%20Lucas" target="_blank">WhatsApp<ion-icon name="logo-whatsapp"></ion-icon></a>.
            </p>

            </div>
        </main>

        <footer>
            <p>Aplicação web desenvolvida com 🧡 por <a href="https://lanjosdev.github.io/portfolio/" target='_blank'>Lucas dos Anjos</a></p>
        </footer>

        <ModalPix showModal={showModalPix} closeModal={()=> setShowModalPix(false)} />
        </>
    )
}