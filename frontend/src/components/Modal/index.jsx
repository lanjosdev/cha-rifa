// Funcionalidades / Libs:
// import { useState } from 'react';
// import PropTypes from "prop-types";
import {QRCodeSVG} from 'qrcode.react';

// Components:
import Button from 'react-bootstrap/Button';

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
export function ModalQR({ show, onHide, dataModal }) {   
  // const [linkQR, setLinkQR] = useState(''); 

  return (
    <>
    {show &&
      <div className="Modal">

          <div className="modal-background" onClick={onHide}></div>

          <div className="modal-window">
            <h4>{dataModal[0].nome}</h4>

            {/* dataModal array é temp, sera só obj com infos do user */}
            <QRCodeSVG value={`${dataModal[0].url}id/${dataModal[1]+50}/200/300`} size={250} includeMargin={true}/>

            <Button onClick={onHide}>Fechar</Button>
          </div>
      
      </div>
    }
    </>
  )
}