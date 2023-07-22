import React from "react";
import { Link } from "react-router-dom";

function Landingscreen() {
  return (
    <>
    <div className="row landing justify-content-center">
      <div
        className="col-md-9 my-auto text-center"
        style={{ borderRight: "8px solid white" }}
      >
        <h2 style={{ color: "white", fontSize: "130px" }}>Room Khojo</h2>
        {/* <h1 style={{ color: "white" }}>"There is only one boss. The guest."</h1> */}
        <h1 style={{ color: "white" }}><i>"Tharo Aaram, Mahari Jimmewari."</i></h1>
        <Link to="/home">
          <button className="btn landing-btn border-white">Get Started</button>
        </Link>
      </div>
    </div>
    </>
  );
}

export default Landingscreen;
