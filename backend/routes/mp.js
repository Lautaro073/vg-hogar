const express = require('express');
const router = express.Router();
const mercadopago = require('mercadopago');
const dotenv = require('dotenv');

//.env
dotenv.config()

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
});

router.post('/', (req, res) => {
    console.log('Datos recibidos:', req.body);
    console.log('Access token configurado:', process.env.MERCADOPAGO_ACCESS_TOKEN ? 'Sí' : 'No');
    
    let preference = {
      items: [
        {
          title: req.body.title,
          quantity: req.body.quantity,
          currency_id: 'ARS',
          unit_price: req.body.price
        }
      ],
      back_urls: {
        success: 'http://localhost:3001/checkout/exito',
        failure: 'http://localhost:3001/checkout/rechazado',
        pending: 'http://localhost:3001/checkout/pendiente',
      },
      auto_return: 'approved',
    };
  
    console.log('Preferencia a crear:', JSON.stringify(preference, null, 2));
  
    mercadopago.preferences.create(preference)
      .then(response => {
        console.log('Respuesta de MercadoPago:', response.body);
        res.send(response.body.init_point);
      })
      .catch(error => {
        console.error('Error detallado:', error);
        res.status(500).json({ 
          error: 'Error al crear la preferencia',
          details: error.message 
        });
      });
});

module.exports = router;