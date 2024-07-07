// Funcionalidades / Libs:
import PropTypes from "prop-types";
import { useState } from 'react';
import { NUMEROS_GET_ID, NUMEROS_UPDATE_ID } from '../../API/requestAPI';
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
  numbersCarrinho: PropTypes.array,
  setNumbersCarrinho: PropTypes.func,
  setNumbersSelecionados: PropTypes.func,
  subtotalCarrinho: PropTypes.any
}
export function PreviewCart({ closeCart, numbersCarrinho, setNumbersCarrinho, setNumbersSelecionados, subtotalCarrinho }) {   
  const [loading, setLoading] = useState(false); 
  const [showMsgFeedback, setShowMsgFeedback] = useState('');


  function handleDelNumber(numeroDel) {
    let newListNumbers = numbersCarrinho.filter((number)=> number != numeroDel);

    console.log(newListNumbers);
    setNumbersCarrinho(newListNumbers);
    setNumbersSelecionados(newListNumbers);
  }

  async function handlePostAddCarrinho() {
    setLoading(true);
    
    //=> Verificar se os nums selecionado de fato estão disponiveis:
    let idsNumsSelecionados = numbersCarrinho;
    let idsStringConsulta = '';
    idsNumsSelecionados.forEach((id, idx) => {
        idsStringConsulta += `${id}${idx!==idsNumsSelecionados.length-1 ? ',':''}`;                       
    });
    console.log(idsStringConsulta);
    
    try {
        const response = await NUMEROS_GET_ID(idsStringConsulta);
        console.log(response);

        if(response?.length) {
          let responseCarrinhoFalse = response.filter((num)=> num.carrinho == false);
          if(responseCarrinhoFalse.length !== idsNumsSelecionados.length) {
            // let diferenca = idsNumsSelecionados.length - response.length;
            let msgFeedback = `Dos ${idsNumsSelecionados.length} números que você selecionou, apenas ${responseCarrinhoFalse.length > 1 ? `apenas os ${responseCarrinhoFalse.length} abaixo estão disponiveis` : `apenas 1 abaixo está disponível`}:`;

            setShowMsgFeedback(msgFeedback);
            let idsResponse = responseCarrinhoFalse.map((item)=> item.id);
            setNumbersCarrinho(idsResponse);
            setNumbersSelecionados(idsResponse);

            setLoading(false);
            return
          }
        }
        if(response?.erro || response.carrinho) {
          toast.error('Número indisponível');
          setShowMsgFeedback('O número que você selecionou não está mais disponível, selecione outro');
          setNumbersCarrinho([]);
          setNumbersSelecionados([]);

          setLoading(false);
          return
        }
        // else {
        //   // toast.success('Números confirmados no carrinho');
        //   setNumbersCarrinho([response.id]);
        //   setNumbersSelecionados([response.id]);
        // }


        //=> Adiciona de fato no carrinho (UPDATE)
        try {
          let numerosCarrinho = [];
          // let preco = idsNumsSelecionados > 5 ? 15 : 20;
          for(let id of idsNumsSelecionados) {
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

              const response = await NUMEROS_UPDATE_ID(formData);
              numerosCarrinho.push(response.id);
          }

          setNumbersCarrinho(numerosCarrinho);
          //add no cookie tbm

          console.log('Direcionada pra outra page...')
        }
        catch(erro) {
            console.log('DEU ERRO: ', erro);
            toast.error('Algum erro ao adicionar no carrinho, verique seu carrinho');
        }
        finally {
            setLoading(false);
            setShowMsgFeedback('');
        }
    }
    catch(erro) {
        console.log('DEU ERRO NA VERIFICAÇÃO: ', erro);
        toast.error('Algum erro na verificação');
    }

    //setLoading(false);
    setLoading(false);
    setShowMsgFeedback('');
  }


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
                    className='btn-disponivel active'
                    >
                        {formatarCasasNumero(numero)}
                    </button>

                    <ion-icon name="trash-outline" onClick={()=> handleDelNumber(numero)}></ion-icon>
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
            <h3>Resumo da Compra:</h3>

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
                <p>Subtotal</p>

                <div className="ligador"></div>
              
                <p className='subtotal'>R${subtotalCarrinho},00</p>
              </div>
            </div>
          </div>

          </>
          )}
        </div>

        <div className="btns">
          <button className='btn-add' onClick={closeCart}>
            {numbersCarrinho.length > 0 ? 'Selecionar mais números' : 'Selecionar números'}
          </button>
          <button className='btn-carrinho' disabled={numbersCarrinho.length == 0 || loading} onClick={handlePostAddCarrinho}>
            {loading ? 'Verificando...' : 'Ir para o carrinho'}
          </button>
        </div>
      </div>            
    </div>
  )
}