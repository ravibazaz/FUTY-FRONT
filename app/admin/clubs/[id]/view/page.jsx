import ChangeStatus from "@/components/ChangeStatus";
import ClubDropdown from "@/components/ClubDropdown";
import { connectDB } from "@/lib/db";
import Clubs from "@/lib/models/Clubs";
import Teams from "@/lib/models/Teams";
import Image from "next/image";
import Link from "next/link";
import AgeGroups from "@/lib/models/AgeGroups";

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

    const teams = await Teams.find({ 'club': club._id }).lean();
    if (club.image)
        preview = '/api' + club.image;
    //console.log(teams);
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


                    {teams.length > 0 && <div className="single-bottom-table-cont mt-30">
                        <h2 className="fs-14 fw-bold mb-20">Teams</h2>

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
                                    {teams.length > 0 ? (
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
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2" className="text-center">Loading...</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                    }


                    <div className="single-bottom-table-cont mt-30">
                        <h2 className="fs-14 fw-bold mb-20">Friendlies</h2>
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
                                            <td className="text-nowrap"><a className="text-green" href="#">Edit</a></td>
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
                                            <td className="text-nowrap"><a className="text-green" href="#">Edit</a></td>
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
                                            <td className="text-nowrap"><a className="text-green" href="#">Edit</a></td>
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
                                            <td className="text-nowrap"><a className="text-green" href="#">Edit</a></td>
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
