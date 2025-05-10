import React, { useState } from "react";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { CreditCard, Landmark } from "lucide-react";

function PaymentSelector({ onClose, onSelectMercadoPago, productos, totalAmount }) {
  const [paymentMethod, setPaymentMethod] = useState("mercadopago");

  // Generar mensaje para WhatsApp con detalles del pedido
  const generateWhatsAppMessage = () => {
    const productList = productos
      .map((prod) => `• ${prod.cantidad}x ${prod.nombre} - $${(prod.precio * prod.cantidad).toFixed(2)}`)
      .join("\n");
      
    const message = `Hola! Quiero realizar un pedido por los siguientes productos:\n\n${productList}\n\n*Total: $${totalAmount.toFixed(2)}*\n\nQuisiera pagar por transferencia bancaria. ¿Me podrías facilitar los datos para realizar el pago?`;
    
    return encodeURIComponent(message);
  };

  // Número de WhatsApp del dueño
  const whatsappNumber = "+5492474561468";

  const handleContinue = () => {
    if (paymentMethod === "mercadopago") {
      onSelectMercadoPago();
    } else {
      // Abrir WhatsApp con mensaje predefinido
      window.open(`https://wa.me/${whatsappNumber}?text=${generateWhatsAppMessage()}`, "_blank");
      onClose(); // Cerrar el modal después de abrir WhatsApp
    }
  };

  return (
    <DialogContent className="!bg-crema-oscuro sm:max-w-[425px] border-0">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold text-marron text-center">
          Seleccionar método de pago
        </DialogTitle>
      </DialogHeader>
      
      <RadioGroup 
        value={paymentMethod} 
        onValueChange={setPaymentMethod}
        className="gap-4 py-4"
      >
        {/* Opción Mercado Pago */}
        <div 
          onClick={() => setPaymentMethod("mercadopago")} 
          className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer transition-all ${
            paymentMethod === "mercadopago" 
              ? "border-marron bg-crema/80" 
              : "border-marron/20 bg-crema hover:border-marron/40"
          }`}
        >
          <RadioGroupItem 
            value="mercadopago" 
            id="mercadopago" 
            className="text-marron border-marron data-[state=checked]:text-crema data-[state=checked]:bg-marron" 
          />
          <Label 
            htmlFor="mercadopago" 
            className="flex flex-1 items-center gap-3 cursor-pointer"
          >
            <CreditCard className="h-5 w-5 text-marron flex-shrink-0" />
            <div>
              <p className="font-medium text-marron">Mercado Pago</p>
              <p className="text-sm text-marron/70">Paga con tarjeta o saldo de Mercado Pago</p>
            </div>
          </Label>
        </div>
        
        {/* Opción Transferencia Bancaria */}
        <div 
          onClick={() => setPaymentMethod("transferencia")} 
          className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer transition-all ${
            paymentMethod === "transferencia" 
              ? "border-marron bg-crema/80" 
              : "border-marron/20 bg-crema hover:border-marron/40"
          }`}
        >
          <RadioGroupItem 
            value="transferencia" 
            id="transferencia" 
            className="text-marron border-marron data-[state=checked]:text-crema data-[state=checked]:bg-marron" 
          />
          <Label 
            htmlFor="transferencia" 
            className="flex flex-1 items-center gap-3 cursor-pointer"
          >
            <Landmark className="h-5 w-5 text-marron flex-shrink-0" />
            <div>
              <p className="font-medium text-marron">Transferencia Bancaria</p>
              <p className="text-sm text-marron/70">Coordinar el pago a través de WhatsApp</p>
            </div>
          </Label>
        </div>
      </RadioGroup>

      <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
        <Button 
          type="button" 
          variant="outline" 
          className="border-marron text-marron hover:bg-crema-oscuro hover:text-marron/70"
          onClick={onClose}
        >
          Cancelar
        </Button>
        <Button 
          type="button" 
          className="bg-marron text-crema hover:bg-marron/80"
          onClick={handleContinue}
        >
          Continuar
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

export default PaymentSelector;