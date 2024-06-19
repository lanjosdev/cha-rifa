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

// Assets:

// Estilo:
import './style.css';


export default function Home() {
    const [loading, setLoading] = useState(true);
    const [showError, setShowError] = useState(false);
    
    const [numbers, setNumbers] = useState([]); 
    
    
    async function carregaNumbersRifa() 
    {
        try {
            let obj = {
                "preco": 16,
                "carrinho": false,
                "comprado_por": null,
                "contato": null
            };

            // const response = await NUMEROS_GET_FILTER({key: 'carrinho', value: true});
            const response = await NUMEROS_UPDATE_ID(2, obj);
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



    return (
        <>
        <header></header>

        <main className='Page Home'>
            <div className="grid">

            <h1>Cha rifa</h1>

            <div className="painel">
                <div className="painel-content">
                    {loading ? (
                        
                    <p>Carregando...</p>

                    ) : (

                    <div className="list-numbers">
                        {numbers.length > 0 ? (
            
                        numbers.map((number)=> (
                            <>
                            <button key={number.id}>
                                {number.id}
                            </button>
                            <br />
                            </>
                        ))

                        ) : (
                        
                        <p className='msg-erro'>{showError}</p>
                        
                        )}
                    </div>

                    )}
                </div>
            </div>

            </div>
        </main>
        </>
    )
}