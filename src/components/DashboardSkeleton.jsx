function DashboardSkeleton() {
    return (
      <div className="dashboard-page">
  
        <div className="page-heading">
          <div
            className="skeleton"
            style={{
              width: "320px",
              height: "40px",
              marginBottom: "15px",
            }}
          />
  
          <div
            className="skeleton"
            style={{
              width: "220px",
              height: "18px",
            }}
          />
        </div>
  
        <div className="dashboard-cards">
          {[1, 2, 3, 4].map((card) => (
            <div className="dashboard-card" key={card}>
              <div
                className="skeleton"
                style={{
                  width: "120px",
                  height: "20px",
                  marginBottom: "20px",
                }}
              />
  
              <div
                className="skeleton"
                style={{
                  width: "70px",
                  height: "40px",
                }}
              />
            </div>
          ))}
        </div>
  
        <div className="recent-students-card">
          <div
            className="skeleton"
            style={{
              width: "220px",
              height: "28px",
              marginBottom: "25px",
            }}
          />
  
          {[1, 2, 3, 4, 5].map((row) => (
            <div
              key={row}
              className="skeleton"
              style={{
                height: "45px",
                marginBottom: "12px",
              }}
            />
          ))}
        </div>
  
      </div>
    );
  }
  
  export default DashboardSkeleton;