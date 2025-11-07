"use client";

import { useState, useEffect } from "react";

export default function GroundFacilitiesCheckbox(props) {
   const [selectedfacilities, setSelectedFacilities] = useState(props.facilities ? props.facilities : '');
  //console.log(selectedfacilities);

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
              <div className="form-check" >
                <input className="form-check-input" value={'Play Park'} defaultChecked={selectedfacilities.includes('Play Park')} type="checkbox" name="facilities" ></input>
                <label className="form-check-label">
                  Play Park
                </label>
              </div>
              <div className="form-check" >
                <input className="form-check-input" value={'Toilet'} defaultChecked={selectedfacilities.includes('Toilet')} type="checkbox" name="facilities" ></input>
                <label className="form-check-label">
                  Toilet
                </label>
              </div>
              <div className="form-check" >
                <input className="form-check-input" value={'Car Park'} defaultChecked={selectedfacilities.includes('Car Park')} type="checkbox" name="facilities" ></input>
                <label className="form-check-label">
                  Car Park
                </label>
              </div>
              <div className="form-check" >
                <input className="form-check-input" value={'Supermarket'} defaultChecked={selectedfacilities.includes('Supermarket')} type="checkbox" name="facilities" ></input>
                <label className="form-check-label">
                  Supermarket
                </label>
              </div>
              <div className="form-check" >
                <input className="form-check-input" value={'Town Location'} defaultChecked={selectedfacilities.includes('Town Location')} type="checkbox" name="facilities" ></input>
                <label className="form-check-label">
                  Town Location
                </label>
              </div>
              <div className="form-check" >
                <input className="form-check-input" value={'Changing Rooms'} defaultChecked={selectedfacilities.includes('Changing Rooms')} type="checkbox" name="facilities" ></input>
                <label className="form-check-label">
                  Changing Rooms
                </label>
              </div>



            </div>
          </div>
        </div>
      </div>
    </div>



  );
}
