"use client";

import { useState, useEffect } from "react";

export default function AgeCheckbox(props) {
  const [agegroups, setAgegroups] = useState([]);
  const [selectedage, setSelectedAge] = useState(props.age_groups ? props.age_groups : '');
 //console.log(selectedage);
  

  useEffect(() => {
    const fetchAgeGroups = async () => {
      try {
        const response = await fetch("/api/agegroups");
        const data = await response.json();
        setAgegroups(data.agegroups);
      } catch (error) {
        //console.error("Error fetching clubs:", error);
      }
    };
    fetchAgeGroups();
  }, []);

  return (

    <div className="left-info-box">
      <div className="left-row row">
        <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
          <div className="label-text">
            <p className="mb-0">Age Groups</p>
          </div>
        </div>
        <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
          <div className="info-text px-0">
            <div className="mb-0">

              {agegroups.map((agegroup) => (
                <div className="form-check" key={agegroup._id}>
                  <input className="form-check-input" name="age_groups"  
                  defaultChecked={selectedage.includes(agegroup._id)}
                  type="checkbox" value={agegroup._id} ></input>
                  <label className="form-check-label">
                    {agegroup.age_group}
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
