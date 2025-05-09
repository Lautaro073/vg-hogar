import React from 'react';
import ExitoImage from '../../assets/exito.jpg';
import '../../css/checkout.css';

const PagoExitoso = () => {
    return (
      <div className="pagos">
        <div className="estado-pago-container exito" id='exitoso'>
        <img src={ExitoImage} alt="Pago Exitoso" className="banner-image" id='img-pago'/>
        <div className="content-container">
          <h2 className="titulo-exitoso">Pago Exitoso</h2>
          <p className="mensaje exito">¡Tu pago ha sido procesado con éxito! Gracias por tu compra.</p>
          <p className="mensaje exito">Nos comunicaremos contigo cuando el pedido este listo.</p>
        </div>
      </div>
      </div>
      
    );
  };
  
  export default PagoExitoso;
