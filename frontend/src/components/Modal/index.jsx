// Funcionalidades / Libs:
// import { useState } from 'react';
// import PropTypes from "prop-types";
//import {QRCodeSVG} from 'qrcode.react';
// import Cookies from "js-cookie";

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
export function ModalIntro({ closeModal, firstAcess }) {   
  
  const primeiroAcesso = localStorage.getItem('primeiroAcesso');

  function registrarPrimeiroAcesso() {
    if(!primeiroAcesso) {
      console.log('Salvando primeiro acesso...');
      localStorage.setItem('primeiroAcesso', JSON.stringify(true));
    }

    closeModal();
  }

  return (
    <div className="Modal Intro">

        <div className="modal-background"></div>

        <div className="modal-window showModal">
          <div className="top-window">
            <h4>{firstAcess ? 'Boas vindas' : 'Informações da rifa'}</h4>

            <button onClick={registrarPrimeiroAcesso}>
              {/* <ion-icon name="close-circle-outline"></ion-icon> */}
              <ion-icon name="close"></ion-icon>
            </button>
          </div>

          <div className="content-window">
            <img src={Banner} alt="Imagem das informações e instruções da rifa solidária" />

            {/* <div className="check-not-show">
              <input type="checkbox" name="" id="not-show" />
              <label htmlFor="not-show">Não mostrar mais ao iniciar.</label>
            </div> */}

            <button className='btn-add' onClick={registrarPrimeiroAcesso}>{firstAcess ? 'Iniciar Rifa' : 'Voltar para Rifa'}</button>
          </div>

          <div className="suporte-window">
            <p>
              Em caso de dúvidas ou precisar de suporte, só chamar no <a href="https://wa.me/5511949066546?text=Ola%20Lucas" target="_blank">WhatsApp<ion-icon name="logo-whatsapp"></ion-icon></a>.
            </p>

            {/* <div className="btns-suport">
              <a className='btn-suport' href="https://wa.me/5511941561387?text=Ola%20Carol">
                <ion-icon name="logo-whatsapp"></ion-icon>
                Chamar Carol
              </a>

              OU

              <a className='btn-suport' href="https://wa.me/5511949066546?text=Ola%20Lucas">
                <ion-icon name="logo-whatsapp"></ion-icon>
                Chamar Lucas
              </a>
            </div> */}
          </div>
        </div>

    </div>
  )
}