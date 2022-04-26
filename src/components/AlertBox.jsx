import React from "react";

const AlertBox = ({ alerts }) => {
  return (
    <div id="alert-box">
      {alerts.map((alert, index) => (
        <div key={index} className="alert">
          {alert}
        </div>
      ))}
    </div>
  );
};

export default AlertBox;
