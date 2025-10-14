"use client";

import { useState, useEffect } from "react";

export default function LeagueDropdown(props) {
  const [leagues, setLeagues] = useState([]);
  const [selectedClub, setSelectedClub] = useState(props.league ? props.league : '');
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch("/api/leagues");
        const data = await response.json();
        setLeagues(data.leagues);
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
            <p className="mb-0">Leagues</p>
          </div>
        </div>
        <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
          <div className="info-text px-0">
            <p className="mb-0">

              <select
                className="form-control"
                name="league"
                value={selectedClub}
                onChange={(e) => setSelectedClub(e.target.value)}
              >
                <option value="">Choose a League</option>
                {leagues.map((league) => (
                  <option key={league._id} value={league._id}>
                    {league.title}
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
