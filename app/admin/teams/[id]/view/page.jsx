import ChangeStatus from "@/components/ChangeStatus";
import { connectDB } from "@/lib/db";
import Teams from "@/lib/models/Teams";
import Clubs from "@/lib/models/Clubs";
import Leagues from "@/lib/models/Leagues";
import Grounds from "@/lib/models/Grounds";
import AgeGroups from "@/lib/models/AgeGroups";
import Users from "@/lib/models/Users";
import Image from "next/image";
import Link from "next/link";

export default async function ViewFansPage({ params }) {
    const id = (await params).id;
    let preview = "/images/club-badge.jpg";
    await connectDB();
    const team = await Teams.findById(id).populate("age_groups", "age_group").populate({
        path: "club",
        select: "name league",
        populate: {
            path: "league",
            model: "Leagues",
            select: "label title", // whatever fields you want
        }
    }).populate("ground", "name")
        .populate({
            path: "managers",
            select: "name",
        })
        .lean();
    if (team.image)
        preview = '/api' + team.image;

    //console.log(team);

    return (
        <>
            <main className="main-body col-md-9 col-lg-9 col-xl-10">
                <div className="body-top d-flex flex-wrap justify-content-between align-items-center gap-20 mb-10">
                    <div className="top-left">
                        <p className="top-breadcrumb mb-0">{'> Teams'}</p>
                    </div>
                    <div className="top-right d-flex justify-content-between align-items-center gap-10">
                        {/* <a className="btn btn-common" href="teams-new.php">New</a> */}
                        <a href="#">
                            <Image
                                src="/images/icon-setting.svg"
                                width={33}
                                height={33}
                                alt="Settings"
                            />

                        </a>
                    </div>
                </div>
                <div className="body-title-bar d-flex flex-wrap justify-content-between align-items-center gap-20 mb-20">
                    <div className="body-title-bar-left d-flex flex-wrap align-items-center gap-20-70">
                        <h1 className="page-title">{team.name}</h1>

                    </div>
                </div>

                <div className="body-main-cont">
                    <div className="single-body-row row">
                        <div className="single-body-left col-lg-12 col-xl-7">

                            <div className="left-info-box">
                                <div className="left-row row">
                                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                        <div className="label-text">
                                            <p className="mb-0">Managers</p>
                                        </div>
                                    </div>
                                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                        <div className="info-text">
                                            {team.managers.map((manager) => (
                                                <p className="mb-0" key={manager._id}>
                                                    <a className="text-primary text-decoration-none" href="leagues-single.php">{manager.name}</a>
                                                </p>
                                            ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="left-info-box">
                                <div className="left-row row">
                                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                        <div className="label-text">
                                            <p className="mb-0">Club</p>
                                        </div>
                                    </div>
                                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                        <div className="info-text">
                                            <p className="mb-0">
                                                <a className="text-primary text-decoration-none" href="clubs-single.php">{team.club?.name}</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="left-info-box">
                                <div className="left-row row">
                                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                        <div className="label-text">
                                            <p className="mb-0">Age group</p>
                                        </div>
                                    </div>
                                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                        <div className="info-text">
                                            <p className="mb-0">
                                                <a className="text-primary text-decoration-none" href="leagues-single.php">{team.age_groups?.age_group}</a>
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
                                                <a className="text-primary text-decoration-none" href="leagues-single.php">{team.club?.league?.title}</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

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
                                                <a className="text-primary text-decoration-none" href="grounds-single.php">{team.ground?.name}</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="left-info-box-group">
                                <div className="left-info-box">
                                    <div className="left-row row">
                                        <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                            <div className="label-text mb-0 pb-0">
                                                <p className="fw-bold mb-0">Home Kit</p>
                                            </div>
                                        </div>
                                        <div className="left-info-col col-md-7 col-lg-8 col-xl-8">

                                        </div>
                                    </div>
                                </div>
                                <div className="left-info-box">
                                    <div className="left-row row">
                                        <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                            <div className="label-text mb-0 pt-0 pb-0">
                                                <p className="mb-0">Shirt:</p>
                                            </div>
                                        </div>
                                        <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                            <div className="info-text pt-0 pb-0">
                                                <p className="mb-0">{team.shirt}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="left-info-box">
                                    <div className="left-row row">
                                        <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                            <div className="label-text mb-0 pt-0 pb-0">
                                                <p className="mb-0">Shorts:</p>
                                            </div>
                                        </div>
                                        <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                            <div className="info-text pt-0 pb-0">
                                                <p className="mb-0">{team.shorts}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="left-info-box">
                                    <div className="left-row row">
                                        <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                            <div className="label-text mb-0 pt-0">
                                                <p className="mb-0">Socks:</p>
                                            </div>
                                        </div>
                                        <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                            <div className="info-text pt-0">
                                                <p className="mb-0">{team.socks}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="left-info-box">
                                <div className="left-row row">
                                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                        <div className="label-text mb-0">
                                            <p className="mb-0">Attack</p>
                                        </div>
                                    </div>
                                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                        <div className="info-text">
                                            <p className="mb-0">{team.attack}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="left-info-box">
                                <div className="left-row row">
                                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                        <div className="label-text mb-0">
                                            <p className="mb-0">Midfield</p>
                                        </div>
                                    </div>
                                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                        <div className="info-text">
                                            <p className="mb-0">{team.midfield}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="left-info-box">
                                <div className="left-row row">
                                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                        <div className="label-text mb-0">
                                            <p className="mb-0">Defence</p>
                                        </div>
                                    </div>
                                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                        <div className="info-text">
                                            <p className="mb-0">{team.defence}</p>
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
                                                <Link className="btn-common-text" href={`/admin/teams/${team._id}/edit`}>Edit</Link>
                                                <Link className="btn-common-text mt-30 mb-30 ps-3" href="/admin/teams" >Back</Link>
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
                                        <span className="info-span">E-mail: <a className="text-decoration-none text-body underline-hover" href={`mailto:${team.email}`} >{team.email}</a></span>
                                    </p>
                                </div>
                                <div className="right-info mb-30">
                                    <p className="mb-0 fs-14 d-flex align-items-center gap-30">
                                        <span className="info-span">Tel: <a className="text-decoration-none text-body underline-hover" href={`tel:${team.phone}`}>{team.phone}</a></span>
                                        <span className="user-active">Verified</span>
                                    </p>
                                </div>
                                <div className="right-info mb-30">
                                    <Link href={`/admin/teams/${team._id}/edit`}>
                                        <Image
                                            src={preview}
                                            width={82}
                                            height={82}
                                            className={'profile-img mb-10'}
                                            alt="Profile Image"
                                        />
                                    </Link>
                                    <p className="mb-0">
                                        <Link className="text-decoration-none fs-14 fw-bold text-primary underline-hover" href={`/admin/teams/${team._id}/edit`}>Team Badge</Link>
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="single-bottom-table-cont mt-30">
                        <h2 className="fs-14 fw-bold mb-20">Schedules Friendlies</h2>
                        <form>

                            <div className="table-responsive common-datatable">
                                <table id="example" className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Date</th>
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
                                        <tr>
                                            <td className="text-nowrap">11.01.24</td>
                                            <td className="text-nowrap">1pm</td>
                                            <td className="text-nowrap"><a href="#">Blueline U14s</a></td>
                                            <td className="text-nowrap"><a href="#">OakPark</a></td>
                                            <td className="text-nowrap">Complete</td>
                                            <td className="text-nowrap"><a href="#">Paul Tader</a></td>
                                            <td className="text-nowrap">1-0</td>
                                            <td className="text-nowrap">Loss</td>
                                            <td className="text-nowrap"><a className="text-green" href="teams-edit.php">Edit</a></td>
                                        </tr>
                                        <tr>
                                            <td className="text-nowrap">12.02.24</td>
                                            <td className="text-nowrap">3pm</td>
                                            <td className="text-nowrap"><a href="#">CPR U14s</a></td>
                                            <td className="text-nowrap"><a href="#">Waterend</a></td>
                                            <td className="text-nowrap">Complete</td>
                                            <td className="text-nowrap"><a href="#">Marc Waters</a></td>
                                            <td className="text-nowrap">3-2</td>
                                            <td className="text-nowrap">Win</td>
                                            <td className="text-nowrap"><a className="text-green" href="teams-edit.php">Edit</a></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </form>
                    </div>

                    <div className="single-bottom-table-cont mt-30">
                        <h2 className="fs-14 fw-bold mb-20">Archive</h2>
                        <form>
                            <div className="table-responsive common-datatable">
                                <table id="example" className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Date</th>
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
                                        <tr>
                                            <td className="text-nowrap">12.02.24</td>
                                            <td className="text-nowrap">3pm</td>
                                            <td className="text-nowrap"><a href="#">CPR U14s</a></td>
                                            <td className="text-nowrap"><a href="#">Waterend</a></td>
                                            <td className="text-nowrap">Complete</td>
                                            <td className="text-nowrap"><a href="#">Marc Waters</a></td>
                                            <td className="text-nowrap">3-2</td>
                                            <td className="text-nowrap">Win</td>
                                            <td className="text-nowrap"><a className="text-green" href="teams-edit.php">Edit</a></td>
                                        </tr>
                                        <tr>
                                            <td className="text-nowrap">11.01.24</td>
                                            <td className="text-nowrap">1pm</td>
                                            <td className="text-nowrap"><a href="#">Blueline U14s</a></td>
                                            <td className="text-nowrap"><a href="#">OakPark</a></td>
                                            <td className="text-nowrap">Complete</td>
                                            <td className="text-nowrap"><a href="#">Paul Tader</a></td>
                                            <td className="text-nowrap">1-0</td>
                                            <td className="text-nowrap">Loss</td>
                                            <td className="text-nowrap"><a className="text-green" href="teams-edit.php">Edit</a></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </form>
                    </div>
                </div>

            </main>
        </>

    )

}
