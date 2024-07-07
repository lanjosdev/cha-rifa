// Funcionalidades / Libs:
import { useState, useEffect } from 'react';
import { NUMEROS_GET_ALL, NUMEROS_GET_ID, NUMEROS_GET_FILTER, NUMEROS_UPDATE_ID } from '../../API/requestAPI';
import { Link } from 'react-router-dom';
// import Cookies from "js-cookie";

// Contexts:
// import { UserContext } from "../../contexts/userContext";

// Components:
// import { Header } from '../../components/ui/Header';
// import { Tabela } from '../../components/ui/Tabela';
import { ModalIntro } from '../../components/Modal';
import { PreviewCart } from '../../components/PreviewCart';
import { toast } from "react-toastify";

// Utils:
import { formatarCasasNumero } from '../../utils/formatNumbers'

// Assets:
import Logo from '../../assets/logo.png';
import Capa from '../../assets/capa.jpg';

// Estilo:
import './style.css';


export default function Home() {
    const [loading, setLoading] = useState(true);
    const [showMsgFeedback, setShowMsgFeedback] = useState('Carregando...');
    const [showModalIntro, setShowModalIntro] = useState(false);
    const [firstAcess, setfirstAcess] = useState(true);
    const [showCart, setShowCart] = useState(false);

    const [numbers, setNumbers] = useState([]); 
    const [numbersSelecionados, setNumbersSelecionados] = useState([]);
    const [numbersCarrinho, setNumbersCarrinho] = useState([]);

    
    
    useEffect(()=> {
        async function carregaNumbersRifa() 
        {
            console.log('Effect /Home');
            const primeiroAcesso = localStorage.getItem('primeiroAcesso');
            // const numerosCarrinho = Cookies.get('numerosCarrinho');
            
            //=> Valida o primeiro acesso
            if(primeiroAcesso) {
                setShowModalIntro(false);
                
                if(!JSON.parse(primeiroAcesso)) {
                    setfirstAcess(false);
                }
            }
            else {
                setShowModalIntro(true);
            }
            
            //=> Carrega numeros
            try {
                //const response = await NUMEROS_GET_FILTER({key: 'carrinho', value: true});
                const response = await NUMEROS_GET_ALL();
                console.log(response);
        
                setNumbers(response);
            } 
            catch(erro) {
                console.log('Deu erro: ', erro);
                //setShowError('Números não encontrado!');
                toast.error('Erro ao carregar números');
            }
            finally {
                setLoading(false);
            }        
        }
        carregaNumbersRifa();        
    }, []);



    function handleNumerosSelecionados(numeroClicado) 
    {
        //let btns = document.querySelectorAll('.list-numbers button');
        //let newLista = numbersSelecionados;

        if(numbersSelecionados.includes(numeroClicado.id)) {
            //newLista = newLista.filter(item => item != numeroClicado.id);
            //btns[numeroClicado.idx].classList.remove('active');
            if(numbersSelecionados.length == 1) {
                setNumbersCarrinho([]);                
            }

            setNumbersSelecionados(numbersSelecionados.filter(item => item != numeroClicado.id));
        }
        else {
            //newLista.push(numeroClicado.id);
            //btns[numeroClicado.idx].classList.add('active');
            setNumbersSelecionados(prev=> [...prev, numeroClicado.id]);
        }
    }

    function confirmaPrimeiroAcesso() {
        const primeiroAcesso = localStorage.getItem('primeiroAcesso');
        if(JSON.parse(primeiroAcesso)) {
            setfirstAcess(false);
            localStorage.setItem('primeiroAcesso', JSON.stringify(false));
        }

        setShowModalIntro(true);
    }

    async function handleAddCarrinho() {
        setLoading(true);
        // setShowMsgFeedback('Adicionando...');

        setNumbersCarrinho(numbersSelecionados);
        setLoading(false);
        
        //=> Verificar se os nums selecionado de fato estão disponiveis:
        // let idsNumsSelecionados = numbersSelecionados;
        // let idsStringConsulta = '';
        // idsNumsSelecionados.forEach((id, idx) => {
        //     idsStringConsulta += `${id}${idx!==idsNumsSelecionados.length-1 ? ',':''}`;                       
        // });
        // console.log(idsStringConsulta);
        
        // try {
        //     const response = await NUMEROS_GET_ID(idsStringConsulta);
        //     console.log(response);

        //     if(response.length !== idsNumsSelecionados.length) {
        //         // let diferenca = idsNumsSelecionados.length - response.length;
        //         let msgFeedback = `${idsNumsSelecionados.length > 1 ? `Dos ${idsNumsSelecionados.length} números que você selecionou, apenas os ${response.length} abaixo estão disponiveis:` : 'O número que você selecionou não está mais disponível, selecione outro'}`;

        //         setShowMsgFeedback(msgFeedback);
        //         let idsResponse = response.map((item)=> item.id);
        //         setNumbersSelecionados(idsResponse);
        //     }
        // }
        // catch(erro) {
        //     console.log('DEU ERRO NA VERIFICAÇÃO: ', erro);
        //     toast.error('Algum erro na verificação');
        // }

        // setLoading(false);



        //=> Adiciona de fato no carrinho (UPDATE)
        // try {
        //     let numerosCarrinho = [];
        //     // let preco = idsNumsSelecionados > 5 ? 15 : 20;
        //     for(let id of idsNumsSelecionados) {
        //         let idCliente = id;
        //         let obj = {
        //             preco: 20,
        //             carrinho: true,
        //             comprado_por: null,
        //             contato: null
        //         };
                
        //         let formData = new FormData();
        //         formData.append('id', idCliente);
        //         formData.append('editObj', JSON.stringify(obj));

        //         const response = await NUMEROS_UPDATE_ID(formData);
        //         numerosCarrinho.push(response);
        //     }

        //     setNumbersCarrinho(numerosCarrinho);
        // }
        // catch(erro) {
        //     console.log('DEU ERRO: ', erro);
        //     toast.error('Algum erro ao adicionar no carrinho, verique se carrinho');
        // }
        // finally {
        //     setLoading(false);
        //     setShowMsgFeedback('');
        // }
    }


    return (
        <>
        <header className='Header'>
            <div className="grid">
            
            {/* <a href='#iniciar'>
                <div>Cha Rifa do Caê (logo)</div>
            </a> */}
            <Link to='/'>
                <img src={Logo} alt="Logo" />
            </Link>

            {showCart && (
            <button className='btn-close' onClick={()=> setShowCart(false)}>
                {/* <ion-icon name="close-circle-outline"></ion-icon> */}
                <ion-icon name="close"></ion-icon>
            </button>
            )}

            </div>
        </header>

        <main className='Page Home'>
            <div className="grid">

            <div className="capa">
                <img src={Capa} alt="Capa da rifa" />

                <a className='btn-add' href='#iniciar'>Escolha seus números</a>
            </div>

            <h2>Prêmios</h2>
            <div className="banner">
                <p>BANNER PREMIO <br /> 1º LUGAR</p>
                <p>BANNER PREMIO <br /> 2º LUGAR</p>
                <p>BANNER PREMIO <br /> 3º LUGAR</p>
            </div>
            

            <h2 id='iniciar'>Selecione os números</h2>

            <div className='filter'>
                <div className="btns">
                    <button className='btn-disponivel'>Disponíveis</button>
                    <button className='btn-reservado'>Reservados</button>
                    <button className='btn-comprado'>Comprados</button>
                </div>
            </div>

            <div className="painel-numbers">
                {loading && showMsgFeedback == 'Carregando...' ? (
                    
                    <p>Carregando...</p>

                ) : (

                numbers.length > 0 ? (
                    <div className="list-numbers">
                        {numbers.map((numero, idx)=> (
                        <button 
                        key={numero.id} 
                        onClick={()=> handleNumerosSelecionados({...numero, idx: idx})} 
                        className={`${numero.comprado_por ? 'btn-comprado' : (numero.carrinho ? 'btn-reservado' : 'btn-disponivel')} ${numbersSelecionados.includes(numero.id) ? 'active' : ''}`}
                        disabled={numero.comprado_por || (numero.carrinho && !numbersSelecionados.includes(numero.id)) || loading}
                        >
                            {formatarCasasNumero(numero.id)}
                        </button>
                        ))}                                                                                    
                    </div>
                ) : (
                    <p className='msg-erro'>Nenhum numero no DB</p>
                )

                )}
            </div>

            </div>
        </main>

        <div className='Controle'>
            <div className="grid">
            
            <button className="btn-infos" onClick={confirmaPrimeiroAcesso}>
                {firstAcess && <span>Rever informções da rifa</span>}
                <ion-icon name="information-circle-outline"></ion-icon>
            </button>

            <div className="centro-controle">
                <button 
                className='btn-add' 
                onClick={handleAddCarrinho}
                disabled={numbersSelecionados.length == 0 || loading}
                >
                    <p>Adicionar</p> ao carrinho
                </button>

                <div className='nums-selecionados'>
                    {numbersSelecionados.length > 1 ? (
                    <>
                    <p>{numbersSelecionados.length} números</p> selecionados
                    </>
                    ) : (
                    <>
                    <p>{numbersSelecionados.length} número</p> selecionado
                    </>
                    )}
                </div>
            </div>

            <button className='btn-cart' onClick={()=> setShowCart(true)}>
                <ion-icon name="cart-outline"></ion-icon>
                {numbersCarrinho.length > 0 && <div className='indicador'>{numbersCarrinho.length}</div>}
            </button>

            </div>
        </div>

        {showModalIntro && (
        <ModalIntro
            closeModal={()=> setShowModalIntro(false)}
            firstAcess={firstAcess}
        />        
        )}

        {showCart && (
        <PreviewCart
            closeCart={()=> setShowCart(false)}
            numbersCarrinho={numbersCarrinho}
        />        
        )}
        </>
    )
}