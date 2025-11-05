"use client";

import { useState, useEffect, useRef } from "react";
import TomSelect from "tom-select";
import "tom-select/dist/css/tom-select.bootstrap5.css";
export default function ClubDropdown(props) {
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(props.club ? props.club : '');

  const selectRef = useRef(null);
  const tomSelectRef = useRef(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch("/api/clubs");
        const data = await response.json();
        setClubs(data.clubs);
      } catch (error) {
        console.error("Error fetching clubs:", error);
      }
    };
    fetchClubs();
  }, []);



  // Initialize Tom Select after clubs are loaded
    useEffect(() => {
      if (!selectRef.current || clubs.length === 0) return;
  
      // Destroy any previous instance
      if (tomSelectRef.current) {
        tomSelectRef.current.destroy();
        tomSelectRef.current = null;
      }
  
      // Initialize Tom Select
      tomSelectRef.current = new TomSelect(selectRef.current, {
        create: false,
        placeholder: "Choose a club",
        sortField: { field: "text", direction: "asc" },
        onChange: (value) => {
          setSelectedClub(value);
          if (typeof props.onClubChange === "function") {
            props.onClubChange(value);
          }
        },
      });
  
      // ✅ Preselect value in edit mode
      if (selectedClub) {
        tomSelectRef.current.setValue(selectedClub, true);
      }
  
      // Cleanup
      return () => {
        tomSelectRef.current?.destroy();
        tomSelectRef.current = null;
      };
    }, [clubs]);
  
    // ✅ Keep TomSelect synced if selectedClub changes later
    useEffect(() => {
      if (tomSelectRef.current && selectedClub) {
        tomSelectRef.current.setValue(selectedClub, true);
      }
    }, [selectedClub]);


  return (

    <div className="left-info-box">
      <div className="left-row row">
        <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
          <div className="label-text">
            <p className="mb-0">Club</p>
          </div>
        </div>
        <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
          <div className="info-text px-0">
            <p className="mb-0">

              <select
                className="form-control"
                name="club"
                ref={selectRef}
                defaultValue={selectedClub} 
              >
                <option value="">Choose a club</option>
                {clubs.map((club) => (
                  <option key={club._id} value={club._id}>
                    {club.name}
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
