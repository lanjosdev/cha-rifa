// Funcionalidades / Libs:
import { useRef, useState } from 'react';
import { NUMEROS_CREATE_ALL } from '../../API/requestAPI';
// import { useNavigate } from 'react-router-dom';
// import Cookies from "js-cookie";

// Contexts:
// import { UserContext } from "../../contexts/userContext";

// Components:
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


    async function handleSubmitCreateArrayObjs(e)
    {
        e.preventDefault();
        setLoading(true);

        let qtd = inputQtd.current?.value;
        let preco = inputPreco.current?.value || 15;
        console.log('Quantidade: ', parseInt(qtd));
        console.log('Preco: ', parseFloat(preco));

        if(qtd !== '' && preco !== '') {
            qtd = parseInt(qtd);
            preco = parseFloat(preco);

            if(preco <= 0) {
                toast.error('Preço inválido');
                setLoading(false);
                return;
            }

            let formData = new FormData();
            formData.append('qtd', qtd);
            formData.append('preco', preco);

            try {
                const response = await NUMEROS_CREATE_ALL(formData);
                console.log(response);  
                
                toast.success('Nova lista de números criada!');
            }
            catch(erro) {
                console.log('DEU ERRO: ', erro);
                toast.error('Erro ao criar lista!');
            }
        }
        else {
            toast.error('Preencha os campos corretamente');
        }

        console.log('Fim handleSubmitCreateArrayObjs()');
        setLoading(false);
    }


    return (
        <>
        <header></header>

        <main className='Page Home'>
            <div className="grid">

            <h1>Cha rifa (cria nova lista de numbers)</h1>

            <form onSubmit={handleSubmitCreateArrayObjs}>
                <div className="label-input">
                    <label htmlFor="qtd">Qtd de Numeros:</label>
                    <input type="number" id="qtd" ref={inputQtd} min='1' required />
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