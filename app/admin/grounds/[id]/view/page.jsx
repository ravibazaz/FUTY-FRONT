import ChangeStatus from "@/components/ChangeStatus";
import GroundFacilitiesCheckbox from "@/components/GroundFacilitiesCheckbox";
import { connectDB } from "@/lib/db";
import Grounds from "@/lib/models/Grounds";
import Image from "next/image";
import Link from "next/link";

export default async function ViewFansPage({ params }) {
    const id = (await params).id;
    let preview = "/images/profile-picture.jpg";
    await connectDB();
    const userdetails = await Grounds.findById(id).lean();

    return (
        <>
            <main className="main-body col-md-9 col-lg-9 col-xl-10">
                <div className="body-top d-flex flex-wrap justify-content-between align-items-center gap-20 mb-10">
                    <div className="top-left">
                        <p className="top-breadcrumb mb-0">{'> Grounds'}</p>
                    </div>
                    <div className="top-right d-flex justify-content-between align-items-center gap-10">
                        {/* <a className="btn btn-common" href="grounds-new.php">New</a> */}
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
                        <h1 className="page-title">{userdetails.name}</h1>

                    </div>
                </div>

                <div className="body-main-cont">
                    <div className="single-body-row row">
                        <div className="single-body-left col-lg-12 col-xl-7">
                            <div className="left-info-box">
                                <div className="left-row row">
                                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                        <div className="label-text">
                                            <p className="mb-0">Address</p>
                                        </div>
                                    </div>
                                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                        <div className="info-text">
                                            <p className="mb-0">
                                                <a className="text-primary text-decoration-none" href="#">
                                                    {userdetails.add1}
                                                    <br />
                                                    {userdetails.add2}
                                                    <br />
                                                    {userdetails.add3}


                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="left-info-box">
                                <div className="left-row row">
                                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                        <div className="label-text">
                                            <p className="mb-0">Postcode</p>
                                        </div>
                                    </div>
                                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                        <div className="info-text">
                                            <p className="mb-0">
                                                <a className="text-primary text-decoration-none" href="#"> {userdetails.pin}</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <GroundFacilitiesCheckbox facilities={userdetails.facilities}></GroundFacilitiesCheckbox>
                            <div className="left-info-box">
                                <div className="left-row row">
                                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                        <div className="label-text mb-0">

                                        </div>
                                    </div>
                                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                        <div className="info-text">
                                            <p className="mb-0">
                                                <Link className="btn-common-text" href={`/admin/grounds/${userdetails._id}/edit`}>Edit</Link>
                                                <Link className="btn-common-text mt-30 mb-30 ps-3"  href="/admin/grounds" >Back</Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="single-body-right col-lg-12 col-xl-5">
                            <div className="right-info-box">

                                <div className="right-info mb-30 pt-30 pb-30">
                                    <div className="d-flex flex-wrap gap-15">
                                        {userdetails.images.length > 0 ? (
                                            userdetails.images.map((l, index) => (
                                                <Image
                                                    key={index}
                                                    src={'/api'+l}
                                                    width={82}
                                                    height={82}
                                                    alt="Profile Image"
                                                    title="test2"

                                                />
                                            ))
                                        ) : (
                                            <Image
                                                src={'/images/club-badge.jpg'}
                                                width={82}
                                                height={82}
                                                alt="Profile Image"
                                                title="test"

                                            />
                                        )}
                                    </div>
                                    <p className="mb-0">
                                        <Link className="text-decoration-none fs-14 fw-bold text-primary underline-hover" href={`/admin/grounds/${userdetails._id}/edit`}>Ground Photos </Link>

                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="single-bottom-table-cont mt-30">
                        <h2 className="fs-14 fw-bold mb-20">Home Grounds</h2>
                        <form>

                            <div className="table-responsive common-datatable">
                                <table id="example" className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Team</th>
                                            <th scope="col">Secretary</th>
                                            <th scope="col">Telephone</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Edit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="text-nowrap"><a href="grounds-single.php">Pegasus Under 7’s</a></td>
                                            <td className="text-nowrap"><a href="#">Marc Winters</a></td>
                                            <td className="text-nowrap"><a href="tel:+44 08564 346268">+44 08564 346268</a></td>
                                            <td className="text-nowrap"><a href="mailto:u7@phyl.co.uk">u7@phyl.co.uk</a></td>
                                            <td className="text-nowrap"><a className="text-green" href="grounds-edit">Edit</a></td>
                                        </tr>
                                        <tr>
                                            <td className="text-nowrap"><a href="grounds-single.php">Chineham Under 7’s</a></td>
                                            <td className="text-nowrap"><a href="#">Gary Byrne</a></td>
                                            <td className="text-nowrap"><a href="tel:+44 08564 346268">+44 08564 346268</a></td>
                                            <td className="text-nowrap"><a href="mailto:u7@phyl.co.uk">u7@phyl.co.uk</a></td>
                                            <td className="text-nowrap"><a className="text-green" href="grounds-edit">Edit</a></td>
                                        </tr>
                                        <tr>
                                            <td className="text-nowrap"><a href="grounds-single.php">Blue Star  Under 7’s</a></td>
                                            <td className="text-nowrap"><a href="#">Michael Star</a></td>
                                            <td className="text-nowrap"><a href="tel:+44 08564 346268">+44 08564 346268</a></td>
                                            <td className="text-nowrap"><a href="mailto:u7@phyl.co.uk">u7@phyl.co.uk</a></td>
                                            <td className="text-nowrap"><a className="text-green" href="grounds-edit">Edit</a></td>
                                        </tr>
                                        <tr>
                                            <td className="text-nowrap"><a href="grounds-single.php">CPR Under 7’s</a></td>
                                            <td className="text-nowrap"><a href="#">Michael Star</a></td>
                                            <td className="text-nowrap"><a href="tel:+44 08564 346268">+44 08564 346268</a></td>
                                            <td className="text-nowrap"><a href="mailto:u7@phyl.co.uk">u7@phyl.co.uk</a></td>
                                            <td className="text-nowrap"><a className="text-green" href="grounds-edit">Edit</a></td>
                                        </tr>
                                        <tr>
                                            <td className="text-nowrap"><a href="grounds-single.php">Philly Under</a></td>
                                            <td className="text-nowrap"><a href="#">Michael Star</a></td>
                                            <td className="text-nowrap"><a href="tel:+44 08564 346268">+44 08564 346268</a></td>
                                            <td className="text-nowrap"><a href="mailto:u7@phyl.co.uk">u7@phyl.co.uk</a></td>
                                            <td className="text-nowrap"><a className="text-green" href="grounds-edit">Edit</a></td>
                                        </tr>
                                        <tr>
                                            <td className="text-nowrap"><a href="grounds-single.php">Chineham Under 7’s</a></td>
                                            <td className="text-nowrap"><a href="#">Michael Star</a></td>
                                            <td className="text-nowrap"><a href="tel:+44 08564 346268">+44 08564 346268</a></td>
                                            <td className="text-nowrap"><a href="mailto:u7@phyl.co.uk">u7@phyl.co.uk</a></td>
                                            <td className="text-nowrap"><a className="text-green" href="grounds-edit">Edit</a></td>
                                        </tr>
                                        <tr>
                                            <td className="text-nowrap"><a href="grounds-single.php">Brighton Under 7’s</a></td>
                                            <td className="text-nowrap"><a href="#">Michael Star</a></td>
                                            <td className="text-nowrap"><a href="tel:+44 08564 346268">+44 08564 346268</a></td>
                                            <td className="text-nowrap"><a href="mailto:u7@phyl.co.uk">u7@phyl.co.uk</a></td>
                                            <td className="text-nowrap"><a className="text-green" href="grounds-edit">Edit</a></td>
                                        </tr>
                                        <tr>
                                            <td className="text-nowrap"><a href="grounds-single.php">Wembley Under 7’s</a></td>
                                            <td className="text-nowrap"><a href="#">Michael Star</a></td>
                                            <td className="text-nowrap"><a href="tel:+44 08564 346268">+44 08564 346268</a></td>
                                            <td className="text-nowrap"><a href="mailto:u7@phyl.co.uk">u7@phyl.co.uk</a></td>
                                            <td className="text-nowrap"><a className="text-green" href="grounds-edit">Edit</a></td>
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
