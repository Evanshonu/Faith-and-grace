import { useState } from "react";
import { useCart } from "../context/CartContext";
import { paymentAPI, orderAPI } from "../services/api";

const Checkout = () => {

  const { cart, total, clearCart } = useCart();

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  });

  const handleCheckout = async () => {
    try {

      // 1 create order
      const orderRes = await orderAPI.create({
        customer: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        items: cart,
        total
      });

      const orderId = orderRes.data._id;

      // 2 create stripe payment
      const payment = await paymentAPI.createIntent({
        amount: total,
        orderId
      });

      const clientSecret = payment.data.clientSecret;

      const stripe = await stripePromise;

      await stripe.confirmCardPayment(clientSecret);

      clearCart();

      window.location.href =
        `/order-confirmation?order=${orderId}`;

    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  return (
    <div>
      <button onClick={handleCheckout}>
        Pay ${total}
      </button>
    </div>
  );
};

export default Checkout;