// Funcionalidades / Libs:
// import { useState } from 'react';
// import PropTypes from "prop-types";
//import {QRCodeSVG} from 'qrcode.react';

// Components:
//import Button from 'react-bootstrap/Button';

// Assets:
import Banner from '../../assets/banner.jpg';

// Estilo:
import './style.css';


// Modal.propTypes = {
//     s: PropTypes.func.isRequired,
//     grupoEdit: PropTypes.any,
//     grupos: PropTypes.array
// }
// eslint-disable-next-line react/prop-types
export function ModalIntro({ closeModal, isInfo }) {   
  // const [linkQR, setLinkQR] = useState(''); 

  return (
    <div className="Modal Intro">

        <div className="modal-background"></div>

        <div className="modal-window">
          <div className="top-window">
            <h4>{!isInfo ? 'Bem-vindo' : 'Informações da rifa'}</h4>
            <button onClick={closeModal}>
              {/* <ion-icon name="close-circle-outline"></ion-icon> */}
              <ion-icon name="close"></ion-icon>
            </button>
          </div>

          <div className="content-window">
            <img src={Banner} alt="" />

            <div className="check-not-show">
              <input type="checkbox" name="" id="not-show" />
              <label htmlFor="not-show">Não mostrar mais ao iniciar.</label>
            </div>

            <button className='btn-add' onClick={closeModal}>{!isInfo ? 'Iniciar Rifa' : 'Voltar para Rifa'}</button>
          </div>

          <div className="suporte-window">
            <p>Em caso de dúvidas ou precisar de suporte, só chamar a gente:</p>

            <div className="btns-suport">
              <a className='btn-suport' href="https://wa.me/5511941561387?text=Ola%20Carol">
                <ion-icon name="logo-whatsapp"></ion-icon>
                Chamar Carol
              </a>

              OU

              <a className='btn-suport' href="https://wa.me/5511949066546?text=Ola%20Lucas">
                <ion-icon name="logo-whatsapp"></ion-icon>
                Chamar Lucas
              </a>
            </div>
          </div>
        </div>

    </div>
  )
}