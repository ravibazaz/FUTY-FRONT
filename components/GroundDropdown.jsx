"use client";

import { useState, useEffect } from "react";

export default function GroundDropdown(props) {
  const [grounds, setGrounds] = useState([]);
 const [selectedClub, setSelectedClub] = useState(props.ground ? props.ground : '');

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch("/api/grounds");
        const data = await response.json();
        setGrounds(data.grounds);
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
            <p className="mb-0">Home Ground</p>
          </div>
        </div>
        <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
          <div className="info-text px-0">
            <p className="mb-0">
              <select
                className="form-control"
                name="ground"
                 value={selectedClub}
                onChange={(e) => setSelectedClub(e.target.value)}
              >
                <option value="">Choose a Ground</option>
                {grounds.map((ground) => (
                  <option key={ground._id} value={ground._id}>
                    {ground.name}
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
