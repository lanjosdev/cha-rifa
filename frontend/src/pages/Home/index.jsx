// Funcionalidades / Libs:
import { useState, useEffect, useRef } from 'react';
import { NUMEROS_GET_ALL, NUMEROS_GET_ID, NUMEROS_UPDATE_ID, NUMEROS_GET_FILTER } from '../../API/requestAPI';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

// Contexts:
// import { UserContext } from "../../contexts/userContext";

// Components:
// import { Header } from '../../components/ui/Header';
// import { Tabela } from '../../components/ui/Tabela';
import { ModalIntro } from '../../components/Modal';
import { ModalPix } from '../../components/ModalPix';
import { PreviewCart } from '../../components/PreviewCart';
import { toast } from "react-toastify";

// Utils:
import { formatarCasasNumero } from '../../utils/formatNumbers';

// Assets:
import Logo from '../../assets/logo.png';
import PixLogo from '../../assets/pix-logo-orange.svg';
import Capa from '../../assets/capa.webp';
// import primeiro from '../../assets/1.jpg';
// import segundo from '../../assets/2.jpg';
// import terceiro from '../../assets/3.jpg';

// Estilo:
import './style.css';


export default function Home() {
    const [loading, setLoading] = useState(true);
    const [loadingSessaoExpirada, setLoadingSessaoExpirada] = useState(false);
    const [showMsgFeedback, setShowMsgFeedback] = useState('');
    const [showModalIntro, setShowModalIntro] = useState(false);
    const [showModalPix, setShowModalPix] = useState(false);
    const [showModalPremios, setShowModalPremios] = useState(false);
    const [firstAcess, setfirstAcess] = useState(true);
    const [showCart, setShowCart] = useState(false);

    const [numbers, setNumbers] = useState([]); 

    const [numbersSelecionados, setNumbersSelecionados] = useState([]);
    const [numbersCarrinho, setNumbersCarrinho] = useState([]);
    const [subtotalCarrinho, setSubtotalCarrinho] = useState(0);

    const navigate = useNavigate();
    const numerosCarrinhoCookie = Cookies.get('numerosCarrinho');
    const sessaoCookie = Cookies.get('sessao');
    const pedidoConfirmadoCookie = Cookies.get('pedidoConfirmado');

    const erroAPI = useRef(false);
    
    
    useEffect(()=> {
        async function carregaNumbersRifa() 
        {
            console.log('Effect /Home');
            //=> Verifica se pedido foi confirmado
            if(pedidoConfirmadoCookie) {
                navigate('/fim');
                return;
            }

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
                
                if(response?.erro) {
                    setNumbers([]);
                    return;
                }

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
    }, [navigate, pedidoConfirmadoCookie]);

    useEffect(()=> {
        async function verificaCarrinhoCookie() {
            console.log('Effect verifica carrinho cookie');

            if(numerosCarrinhoCookie) {
                if(sessaoCookie) {
                    let numbersId = JSON.parse(numerosCarrinhoCookie).map(num => num.id);

                    setNumbersCarrinho(JSON.parse(numerosCarrinhoCookie));
                    setNumbersSelecionados(numbersId);
                }
                else {
                    toast.info('Sua sessão expirou. Recomece seu carrinho.');
                    //=> await delNumbersCarrinho(JSON.parse(numerosCarrinhoCookie));
                    console.log('Inicia update sessao experida...');
                    setShowMsgFeedback('');
                    setLoadingSessaoExpirada(true);
                    let numerosCarrinhoDecode = JSON.parse(numerosCarrinhoCookie);

                    let deuErro = false;
                    for(let num of numerosCarrinhoDecode) {
                        try {
                            const responseVerifica = await NUMEROS_GET_ID(num.id);
                            console.log(responseVerifica);

                            if(responseVerifica.update == num.update) {
                                let idNum = num.id;
                                // carrinho false
                                let obj = {
                                    preco: 20,
                                    carrinho: false,
                                    comprado_por: null,
                                    contato: null
                                };
    
                                // let formData = new FormData();
                                // formData.append('id', idNum);
                                // formData.append('editObj', JSON.stringify(obj));
    
                                try {
                                    const responseUpdate = await NUMEROS_UPDATE_ID(idNum, obj);
                                    console.log('Sucesso: ', responseUpdate);
                                }
                                catch(erro) {
                                    console.log(`ERRO NO UPDATE ${num.id}: `, erro);
                                    deuErro = true;
                                }
                                
                            }
                        }
                        catch(erro) {
                            console.log(`ERRO NO GETID ${num.id}: `, erro);
                            deuErro = true;
                        }
                    }
                    // catch(erro) {
                    //     console.log('DEU ERRO: ', erro);
                    //     toast.error('Algum erro ao remover número do carrinho');
                    // }
                    if(deuErro) {
                        toast.error('Houve algum erro!');
                    }

                    console.log('ZERA TUDO');
                    setNumbersCarrinho([]);
                    setNumbersSelecionados([]);


                    //=> Carrega numeros
                    try {
                        const response = await NUMEROS_GET_ALL();
                        console.log(response);
                
                        setNumbers(response);
                    } 
                    catch(erro) {
                        console.log('Deu erro: ', erro);
                        toast.error('Erro ao carregar números');
                    }

                    
                    Cookies.remove('numerosCarrinho');
                    console.log('fim varredura sessao expirada');
                    setLoadingSessaoExpirada(false);
                }
            }
        }
        verificaCarrinhoCookie();
    }, [numerosCarrinhoCookie, sessaoCookie]);

    useEffect(()=> {
        function atualizaSubtotal() {
            console.log('Effect atualiza subtotal');

            let valorNum = 20;
            if(numbersCarrinho.length >= 3) {
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
            if(numbersSelecionados.length >= 20) {
                toast.info('Você chegou no limite de 20 números!');
            }
            else {
                setNumbersSelecionados(prev=> [...prev, numeroClicado.id]);
            }
        }
    }

    async function handleVerificaNumSelecionados() 
    {
        setLoading(true);


        //=> Registra inicio de sessao a partir de add algum num no carrinho
        if(!sessaoCookie) {
            console.log('INICIO DE SESSÃO');
            Cookies.set('sessao', JSON.stringify('iniciou'), {
                // expires: 1/96 //15min
                expires: 1/144 //10min
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

            if(response?.erro) {
                toast.error(response.erro);
                setLoading(false);
                return;
            }

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

            if(!erroAPI.current) {
                setShowCart(true);
            }
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
            
            // let formData = new FormData();
            // formData.append('id', idCliente);
            // formData.append('editObj', JSON.stringify(obj));

            try {
                const response = await NUMEROS_UPDATE_ID(idCliente, obj);
                if(response?.erro) {
                    console.error(response.erro);
                    erroAPI.current = true;
                    toast.error(response.erro);
                    
                    return;
                }
                erroAPI.current = false;
                numerosCarrinho.push(response);
            }
            catch(error) {
                console.error('DEU ERRO: ', error);
                erroAPI.current = true;
                toast.error('Algum erro ao adicionar um numero no carrinho');
            }
        }

        let numsIds = numerosCarrinho.map(num => num.id);
        console.log(numsIds);
        console.log(numerosCarrinho);
        setNumbersSelecionados(numsIds);
        setNumbersCarrinho(numerosCarrinho);
        let string =  await JSON.stringify(numerosCarrinho);
        Cookies.set('numerosCarrinho', string, {
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

            {showCart ? (
            <button 
            className='btn-close' 
            onClick={()=> {setShowCart(false); setShowMsgFeedback('')}}
            >
                {/* <ion-icon name="close-circle-outline"></ion-icon> */}
                <ion-icon name="close"></ion-icon>
            </button>
            ) : (
            <button className='btn-pix-primary' onClick={()=> setShowModalPix(true)}>
                <img src={PixLogo} alt="" />
                Nosso Pix
            </button>
            )}

            </div>
        </header>

        <main className='Page Home'>
            <div className="grid">

            <div className="capa">
                <img src={Capa} alt="Capa da rifa" />

                <a className='btn-add move-down' href='#iniciar'>
                    <span>Escolha seus números</span>
                    <i className="bi bi-chevron-compact-down"></i>
                </a>
            </div>

            <h2>Prêmios</h2>
            <div className="banners">
                <div className='primeiro' onClick={()=> setShowModalPremios(true)}></div>
                <div className='segundo' onClick={()=> setShowModalPremios(true)}></div>
                <div className='terceiro' onClick={()=> setShowModalPremios(true)}></div>
            </div>
            <small className='info-premios' onClick={()=> setShowModalPremios(true)}>
                <ion-icon name="information-circle-outline"></ion-icon> 
                Mais informações sobre os prêmios.
            </small>
            

            <h2 id='iniciar'>Selecione os números</h2>

            <div className='filter'>
                <div className="btns">
                    <button className='btn'>Disponíveis<small>{numbers?.filter(num => num.carrinho == false).length}</small></button>
                    <button className='btn reservado'>Reservados<small>{numbers?.filter(num => num.carrinho && num.comprado_por == null).length}</small></button>
                    <button className='btn comprado'>Comprados<small>{numbers?.filter(num => num.comprado_por).length}</small></button>
                </div>
            </div>

            <div className="painel-numbers">
                {loading && numbers.length == 0 ? (
                    
                    <p>Carregando...</p>

                ) : (

                numbers.length > 0 ? (
                    <div className={`list-numbers ${loading || loadingSessaoExpirada ? 'loading-numbers' : ''}`}>
                        {numbers.map((numero)=> (
                        <button 
                        key={numero.id} 
                        onClick={()=> handleNumerosSelecionados(numero)} 
                        className={`btn ${numbersCarrinho.map(num => num.id).includes(numero.id) ? '' : (numero.comprado_por ? 'comprado' : (numero.carrinho ? 'reservado' : ''))} ${numbersSelecionados.includes(numero.id) ? 'active' : ''}`}
                        disabled={numero.comprado_por || numbersCarrinho.map(num => num.id).includes(numero.id) || numero.carrinho || loading || loadingSessaoExpirada}
                        >
                            {formatarCasasNumero(numero.id)}
                        </button>
                        ))}                                                                                    
                    </div>
                ) : (
                    <p className='msg-erro'>Nenhum número foi carregado</p>
                )

                )}
            </div>

            </div>
        </main>

        <div className='Controle'>
            <div className="grid">
            
            <button className="btn-infos" onClick={confirmaPrimeiroAcesso}>
                {firstAcess && <span className='movendo'>Rever informções da rifa</span>}
                <ion-icon name="information-circle-outline"></ion-icon>
            </button>

            <div className="centro-controle">
                <button 
                className='btn-add' 
                onClick={handleVerificaNumSelecionados}
                disabled={numbersSelecionados.length == 0 || numbersSelecionados.length == numbersCarrinho.length || loading || loadingSessaoExpirada}
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

        {showModalPremios && (
        <div className='Modal Envio'>
            <div className="modal-background" onClick={()=> setShowModalPremios(false)}></div>

            <div className="window-envio showModal">
                <div className="top-window">
                    <h4>Informações dos prêmios</h4>

                    <button onClick={()=> setShowModalPremios(false)}>
                        <ion-icon name="close"></ion-icon>
                    </button>
                </div>

                <div className="content-window" id='Premios'>
                    <p><span>1° Lugar:</span> Ensaio Fotográfico com <a href="https://www.instagram.com/fotografia_caroline.b?igsh=MW02dXpoNHljOXQyZg==" target='_blank'>Cacau Brandão</a> (solo ou casal) <span>+</span> Vale compra de <b>R$120</b> em roupas e acessórios na <a href="https://www.instagram.com/afroperifa_?igsh=b2JwdDF5ZjFxcHp2" target='_blank'>Afroperifa</a>;</p>                   
                    <p><span>2° Lugar:</span> Vale compra de <b>R$100</b> em roupas e acessórios na <a href="https://www.instagram.com/afroperifa_?igsh=b2JwdDF5ZjFxcHp2" target='_blank'>Afroperifa</a>;</p>                   
                    <p><span>3° Lugar:</span> Vale compra de <b>R$80</b> no Ifood.</p>     

                    <p>Observação: Os vales compra poderão ser optados por dinheiro.</p>              
                </div>
            </div>
        </div>
        )}

        {showModalIntro && (
        <ModalIntro
            closeModal={()=> setShowModalIntro(false)}
            firstAcess={firstAcess}
        />        
        )}

        <ModalPix showModal={showModalPix} closeModal={()=> setShowModalPix(false)} />

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
            loadingPai={loading || loadingSessaoExpirada}
        />        
        )}
        </>
    )
}