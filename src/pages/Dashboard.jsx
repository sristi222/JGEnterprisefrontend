import "./Dashboard.css"

function Dashboard() {
  // Sample data for dashboard
  const stats = [
    { id: 1, title: "Total Products", value: 156, icon: "🛒", color: "#4CAF50" },
    { id: 2, title: "Categories", value: 12, icon: "📁", color: "#2196F3" },
    { id: 3, title: "Orders Today", value: 24, icon: "📦", color: "#FF9800" },
    { id: 4, title: "Revenue", value: "₹12,450", icon: "💰", color: "#9C27B0" },
  ]

  const recentProducts = [
    { id: 1, name: "Fresh Apples", category: "Fruits", price: "₹120/kg", status: "In Stock" },
    { id: 2, name: "Organic Spinach", category: "Vegetables", price: "₹40/bunch", status: "Low Stock" },
    { id: 3, name: "Whole Wheat Bread", category: "Bakery", price: "₹35/pack", status: "In Stock" },
    { id: 4, name: "Farm Fresh Eggs", category: "Dairy & Eggs", price: "₹75/dozen", status: "In Stock" },
    { id: 5, name: "Chicken Breast", category: "Meat", price: "₹250/500g", status: "Out of Stock" },
  ]

  return (
    <div className="dashboard">
      <div className="stats-container">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.id}>
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              <span>{stat.icon}</span>
            </div>
            <div className="stat-info">
              <h3>{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card recent-products">
          <div className="card-header">
            <h2>Recent Products</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.price}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          product.status === "In Stock"
                            ? "in-stock"
                            : product.status === "Low Stock"
                              ? "low-stock"
                              : "out-of-stock"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-card quick-actions">
          <div className="card-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="quick-actions-grid">
            <button className="quick-action-btn">
              <span className="icon">➕</span>
              <span>Add Product</span>
            </button>
            <button className="quick-action-btn">
              <span className="icon">📁</span>
              <span>New Category</span>
            </button>
            <button className="quick-action-btn">
              <span className="icon">🖼️</span>
              <span>Update Hero</span>
            </button>
            <button className="quick-action-btn">
              <span className="icon">📊</span>
              <span>View Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
