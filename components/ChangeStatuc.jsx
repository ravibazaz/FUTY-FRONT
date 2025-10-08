'use client';

export default function ChangeStatuc({ userdetails }) {

  return (
    <div className="toggle-switch-cont">
      <label className="toggle-switch">
        <input type="checkbox" defaultChecked={(userdetails.isActive ? true : false)}></input>
        <span className="switch round"></span>
      </label>
      <span className="switch-label-text fs-12">{
        (userdetails.isActive ? 'Active' : 'Inactive')
      }</span>
    </div>



  );
}
