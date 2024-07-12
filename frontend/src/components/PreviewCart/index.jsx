// Funcionalidades / Libs:
import PropTypes from "prop-types";
import { useState } from 'react';
import { NUMEROS_GET_ALL, NUMEROS_UPDATE_ID } from '../../API/requestAPI';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

// Components:
import { toast } from "react-toastify";

// Utils:
import { formatarCasasNumero } from '../../utils/formatNumbers'

// Assets:
// import { FiX, FiCheckCircle } from 'react-icons/fi';

// Estilo:
import './style.css';


PreviewCart.propTypes = {
  closeCart: PropTypes.func.isRequired,
  showMsgFeedback: PropTypes.string,
  setShowMsgFeedback: PropTypes.func,
  numbersCarrinho: PropTypes.array,
  setNumbersCarrinho: PropTypes.func,
  subtotalCarrinho: PropTypes.any,
  setNumbersSelecionados: PropTypes.func,
  setNumbers: PropTypes.func
}
export function PreviewCart({ closeCart, showMsgFeedback, numbersCarrinho, setNumbersCarrinho, subtotalCarrinho, setShowMsgFeedback, setNumbers }) {
    const [loading, setLoading] = useState(false); 
    // const [showMsgFeedback, setShowMsgFeedback] = useState('');

    const navigate = useNavigate();


    async function handleDelNumberCarrinho(numeroDel) 
    {
      console.log('update carrinho false...');
      setShowMsgFeedback('');
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
        let newNumbersCarrinho = numbersCarrinho.filter((number)=> number != response?.id);

        console.log('Novo carrinho: ', newNumbersCarrinho);
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

        // setNumbersSelecionados(newNumbersCarrinho);
        setNumbersCarrinho(newNumbersCarrinho);
        Cookies.set('numerosCarrinho', JSON.stringify(newNumbersCarrinho), {
          expires: 1/2
        });
      }
      catch(erro) {
        console.log('DEU ERRO: ', erro);
        toast.error('Algum erro ao remover número do carrinho');
      }
      
      console.log('fim handleDelNumberCarrinho()');
      setLoading(false);
    }

  // async function updateAddNumCarrinho() 
  // {
  //   let erro = false;
  //   //=> Adiciona de fato no carrinho (UPDATE)
  //   let numerosAddCarrinho = [];

  //   for(let id of numbersCarrinho) {
  //       let idCliente = id;
  //       let obj = {
  //           preco: 20,
  //           carrinho: true,
  //           comprado_por: null,
  //           contato: null
  //       };
        
  //       let formData = new FormData();
  //       formData.append('id', idCliente);
  //       formData.append('editObj', JSON.stringify(obj));

  //       try {
  //         const response = await NUMEROS_UPDATE_ID(formData);
  //         numerosAddCarrinho.push(response.id);
  //       }
  //       catch(error) {
  //         console.log('DEU ERRO: ', error);
  //         toast.error('Algum erro ao prosseguir no carrinho');
  //         erro = true;
  //       }
  //   }

  //   if(erro) {
  //     setNumbersCarrinho(numerosAddCarrinho);
  //     setNumbersSelecionados(numerosAddCarrinho);
  //   }
  //   Cookies.set('numerosCarrinho', JSON.stringify(numerosAddCarrinho), {
  //     expires: 1/144
  //   });

  //   setLoading(false);
  //   return erro;
  // }
  
  // async function handleVerificaNumSelecionados() 
  // {
  //   setLoading(true);
    
  //   //=> Verificar se os nums do state carrinho de fato estão disponiveis:
  //   // let idsNumsSelecionados = numbersCarrinho;
  //   let idsStringConsulta = '';
  //   numbersCarrinho.forEach((id, idx) => {
  //       idsStringConsulta += `${id}${idx!==numbersCarrinho.length-1 ? ',':''}`;                       
  //   });
  //   console.log(idsStringConsulta);
    
  //   let erro = false;
  //   try {
  //       const response = await NUMEROS_GET_ID(idsStringConsulta);
  //       console.log(response);

  //       if(response?.length) {
  //         let numsDisponiveis = response.filter((num)=> num.carrinho == false);
  //         console.log(numsDisponiveis);

  //         if(numsDisponiveis.length !== numbersCarrinho.length) {
  //           let msgFeedback = `Dos ${numbersCarrinho.length} números que você selecionou, ${numsDisponiveis.length > 1 ? `apenas os ${numsDisponiveis.length} abaixo estão disponiveis` : `apenas 1 abaixo está disponível`} (selecione mais números ou prossiga para o carrinho).`;
  //           if(numsDisponiveis.length == 0) {
  //             msgFeedback = `Os números que você selecionou infelizmente não estão mais disponíveis. Selecione outros números.`;
  //           }
            
  //           setShowMsgFeedback(msgFeedback);

  //           console.log('atualiza numeros...');
  //           let newNumbers = numbers;
  //           let numsIndisponiveis = response.filter((num)=> num.carrinho == true);
  //           for(let number of numsIndisponiveis) {
  //             newNumbers[number.id - 1] = number;
  //           }
  //           setNumbers(newNumbers);
            
  //           let idsNumsDisponiveis = numsDisponiveis.map((item)=> item.id);
  //           setNumbersCarrinho(idsNumsDisponiveis);
  //           setNumbersSelecionados(idsNumsDisponiveis);

  //           setLoading(false);
  //           erro = true;
  //         }
  //       }
  //       if(response?.erro || response.carrinho) {
  //         toast.error('Número indisponível');
  //         setShowMsgFeedback('O número que você selecionou não está mais disponível. Selecione outro.');

  //         console.log('atualiza numeros...');
  //         let newNumbers = numbers;
  //         newNumbers[response.id - 1] = response;
  //         setNumbers(newNumbers);

  //         setNumbersCarrinho([]);
  //         setNumbersSelecionados([]);
  //         setLoading(false);
  //         erro = true;
  //       }

  //       //=> chama o update de fato:
  //       if(!erro) {
  //         erro = await updateAddNumCarrinho();
  //       }
  //       else {
  //         await updateAddNumCarrinho();
  //       }

  //       if(!erro) toast.success('TUDO OK P/ DIRECIONAR');
  //       //setShowMsgFeedback('');
  //       ////DIRECIONA PARA OUTRA PAGE
  //   }
  //   catch(erro) {
  //       console.log('DEU ERRO NA VERIFICAÇÃO: ', erro);
  //       toast.error('Algum erro na verificação');
  //   }

  //   setLoading(false);
  // }


    return (
      <div className='PreviewCart'>
        <div className="cart-background" onClick={closeCart}></div>

        <div className="cart-window fadeInRight">
          <div className="top-window">
            <h3>Previsualização do Carrinho</h3>
          </div>

          <div className="content-window">
            {showMsgFeedback && (
              <p className="msg-erro">{showMsgFeedback}</p>
            )}

            <div className="your-numbers">
              <h3>Seus números (x{numbersCarrinho.length}):</h3>
              
              {numbersCarrinho.length > 0 ? (
                <div className="list-numbers">

                    {numbersCarrinho.map((numero)=> (
                    <div key={numero}>
                      <button
                      className='btn active'
                      >
                          {formatarCasasNumero(numero)}
                      </button>

                      <ion-icon name="trash-outline" onClick={()=> handleDelNumberCarrinho(numero)}></ion-icon>
                    </div>
                    ))}

                </div>
              ) : (
                <p>Nenhum número adicionado no carrinho.</p>
              )}
            </div>

            {numbersCarrinho.length > 0 && (
            <>
            <div className="separator"></div>

            <div className="resume">
              <h3>Resumo do Pedido:</h3>

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
            </>
            )}
          </div>

          <div className="btns">
            <p className="suporte-link">
              Em caso de problemas ou precisar de suporte, só chamar no <a href="https://wa.me/5511949066546?text=Ola%20Lucas" target="_blank">WhatsApp<ion-icon name="logo-whatsapp"></ion-icon></a>.
            </p>

            <button className='btn-add' onClick={closeCart}>
              {numbersCarrinho.length > 0 ? 'Selecionar mais números' : 'Selecionar números'}
            </button>

            <button className='btn-carrinho' onClick={()=> navigate('/checkout')} disabled={numbersCarrinho.length == 0 || loading}>
              Ir para o carrinho
            </button>
          </div>


          {loading && (
            <div className="loading-window">
              <p>Atualizando...</p>
            </div>
          )}
        </div>            
      </div>
    )
}