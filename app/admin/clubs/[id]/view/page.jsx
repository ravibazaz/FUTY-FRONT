import ChangeStatus from "@/components/ChangeStatus";
import ClubDropdown from "@/components/ClubDropdown";
import { connectDB } from "@/lib/db";
import Clubs from "@/lib/models/Clubs";
import Teams from "@/lib/models/Teams";
import Image from "next/image";
import Link from "next/link";
import AgeGroups from "@/lib/models/AgeGroups";
import Friendlies from "@/lib/models/Friendlies";
import mongoose from "mongoose";
import TeamTable from "@/components/TeamTable";
import { Suspense } from 'react';
import FriendliesTable from "@/components/FriendliesTable";
export default async function ViewFansPage({ params }) {
    const id = (await params).id;
    let preview = "/images/club-badge.jpg";
    await connectDB();

    const club = await Clubs.findById(id)
        .populate({
            path: "league",
            select: "title age_groups",
            populate: {
                path: "age_groups",
                model: "AgeGroups",
                select: "label age_group" // whatever fields you want
            }
        })
        .lean();

    const teams = await Teams.find({ 'club': id }).lean();
    if (club.image)
        preview = '/api' + club.image;
    //console.log(teams);


    // const friendlies_this_club = await Friendlies.aggregate([
    //     {
    //         $lookup: {
    //             from: "teams",
    //             localField: "team_id",
    //             foreignField: "_id",
    //             as: "team",
    //         },
    //     },
    //     { $unwind: "$team" },
    //     {
    //         $match: {
    //             "team.club": new mongoose.Types.ObjectId(club._id),
    //         },
    //     },
    //     { $sort: { date: -1 } },
    // ]);


    const friendlies_this_club = await Friendlies.find()
  .sort({ date: -1 })
  .populate({
    path: "team_id",
    match: { club: club._id }, // 👈 filter by club
    select: "label name image club",
    populate: {
      path: "club",
      select: "label name image league",
      populate: {
        path: "league",
        select: "label title",
      },
    },
  })
  .populate("manager_id")
  .populate("ground_id")
  .populate("league_id")
  .select("-__v")
  .lean();

// remove non-matching teams
const filteredFriendlies = friendlies_this_club.filter(
  f => f.team_id !== null
);


       //console.log(friendlies_this_club);


    return (
        <>
            <main className="main-body col-md-9 col-lg-9 col-xl-10">
                <div className="body-top d-flex flex-wrap justify-content-between align-items-center gap-20 mb-10">
                    <div className="top-left">
                        <p className="top-breadcrumb mb-0">{'> Clubs'}</p>
                    </div>
                    <div className="top-right d-flex justify-content-between align-items-center gap-10">
                        {/* <a className="btn btn-common" href="clubs-new.php">New</a> */}
                        <a href="#">
                            <img src="/images/icon-setting.svg" alt="Settings" />
                        </a>
                    </div>
                </div>
                <div className="body-title-bar d-flex flex-wrap justify-content-between align-items-center gap-20 mb-20">
                    <div className="body-title-bar-left d-flex flex-wrap align-items-center gap-20-70">
                        <h1 className="page-title">{club.name}</h1>

                    </div>
                </div>

                <div className="body-main-cont">
                    <div className="single-body-row row">
                        <div className="single-body-left col-lg-12 col-xl-7">
                            <div className="left-info-box">
                                <div className="left-row row">
                                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                        <div className="label-text">
                                            <p className="mb-0">Secretary Name</p>
                                        </div>
                                    </div>
                                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                        <div className="info-text">
                                            <p className="mb-0">
                                                <a className="text-primary text-decoration-none" href="#">{club.secretary_name}</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="left-info-box">
                                <div className="left-row row">
                                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                        <div className="label-text">
                                            <p className="mb-0">League</p>
                                        </div>
                                    </div>
                                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                        <div className="info-text">
                                            <p className="mb-0">
                                                <a className="text-primary text-decoration-none" href="#">{club.league.title}</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {club.league.age_groups.length > 0 &&
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
                                                    {club.league.age_groups.map((agegroup) => (
                                                        <div className="form-check" key={agegroup._id}>
                                                            <input className="form-check-input" name="age_groups"
                                                                defaultChecked={club.age_groups
                                                                    .map(id => id.toString())
                                                                    .includes(agegroup._id.toString())
                                                                }
                                                                type="checkbox"  ></input>
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
                            }


                            <div className="left-info-box">
                                <div className="left-row row">
                                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                        <div className="label-text">
                                            <p className="mb-0">Home Ground</p>
                                        </div>
                                    </div>
                                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                        <div className="info-text">
                                            <p className="mb-0">
                                                <a className="text-primary text-decoration-none" href="#">Waterend, List Field</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="left-info-box">
                                <div className="left-row row">
                                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                        <div className="label-text">
                                            <p className="mb-0">Number of Friendlies</p>
                                        </div>
                                    </div>
                                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                        <div className="info-text">
                                            <p className="mb-0">5</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="left-info-box">
                                <div className="left-row row">
                                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                        <div className="label-text mb-0">

                                        </div>
                                    </div>
                                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                        <div className="info-text">
                                            <p className="mb-0">
                                                <Link className="btn-common-text" href={`/admin/clubs/${club._id}/edit`} >Edit</Link>
                                                <Link className="btn-common-text mt-30 mb-30 ps-3" href="/admin/clubs" >Back</Link>

                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="single-body-right col-lg-12 col-xl-5">
                            <div className="right-info-box">
                                <h2 className="info-box-title fs-14 fw-bold mb-30">Contact Details</h2>
                                <div className="right-info mb-30">
                                    <p className="mb-0 fs-14 d-flex align-items-center gap-30">
                                        <span className="info-span">Secretary E-mail: <a className="text-decoration-none text-body underline-hover" href={'mailto:' + club.email}>{club.email}</a></span>
                                    </p>
                                </div>
                                <div className="right-info mb-30">
                                    <p className="mb-0 fs-14 d-flex align-items-center gap-30">
                                        <span className="info-span">Secretary Tel: <a className="text-decoration-none text-body underline-hover" href={'tel:' + club.phone}>{club.phone}</a></span>
                                        <span className="user-active">Verified</span>
                                    </p>
                                </div>
                                <div className="right-info mb-30">
                                    <Link href={`/admin/clubs/${club._id}/edit`}>
                                        <Image
                                            src={preview}
                                            width={82}
                                            height={82}
                                            className={'profile-img mb-10'}
                                            alt="Club Badge"
                                        />
                                    </Link>
                                    <p className="mb-0">
                                        <Link className="text-decoration-none fs-14 fw-bold text-primary underline-hover" href={`/admin/clubs/${club._id}/edit`}>Club Badge</Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>


                   
                    <TeamTable teams={JSON.parse(JSON.stringify(teams))}></TeamTable>
                   

                    
                    <FriendliesTable friendlies={JSON.parse(JSON.stringify(filteredFriendlies))}></FriendliesTable>
                    



                </div>

            </main>
        </>

    )

}
