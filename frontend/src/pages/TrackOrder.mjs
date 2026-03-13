import { useState } from "react";
import { orderAPI } from "../services/api";

const TrackOrder = () => {

  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {

    if (!email) return;

    try {

      setLoading(true);

      const res = await orderAPI.getByEmail(email);

      setOrders(res.data);

    } catch (err) {

      console.error(err);
      alert("No orders found");

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="max-w-3xl mx-auto py-16 px-4">

      <h1 className="text-3xl font-bold mb-6">
        Track Your Order
      </h1>

      <div className="flex gap-3 mb-8">

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-3"
        />

        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-red-600 text-white rounded-lg"
        >
          Track
        </button>

      </div>

      {loading && <p>Loading orders...</p>}

      {orders.map(order => (

        <div
          key={order._id}
          className="border rounded-lg p-6 mb-4"
        >

          <h2 className="font-bold mb-2">
            Order #{order._id.slice(-6)}
          </h2>

          <p>Status: <b>{order.status}</b></p>

          <ul className="mt-2">

            {order.items.map((item,i)=>(
              <li key={i}>
                {item.name} × {item.quantity}
              </li>
            ))}

          </ul>

        </div>

      ))}

    </div>
  );
};

export default TrackOrder;