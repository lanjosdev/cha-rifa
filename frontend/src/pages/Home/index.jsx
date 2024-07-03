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
// import { Modal } from '../../components/ui/Modal';
import { toast } from "react-toastify";

// Utils:
import { formatarCasasNumero } from '../../utils/formatNumbers'

// Assets:
// import Logo from '../../../assets/LOGO-BIZSYS_preto.png';

// Estilo:
import './style.css';


export default function Home() {
    const [loading, setLoading] = useState(true);
    const [showError, setShowError] = useState(false);
    
    const [numbers, setNumbers] = useState([]); 
    const [numbersSelecionados, setNumbersSelecionados] = useState([]);
    

    
    async function carregaNumbersRifa() 
    {
        //=> UPDATE
        // let idCliente = 2;
        // let obj = {
        //     preco: 10,
        //     carrinho: false,
        //     comprado_por: null,
        //     contato: null
        // };

        // let formData = new FormData();
        // formData.append('id', idCliente);
        // formData.append('editObj', JSON.stringify(obj));
        
        try {
            // const response = await NUMEROS_UPDATE_ID(formData);
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
    useEffect(()=> {
        carregaNumbersRifa();        
    }, []);



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

    function handleMostraSelecionados() 
    {
        console.log(numbersSelecionados);
    }


    return (
        <>
        <header className='Header'>
            <div className="grid">
            
            <a href='#iniciar'>
                {/* <img src={Logo} alt="Logo" /> */}
                <div>Cha Rifa do Caê (logo)</div>
            </a>
            {/* <Link to='/'>
                <img src={Logo} alt="Logo" />
                <div>Cha Rifa do Caê (logo)</div>
            </Link> */}

            </div>
        </header>

        <main className='Page Home'>
            <div className="grid">

            <div className="banner">
                <p>BANNER PREMIO <br /> 1º LUGAR</p>
                <p>BANNER PREMIO <br /> 2º LUGAR</p>
                <p>BANNER PREMIO <br /> 3º LUGAR</p>
            </div>

            <div id='iniciar'> <br /> <br /> <br /> </div>

            <div className='filter'>
                <div className="btns">
                    <button className='btn-disponivel'>Disponíveis</button>
                    <button className='btn-reservado'>Reservados</button>
                    <button className='btn-comprado'>Comprados</button>
                </div>
            </div>

            <div className="painel-numbers">
                {loading ? (
                    
                    <p>Carregando...</p>

                ) : (

                numbers.length > 0 ? (
                    <div className="list-numbers">
                        {numbers.map((numero, idx)=> (
                        <button 
                        key={numero.id} 
                        onClick={()=> handleNumerosSelecionados({...numero, idx: idx})} 
                        className={`btn-disponivel ${numbersSelecionados.includes(numero.id) ? 'active' : ''}`}
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
            
            <button className="btn-infos">
                i
            </button>

            <div className="centro-controle">
                <button className='btn-add' disabled={numbersSelecionados.length == 0}>
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

            <button className='btn-cart'>
                <ion-icon name="cart-outline"></ion-icon>
            </button>

            </div>
        </div>
        </>
    )
}