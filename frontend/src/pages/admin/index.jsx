// Funcionalidades / Libs:
import { useRef, useState } from 'react';
import { NUMEROS_CREATE_ALL } from '../../API/requestAPI';
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

// Assets:

// Estilo:
//import './style.css';


export default function Admin() {
    const [loading, setLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    
    const inputQtd = useRef('');
    const inputPreco = useRef('');
    
    
    // async function carregaNumbersRifa() {
    //     try {
    //         const response = await NUMBERS_GET_ALL();
    //         console.log(response.data);
      
    //         setNumbers(response.data);
    //       } 
    //       catch(erro) {
    //         console.log('Deu erro:');
    //         console.log(erro);
    //         setShowError('Números não encontrado!');
    //         toast.error('Erro ao carregar números');
    //       }
    //       finally {
    //         setLoading(false);
    //       }        
    // }
    // useEffect(()=> {
    //     carregaNumbersRifa();        
    // }, []);
    async function handleSubmitArrayObjs(e)
    {
        e.preventDefault();
        setLoading(true);

        let qtd = inputQtd.current?.value;
        let preco = inputPreco.current?.value || 14.0;

        console.log('Quantidade: ', parseInt(qtd));
        console.log('Preco: ', parseFloat(preco));

        if(qtd !== '' && preco !== '') {
            qtd = parseInt(qtd);
            preco = parseFloat(preco);

            // let newArray = [];
            // for(let idx = 1; idx <= qtd; idx++) {
            //     newArray.push({
            //         "id": idx,
            //         "preco": preco,
            //         "carrinho": false,
            //         "comprado_por": null,
            //         "contato": null
            //     });
            // }

            // if(newArray.length === qtd) {
                try {
                    const response = await NUMEROS_CREATE_ALL(qtd, preco);
                    console.log(response);  
                    
                    toast.success('Nova lista de numeros criada!');
                }
                catch(erro) {
                    console.log('DEU ERRO: ', erro);
                    toast.error('Erro ao criar lista!');
                }
            // }
        }

        console.log('Fim handleSubmitArrayObjs()');
        setLoading(false);
    }



    return (
        <>
        <header></header>

        <main className='Page Home'>
            <div className="grid">

            <h1>Cha rifa (cria numbers)</h1>

            <form onSubmit={handleSubmitArrayObjs}>
                <div className="label-input">
                    <label htmlFor="qtd">Qtd de Numeros:</label>
                    <input type="number" name="" id="qtd" ref={inputQtd} required />
                </div>
                <div className="label-input">
                    <label htmlFor="preco">Preco:</label>
                    <input type="text" id="preco" ref={inputPreco} />
                </div>

                <button>{loading ? 'Enviando...' : 'Enviar'}</button>
            </form>

            </div>
        </main>
        </>
    )
}