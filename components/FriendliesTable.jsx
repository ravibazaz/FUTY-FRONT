'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { formatDate } from "@/lib/formatter";
export default function FriendliesTable(props) {
  const [friendlies, setFriendlies] = useState(props.friendlies ? props.friendlies : '');

  useEffect(() => {
    if (typeof window !== "undefined" && window.$ && friendlies.length > 0) {
      const $ = window.$;

      if ($.fn.DataTable.isDataTable("#friendlies-table")) {
        $("#friendlies-table").DataTable().destroy();
      }

      const table = $("#friendlies-table").DataTable({
        language: { searchPlaceholder: "Search" },
        lengthChange: false
      });

      return () => {
        if ($.fn.DataTable.isDataTable("#friendlies-table")) {
          $("#friendlies-table").DataTable().destroy();
        }
      };
    }
  }, [friendlies]);
  return (
    <>
      {friendlies.length > 0 &&
        <div className="single-bottom-table-cont mt-30">
          <h2 className="fs-14 fw-bold mb-20">Friendlies</h2>
          <form>

            <div className="table-responsive common-datatable">
              <table id="friendlies-table" className="table">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Team</th>
                    <th scope="col">Time</th>
                    <th scope="col">Opposition</th>
                    <th scope="col">Ground</th>
                    <th scope="col">Status</th>
                    <th scope="col">Opp Manager</th>
                    <th scope="col">Score</th>
                    <th scope="col">Outcome</th>
                    <th scope="col">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    friendlies.map((l, index) => (
                      <tr key={index}>
                        <td className="text-nowrap">{formatDate(l.date)}</td>
                        <td className="text-nowrap"><a href="#">{l.team_id?.name}</a></td>
                        <td className="text-nowrap">{l.time}</td>
                        <td className="text-nowrap"><a href="#">CPR U14s</a></td>
                        <td className="text-nowrap"><a href="#">{l.ground_id?.name}</a></td>
                        <td className="text-nowrap">Complete</td>
                        <td className="text-nowrap"><a href="#">Marc Waters</a></td>
                        <td className="text-nowrap">3-2</td>
                        <td className="text-nowrap">Win</td>
                        <td className="text-nowrap"><a className="text-green" href="#">Edit</a></td>
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
