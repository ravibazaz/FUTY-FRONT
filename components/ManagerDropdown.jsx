"use client";

import { useState, useEffect } from "react";

export default function ManagerDropdown(props) {
  const [managers, setManagers] = useState([]);

  
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch("/api/managers");
        const data = await response.json();
        setManagers(data.managers);
      } catch (error) {
        console.error("Error fetching clubs:", error);
      }
    };
    fetchClubs();
  }, []);

  return (

    <div className="left-info-box">
      <div className="left-row row">
        <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
          <div className="label-text">
            <p className="mb-0">Manager</p>
          </div>
        </div>
        <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
          <div className="info-text px-0">
            <p className="mb-0">

              <select
                className="form-control"
                name="manager"
              >
                <option value="">Choose a Mansger</option>
                {managers.map((manager) => (
                  <option key={manager._id} value={manager._id}>
                    {manager.name}
                  </option>
                ))}
              </select>
               {props.clienterror && <span className="invalid-feedback" style={{ display: "block" }} >{props.clienterror}</span>}
            </p>
          </div>
         
        </div>
      </div>
    </div>



  );
}
