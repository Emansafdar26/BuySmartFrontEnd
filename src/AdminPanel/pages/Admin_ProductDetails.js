import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, defs, linearGradient, stop } from "recharts";
import MainHeader from "../../Components/MainHeader";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialProducts = [
    { id: 1, name: "Smart TV", image: "/images/tv.jpg", price: 499, platform: "Amazon", category: "Electronics" , description: "4K UHD Smart TV with HDR",
     priceHistory: { daily: [ { day: "Mon", price: 4800 }, { day: "Tue", price: 50000 }, { day: "Wed", price: 50000 }, { day: "Thu", price: 51000 }, { day: "Fri", price: 48000 }, ],
     weekly: [{ week: "Week 1", price: 150500 },{ week: "Week 2", price: 150000 },{ week: "Week 3", price: 151000 },{ week: "Week 4", price: 150800 },],
     monthly: [{ month: "January", price: 48500 },{ month: "February", price: 49000 },{ month: "March", price: 48500 },{ month: "April", price: 49000 },{ month: "May", price: 48500 },{ month: "June", price: 49000 },{ month: "July", price: 48500 },{ month: "August", price: 49000 },{ month: "September", price: 48500 },{ month: "October", price: 49000 },{ month: "November", price: 48500 },{ month: "December", price: 49000 },], } },
    { id: 2, name: "Refrigerator", image: "/images/fridge.jpg", price: 799, platform: "Daraz", category: "Home Appliances" , description: "Energy-efficient double-door fridge", 
     priceHistory: { daily: [ { day: "Mon", price: 100000 }, { day: "Tue", price: 100000 }, { day: "Wed", price: 990000 }, { day: "Thu", price: 990000 }, { day: "Fri", price: 950000 }, ], 
     weekly: [{ week: "Week 1", price: 150500 },{ week: "Week 2", price: 150000 },{ week: "Week 3", price: 151000 },{ week: "Week 4", price: 150800 },],
     monthly: [{ month: "January", price: 48500 },{ month: "February", price: 49000 },{ month: "March", price: 48500 },{ month: "April", price: 49000 },{ month: "May", price: 48500 },{ month: "June", price: 49000 },{ month: "July", price: 48500 },{ month: "August", price: 49000 },{ month: "September", price: 48500 },{ month: "October", price: 49000 },{ month: "November", price: 48500 },{ month: "December", price: 49000 },] } },
    { id: 3, name: "Microwave Oven", image: "microwave.jpg", price: 199, description: "Compact digital microwave oven", platform: "Temu", category: "Kitchen Appliances" , 
      priceHistory: { daily: [ { day: "Mon", price: 7800 }, { day: "Tue", price: 7900 }, { day: "Wed", price: 8000 }, { day: "Thu", price: 7950 }, { day: "Fri", price: 7990 }, ],
      weekly: [{ week: "Week 1", price: 150500 },{ week: "Week 2", price: 150000 },{ week: "Week 3", price: 151000 },{ week: "Week 4", price: 150800 },],
      monthly: [{ month: "January", price: 48500 },{ month: "February", price: 49000 },{ month: "March", price: 48500 },{ month: "April", price: 49000 },{ month: "May", price: 48500 },{ month: "June", price: 49000 },{ month: "July", price: 48500 },{ month: "August", price: 49000 },{ month: "September", price: 48500 },{ month: "October", price: 49000 },{ month: "November", price: 48500 },{ month: "December", price: 49000 },] }  },
    { id: 4, name: "Washing Machine", image: "washing-machine.jpg", price: 599, description: "Front-load automatic washing machine", platform: "Daraz",  category: "Home Appliances" , 
      priceHistory: { daily: [ { day: "Mon", price: 178000 }, { day: "Tue", price: 179000 }, { day: "Wed", price: 180000 }, { day: "Thu", price: 1795000 }, { day: "Fri", price: 179900 }, ],
      weekly: [{ week: "Week 1", price: 150500 },{ week: "Week 2", price: 150000 },{ week: "Week 3", price: 151000 },{ week: "Week 4", price: 150800 },],
      monthly: [{ month: "January", price: 48500 },{ month: "February", price: 49000 },{ month: "March", price: 48500 },{ month: "April", price: 49000 },{ month: "May", price: 48500 },{ month: "June", price: 49000 },{ month: "July", price: 48500 },{ month: "August", price: 49000 },{ month: "September", price: 48500 },{ month: "October", price: 49000 },{ month: "November", price: 48500 },{ month: "December", price: 49000 },] }  },
    { id: 5, name: "Air Conditioner", image: "ac.jpg", price: 899, description: "1.5-ton split AC with inverter technology", platform: "Amazon",  category: "Home Appliances" ,
      priceHistory: { daily: [ { day: "Mon", price: 155000 }, { day: "Tue", price: 150000 }, { day: "Wed", price: 150000 }, { day: "Thu", price: 150500 }, { day: "Fri", price: 150000 }, ],
      weekly: [{ week: "Week 1", price: 150500 },{ week: "Week 2", price: 150000 },{ week: "Week 3", price: 151000 },{ week: "Week 4", price: 150800 },],
      monthly: [{ month: "January", price: 48500 },{ month: "February", price: 49000 },{ month: "March", price: 48500 },{ month: "April", price: 49000 },{ month: "May", price: 48500 },{ month: "June", price: 49000 },{ month: "July", price: 48500 },{ month: "August", price: 49000 },{ month: "September", price: 48500 },{ month: "October", price: 49000 },{ month: "November", price: 48500 },{ month: "December", price: 49000 },] }  },
   
  ];

  const product = initialProducts.find(product => product.id === parseInt(id));
  const [selectedChart, setSelectedChart] = useState("daily");

  if (!product) {
    return <div>Product not found!</div>;
  }

  return (
    <>
    <MainHeader/>
    <div className="product-details-container">
      <div className="product-info">
        <img src={product.image} alt={product.name} className="product-detail-image" />
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <h2>Price: Rs {product.price}</h2>
        <h3>Platform: {product.platform}</h3>
        <h3>Category: {product.category}</h3>
      </div>

      <div className="chart-section">
        <div className="chart-buttons">
          {['daily', 'weekly', 'monthly'].map((chartType) => (
            <button key={chartType} className={`chart-btn ${selectedChart === chartType ? "active" : ""}`} onClick={() => setSelectedChart(chartType)}>
              {chartType.charAt(0).toUpperCase() + chartType.slice(1)}
            </button>
          ))}
        </div>
        <div className="price-chart">
          <h3>{selectedChart.charAt(0).toUpperCase() + selectedChart.slice(1)} Price History</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={product.priceHistory[selectedChart]}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff7300" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ff7300" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={selectedChart === "daily" ? "day" : selectedChart === "weekly" ? "week" : "month"} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="price" stroke="#ff7300" fill="url(#colorPrice)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductDetails;
