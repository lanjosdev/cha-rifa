// Funcionalidades / Libs:
// import { useState } from 'react';
// import PropTypes from "prop-types";
//import {QRCodeSVG} from 'qrcode.react';
// import Cookies from "js-cookie";

// Components:
import { toast } from "react-toastify";

// Assets:
import LogoPix from '../../assets/pix-logo.svg';

// Estilo:
import './style.css';


// Modal.propTypes = {
//     s: PropTypes.func.isRequired,
//     grupoEdit: PropTypes.any,
//     grupos: PropTypes.array
// }
// eslint-disable-next-line react/prop-types
export function ModalPix({ showModal, closeModal }) {   
  
    function handleCopiarChavePix() {
        console.log('copiando chave...');
        let texto = 'partoetravessia@gmail.com';
        navigator.clipboard.writeText(texto);

        toast.success('Chave Pix Copiada!');
    }


    return (
    <>
    {showModal && (
    <div className="Modal Pix">

        <div className="modal-background" onClick={closeModal}></div>

        <div className="modalPix-window showModal">
            <div className="top-window">
                <h4>Dados do nosso Pix</h4>

                <button onClick={closeModal}>
                    <ion-icon name="close"></ion-icon>
                </button>
            </div>

            <div className="content-window">
                <div className="dados-pix">
                    <h4>Destino</h4>

                    <div>
                        <p>CAROLINE OLIVEIRA SANTOS</p>
                        <p>CPF: ***.840.208-**</p>
                        <p>Banco: BCO C6 S.A.</p>
                    </div>
                </div>

                <div className="chave-pix">
                    <h4>Chave Pix</h4>

                    <div>
                        <p onClick={handleCopiarChavePix}>partoetravessia@gmail.com</p>

                        <button className='btn-pix' onClick={handleCopiarChavePix}>
                            <img src={LogoPix} alt="" />
                            Copiar chave Pix
                        </button>
                    </div>
                </div>
            </div>

            <div className="suporte-window">
                <p>
                Em caso de dúvidas ou precisar de suporte, só chamar no <a href="https://wa.me/5511949066546?text=Ola%20Lucas" target="_blank">WhatsApp<ion-icon name="logo-whatsapp"></ion-icon></a>.
                </p>
            </div>
        </div>

    </div>
    )}
    </>
    )
}