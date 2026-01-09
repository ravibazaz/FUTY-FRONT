'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";

export default function TeamTable(props) {
  const [teams, setTeams] = useState(props.teams ? props.teams : '');

  useEffect(() => {
    if (typeof window !== "undefined" && window.$ && teams.length > 0) {

            const $ = window.$;

      if ($.fn.DataTable.isDataTable("#example")) {
        $("#example").DataTable().destroy();
      }

      const table = $("#example").DataTable({
        language: { searchPlaceholder: "Search" }
      });

      return () => {
        if ($.fn.DataTable.isDataTable("#example")) {
          $("#example").DataTable().destroy();
        }
      };


    }
  }, [teams]);


  return (
    <>
      {teams.length > 0 &&
        <div className="single-bottom-table-cont mt-30">
          <h2 className="fs-14 fw-bold mb-20">Teams</h2>
          <form>

            <div className="table-responsive common-datatable">
              <table id="example" className="table">
                <thead>
                  <tr>
                    <th scope="col">Team</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Email</th>
                    <th scope="col">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    teams.map((l, index) => (
                      <tr key={l._id}>
                        <td className="text-nowrap">
                          <Link
                            href={`/admin/teams/${l._id}/view`}
                          >
                            {l.name}
                          </Link>
                        </td>
                        <td className="text-nowrap">
                          {l.phone}
                        </td>
                        <td className="text-nowrap">
                          {l.email}
                        </td>

                        <td className="text-nowrap">
                          <Link className="text-green"
                            href={`/admin/teams/${l._id}/edit`}
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
