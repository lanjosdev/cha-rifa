// Funcionalidades / Libs:
import { useState, useEffect } from 'react';
import { NUMEROS_GET_ALL, NUMEROS_GET_ID, NUMEROS_GET_FILTER, NUMEROS_UPDATE_ID } from '../../API/requestAPI';
// import { useNavigate } from 'react-router-dom';
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

// Estilo:
import './style.css';


export default function Home() {
    const [loading, setLoading] = useState(true);
    const [showError, setShowError] = useState(false);
    
    const [numbers, setNumbers] = useState([]); 
    const [numbersSelecionados, setNumbersSelecionados] = useState([]);
    

    
    async function carregaNumbersRifa() 
    {
        try {
            // let obj = {
            //     "preco": 15,
            //     "carrinho": false,
            //     "comprado_por": null,
            //     "contato": null
            // };

            //const response = await NUMEROS_UPDATE_ID(2, obj);
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
        <header></header>

        <main className='Page Home'>
            <div className="grid">

            <h1>Cha rifa</h1>
            <span>Numeros selecionado: {numbersSelecionados.length}</span>

            <div className="painel">
                <div className="painel-content">

                    {loading ? (
                        
                    <p>Carregando...</p>

                    ) : (

                    numbers.length > 0 ? (
                    <div className="list-numbers">
                        {numbers.map((numero, idx)=> (
                        <button 
                        key={numero.id} 
                        onClick={()=> handleNumerosSelecionados({...numero, idx: idx})} 
                        className={numbersSelecionados.includes(numero.id) ? 'active' : ''}
                        >
                            {formatarCasasNumero(numero.id)}
                        </button>
                        ))}                                                                                    
                    </div>
                    ) : (
                    <p className='msg-erro'>Nenhum numero no DB</p>
                    )

                    )}

                    <button onClick={handleMostraSelecionados}>Mostrar</button>
                </div>
            </div>

            </div>
        </main>
        </>
    )
}