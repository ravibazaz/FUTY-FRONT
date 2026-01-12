'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";

export default function ClubTable(props) {
  const [clubs, setClubs] = useState(props.clubs ? props.clubs : '');

  useEffect(() => {
    if (typeof window !== "undefined" && window.$ && clubs.length > 0) {
            const $ = window.$;

      if ($.fn.DataTable.isDataTable("#example")) {
        $("#example").DataTable().destroy();
      }

      const table = $("#example").DataTable({
        language: { searchPlaceholder: "Search" },
        lengthChange: false
      });

      return () => {
        if ($.fn.DataTable.isDataTable("#example")) {
          $("#example").DataTable().destroy();
        }
      };
    }
  }, [clubs]);


  return (
    <>
      {clubs.length > 0 &&
        <div className="single-bottom-table-cont mt-30">
          <h2 className="fs-14 fw-bold mb-20">Clubs</h2>
          <form>

            <div className="table-responsive common-datatable">
              <table id="example" className="table">
                <thead>
                  <tr>
                    <th scope="col">Club Name</th>
                    <th scope="col">Secretary Name</th>
                    <th scope="col">Telephone</th>
                    <th scope="col">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    clubs.map((l, index) => (
                      <tr key={l._id}>
                        <td className="text-nowrap">
                          <Link
                            href={`/admin/clubs/${l._id}/view`}
                          >
                            {l.name}
                          </Link>
                        </td>
                        <td className="text-nowrap">
                          {l.secretary_name}
                        </td>
                        <td className="text-nowrap">
                          {l.phone}
                        </td>

                        <td className="text-nowrap">
                          <Link className="text-green"
                            href={`/admin/clubs/${l._id}/edit`}
                          >
                            Edit
                          </Link>

                        </td>
                      </tr>
                    ))}
                  
                </tbody>
              </table>
            </div>
          </form>
        </div>
      }
    </>
  );
}
