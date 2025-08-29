import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsShop } from "react-icons/bs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell} from "recharts";
import { useSearch } from "../context/SearchContext";
import MainHeader from "../../Components/MainHeader";
import { apiGet } from '../../lib/apiwrapper'

function Dashboard() {
  const { searchQuery } = useSearch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const [stats, setStats] = useState({
    users: 0,
    platforms: 0,
    products: 0,
    categories: 0,
  });

  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState([]);
  const [platformData, setPlatformData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    apiGet("/admin/categories/summary", token)
      .then((res) => {
        if (res.detail?.code === 1) {
          setCategoryData(res.detail.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load category summary:", err);
      });
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#2ECC71"];


  useEffect(() => {
    const token = localStorage.getItem("token");
  
    apiGet("/admin/platforms/summary", token)
      .then((res) => {
        if (res.detail?.code === 1) {
          setPlatformData(res.detail.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load platform summary:", err);
      });
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiGet("/admin/stats");
  
        if (response.detail) {
          if (response.detail.code === 1) {
            if (response.detail.data) {
              setStats(response.detail.data);
            }
          } else if (response.detail.code === 0) {
            let newErrors = {};
            newErrors.stats = response.detail.error;
            setErrors(newErrors);
          }
        } else {
          let newErrors = {};
          newErrors.stats = "Unexpected response format.";
          setErrors(newErrors);
        }
      } catch (error) {
        console.error("Failed to load stats:", error.message);
        let newErrors = {};
        newErrors.stats = "Failed to fetch stats.";
        setErrors(newErrors);
      } finally {
        setLoading(false);
      }
    };
  
    fetchStats();
  }, []);
  

    const cards = [
    {
      title: "CATEGORIES",
      value: stats.categories,
      icon: <BsFillGrid3X3GapFill className="card_icon" />,
      route: "/admin/categories",
    },
    {
      title: "PRODUCTS",
      value: stats.products,
      icon: <BsFillArchiveFill className="card_icon" />,
      route: "/admin/products",
    },
    {
      title: "USERS",
      value: stats.users,
      icon: <BsPeopleFill className="card_icon" />,
      route: "/admin/users",
    },
    {
      title: "PLATFORMS",
      value: stats.platforms,
      icon: <BsShop className="card_icon" />,
      route: "/admin/platforms",
    },
  ];

  const filteredCards = cards.filter((card) =>
    card.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <>
      <MainHeader />
      <div id="admin-content">
      <main className="admin-main-container">
        <div className="admin-title">
          <h1 className="categories-title" style={{marginBottom:"40px"}}>DASHBOARD</h1>
        </div>

        <div className="main-cards">
          {filteredCards.map((card, index) => (
            <div
              className="card"
              key={index}
              onClick={() => handleCardClick(card.route)}
              style={{ cursor: "pointer" }}
            >
              <div className="card-inner">
                <h3>{card.title}</h3>
                {card.icon}
              </div>
              <h1>{card.value}</h1>
            </div>
          ))}
        </div>

        <div className="charts">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={platformData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>

          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </main>
      </div>
    </>
  );
}

export default Dashboard;
