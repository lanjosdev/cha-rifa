// Funcionalidades / Libs:
// import { useState } from 'react';
// import PropTypes from "prop-types";

// Components:

// Utils:
import { formatarCasasNumero } from '../../utils/formatNumbers'

// Assets:
// import { FiX, FiCheckCircle } from 'react-icons/fi';

// Estilo:
import './style.css';


// Modal.propTypes = {
//     s: PropTypes.func.isRequired,
//     grupoEdit: PropTypes.any,
//     grupos: PropTypes.array
// }
// eslint-disable-next-line react/prop-types
export function PreviewCart({ closeCart, numbersCarrinho }) {   
  // const [linkQR, setLinkQR] = useState(''); 


  return (
    <div className='PreviewCart'>
      <div className="cart-background" onClick={closeCart}></div>

      <div className="cart-window fadeInRight">
        <div className="top-window">
          <h3>Previsualização do Carrinho</h3>
        </div>

        <div className="content-window">
          <div className="your-numbers">
            <h3>Seus números (x{numbersCarrinho.length}):</h3>
            {numbersCarrinho.length > 0 ? (
              <div className="list-numbers">
                  {numbersCarrinho.map((numero, idx)=> (
                  <div key={numero}>
                    <button
                    className='btn-disponivel active'
                    >
                        {formatarCasasNumero(numero)}
                    </button>
                    <ion-icon name="trash-outline"></ion-icon>
                  </div>
                  ))}
              </div>
            ) : (
              <p>Nenhum número adicionado no carrinho.</p>
            )}
          </div>

          <div className="separator">----------</div>

          <div className="resume">
            <h3>Resumo da Compra:</h3>

            <div className="total">
              <div className="label-valor">
                <p>Preço por número</p>

                <div className="ligador">=</div>
              
                {numbersCarrinho.length >= 5 ? (
                  <p><span>R$20,00</span> <span>R$15,00</span></p>                  
                ) : (
                  <p>R$20,00</p>
                )}
              </div>

              <div className="label-valor">
                <p>Subtotal</p>

                <div className="ligador">=</div>
              
                <p>{'R$0,00'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="btns">
          <button>Selecionar mais números</button>
          <button>Ir para o carrinho</button>
        </div>
      </div>            
    </div>
  )
}