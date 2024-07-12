// Funcionalidades / Libs:
import { useState, useEffect } from 'react';
import { NUMEROS_GET_ALL, NUMEROS_GET_ID, NUMEROS_UPDATE_ID, NUMEROS_GET_FILTER } from '../../API/requestAPI';
import { Link } from 'react-router-dom';
import Cookies from "js-cookie";

// Contexts:
// import { UserContext } from "../../contexts/userContext";

// Components:
// import { Header } from '../../components/ui/Header';
// import { Tabela } from '../../components/ui/Tabela';
import { ModalIntro } from '../../components/Modal';
import { PreviewCart } from '../../components/PreviewCart';
import { toast } from "react-toastify";

// Utils:
import { formatarCasasNumero } from '../../utils/formatNumbers';

// Assets:
import Logo from '../../assets/logo.png';
import Capa from '../../assets/capa.jpg';

// Estilo:
import './style.css';


export default function Home() {
    const [loading, setLoading] = useState(true);
    const [showMsgFeedback, setShowMsgFeedback] = useState('');
    const [showModalIntro, setShowModalIntro] = useState(false);
    const [firstAcess, setfirstAcess] = useState(true);
    const [showCart, setShowCart] = useState(false);

    const [numbers, setNumbers] = useState([]); 

    const [numbersSelecionados, setNumbersSelecionados] = useState([]);
    const [numbersCarrinho, setNumbersCarrinho] = useState([]);
    const [subtotalCarrinho, setSubtotalCarrinho] = useState(0);

    const numerosCarrinhoCookie = Cookies.get('numerosCarrinho');
    const sessaoCookie = Cookies.get('sessao');
    
    
    useEffect(()=> {
        async function carregaNumbersRifa() 
        {
            console.log('Effect /Home');

            //=> Valida o primeiro acesso
            const primeiroAcesso = localStorage.getItem('primeiroAcesso');
            
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

    useEffect(()=> {
        function verificaCarrinhoCookie() {
            console.log('Effect verifica carrinho cookie');

            if(numerosCarrinhoCookie) {
                if(sessaoCookie) {
                    setNumbersCarrinho(JSON.parse(numerosCarrinhoCookie));
                    setNumbersSelecionados(JSON.parse(numerosCarrinhoCookie));
                }
                else {
                    toast.info('Sua sessão expirou. Recomece seu carrinho.');
                    Cookies.remove('numerosCarrinho');
                    setNumbersCarrinho([]);
                    setNumbersSelecionados([]);
                }
            }
        }
        verificaCarrinhoCookie();
    }, [numerosCarrinhoCookie, sessaoCookie]);

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



    function confirmaPrimeiroAcesso() 
    {
        const primeiroAcesso = localStorage.getItem('primeiroAcesso');
        if(JSON.parse(primeiroAcesso)) {
            setfirstAcess(false);
            localStorage.setItem('primeiroAcesso', JSON.stringify(false));
        }

        setShowModalIntro(true);
    }

    function handleNumerosSelecionados(numeroClicado) 
    {
        //let btns = document.querySelectorAll('.list-numbers button');
        //let newLista = numbersSelecionados;

        if(numbersSelecionados.includes(numeroClicado.id)) {
            //newLista = newLista.filter(item => item != numeroClicado.id);
            //btns[numeroClicado.idx].classList.remove('active');

            setNumbersSelecionados(numbersSelecionados.filter(item => item != numeroClicado.id));
        }
        else {
            //newLista.push(numeroClicado.id);
            //btns[numeroClicado.idx].classList.add('active');
            setNumbersSelecionados(prev=> [...prev, numeroClicado.id]);
        }
    }

    async function handleVerificaNumSelecionados() 
    {
        setLoading(true);


        //=> Registra inicio de sessao a partir de add algum num no carrinho
        if(!sessaoCookie) {
            console.log('INICIO DE SESSÃO');
            Cookies.set('sessao', JSON.stringify('iniciou'), {
                expires: 1/96 //15min??
            });
        }
        

        //=> Verificar se os nums do state selecionados de fato estão disponiveis:
        // let idsNumsSelecionados = numbersSelecionados;
        let idsStringConsulta = '';
        numbersSelecionados.forEach((id, idx) => {
            idsStringConsulta += `${id}${idx !== numbersSelecionados.length-1 ? ',' : ''}`;                       
        });
        console.log(idsStringConsulta);
        
        let updateAddCarrinho = numbersSelecionados;
        try {
            const response = await NUMEROS_GET_ID(idsStringConsulta);
            console.log(response);

            if(response?.length) {
                let numsDisponiveis = response.filter((num)=> num.carrinho == false);
                if(numbersCarrinho.length > 0) {
                    numsDisponiveis = [...numsDisponiveis, ...numbersCarrinho];
                }
                console.log('disponiveis: ', numsDisponiveis);

                // trata se existe erro:
                if(numsDisponiveis.length !== numbersSelecionados.length) {
                    console.log('tem diferanças...');
                    let msgFeedback = `Dos ${numbersSelecionados.length} números que você selecionou, ${numsDisponiveis.length > 1 ? `apenas os ${numsDisponiveis.length} abaixo estão disponiveis` : `apenas 1 abaixo está disponível`} (selecione mais números ou prossiga para o carrinho).`;
                    if(numsDisponiveis.length == 0) {
                        msgFeedback = `Os números que você selecionou infelizmente não estão mais disponíveis. Selecione outros números.`;
                    }
                    setShowMsgFeedback(msgFeedback);


                    //=> Carrega numeros
                    try {
                        const response = await NUMEROS_GET_ALL();
                        console.log(response);
                
                        setNumbers(response);
                    } 
                    catch(erro) {
                        console.log('Deu erro: ', erro);
                        //setShowError('Números não encontrado!');
                        toast.error('Erro ao carregar números');
                    }
                    
                    updateAddCarrinho = numsDisponiveis.map((item)=> {
                        if(item?.id) {
                            return item.id;
                        }
                        else {
                            return item;
                        }
                    });
                    if(updateAddCarrinho.length == 0) setNumbersSelecionados(updateAddCarrinho);
                }
            } 
            else if(response?.erro || response.carrinho) {
                // toast.error('Número indisponível');
                setShowMsgFeedback('O número que você selecionou não está mais disponível. Selecione outro.');
                updateAddCarrinho = [];
                setNumbersSelecionados(updateAddCarrinho);

                
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
            }


            //=> chama o update de fato:
            if(updateAddCarrinho.length > 0) {
                await updateAddNumCarrinho(updateAddCarrinho);
            }

            setShowCart(true);
        }
        catch(erro) {
            console.log('DEU ERRO NA VERIFICAÇÃO: ', erro);
            toast.error('Algum erro na verificação');
        }

        setLoading(false);
    }

    async function updateAddNumCarrinho(arrayAddCarrinho) 
    {
        //=> Adiciona de fato no carrinho (UPDATE)
        console.log('inicia update...');
        console.log(arrayAddCarrinho);
        let numerosCarrinho = [];

        for(let id of arrayAddCarrinho) {
            let idCliente = id;
            let obj = {
                preco: 20,
                carrinho: true,
                comprado_por: null,
                contato: null
            };
            
            let formData = new FormData();
            formData.append('id', idCliente);
            formData.append('editObj', JSON.stringify(obj));

            try {
                const response = await NUMEROS_UPDATE_ID(formData);
                numerosCarrinho.push(response.id);
            }
            catch(error) {
                console.log('DEU ERRO: ', error);
                toast.error('Algum erro ao adicionar um numero no carrinho');
            }
        }

        setNumbersSelecionados(numerosCarrinho);
        setNumbersCarrinho(numerosCarrinho);
        Cookies.set('numerosCarrinho', JSON.stringify(numerosCarrinho), {
            expires: 1 //24h
        });
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
            <button 
            className='btn-close' 
            onClick={()=> {setShowCart(false); setShowMsgFeedback('')}}
            >
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
            <small className='info-premios'>
                <ion-icon name="information-circle-outline"></ion-icon> 
                Mais informações sobre os prêmios.
            </small>
            

            <h2 id='iniciar'>Selecione os números</h2>

            <div className='filter'>
                <div className="btns">
                    <button className='btn'>Disponíveis</button>
                    <button className='btn reservado'>Reservados</button>
                    <button className='btn comprado'>Comprados</button>
                </div>
            </div>

            <div className="painel-numbers">
                {loading && numbers.length == 0 ? (
                    
                    <p>Carregando...</p>

                ) : (

                numbers.length > 0 ? (
                    <div className="list-numbers">
                        {numbers.map((numero)=> (
                        <button 
                        key={numero.id} 
                        onClick={()=> handleNumerosSelecionados(numero)} 
                        className={`btn ${numbersCarrinho.includes(numero.id) ? '' : (numero.comprado_por ? 'comprado' : (numero.carrinho ? 'reservado' : ''))} ${numbersSelecionados.includes(numero.id) ? 'active' : ''}`}
                        disabled={numero.comprado_por || numbersCarrinho.includes(numero.id) || numero.carrinho || loading}
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
                onClick={handleVerificaNumSelecionados}
                disabled={numbersSelecionados.length == 0 || numbersSelecionados.length == numbersCarrinho.length || loading}
                >
                    {loading && numbersSelecionados.length !== numbersCarrinho.length ? (
                        <p>Adicionando...</p>
                    ) : (
                        <>
                        <p>Adicionar</p> ao carrinho
                        </>
                    )}
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
            closeCart={()=> {setShowCart(false); setShowMsgFeedback('')}}
            showMsgFeedback={showMsgFeedback}
            numbersCarrinho={numbersCarrinho}
            setNumbersCarrinho={setNumbersCarrinho}
            // setNumbersSelecionados={setNumbersSelecionados}
            subtotalCarrinho={subtotalCarrinho}
            setShowMsgFeedback={setShowMsgFeedback}
            // numbers={numbers}
            setNumbers={setNumbers}
        />        
        )}
        </>
    )
}