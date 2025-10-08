'use client';
import { useState } from "react";

export default function ChangeStatus({ userdetails, id }) {
  // `userdetails` is boolean now
  const [checked, setChecked] = useState(userdetails);
  const [status, setStatus] = useState(userdetails ? 'Active' : 'Inactive');

  const changeStatus = async (isChecked) => {
    setChecked(isChecked);
    const res = await fetch(`/api/change-status?id=${id}&isActive=${isChecked}`);
    const { msg } = await res.json();

    if (msg) {
      setStatus(isChecked ? 'Active' : 'Inactive');
    }
  };

  return (
    <div className="toggle-switch-cont">
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => changeStatus(e.target.checked)}
        />
        <span className="switch round"></span>
      </label>
      <span className="switch-label-text fs-12">{status}</span>
    </div>
  );
}
