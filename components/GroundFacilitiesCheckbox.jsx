"use client";

import { useState, useEffect } from "react";

export default function AgeCheckbox(props) {
  const [facilities, setFacilities] = useState([]);
  const [selectedfacilities, setSelectedFacilities] = useState(props.facilities ? props.facilities : '');
 //console.log(selectedage);
  

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await fetch("/api/groundfacilities");
        const data = await response.json();
        setFacilities(data.groundfacilities);
      } catch (error) {
        //console.error("Error fetching clubs:", error);
      }
    };
    fetchFacilities();
  }, []);

  return (

    <div className="left-info-box">
      <div className="left-row row">
        <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
          <div className="label-text">
            <p className="mb-0">Facilities</p>
          </div>
        </div>
        <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
          <div className="info-text px-0">
            <div className="mb-0">

              {facilities.map((facility) => (
                <div className="form-check" key={facility._id}>
                  <input className="form-check-input" name="facilities"  
                  defaultChecked={selectedfacilities.includes(facility._id)}
                  type="checkbox" value={facility._id} ></input>
                  <label className="form-check-label">
                    {facility.facilities}
                  </label>
                </div>
              ))}


            </div>
          </div>
        </div>
      </div>
    </div>



  );
}
