import AgeCheckbox from "@/components/AgeCheckbox";
import ChangeStatus from "@/components/ChangeStatus";
import ClubDropdown from "@/components/ClubDropdown";
import { connectDB } from "@/lib/db";
import Leagues from "@/lib/models/Leagues";
import Image from "next/image";
import Link from "next/link";
import Clubs from "@/lib/models/Clubs";
import ClubTable from "@/components/ClubTable";
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
const DynamicComponentShowImagesWithAlertClick = dynamic(() => import('@/components/ShowImagesWithAlertClick'), {
  loading: () => <p>Loading component...</p>, // The fallback UI
});
export default async function ViewFansPage({ params }) {
    const id = (await params).id;
    let preview = "/images/club-badge.jpg";
    await connectDB();
    const league = await Leagues.findById(id).populate({
        path: "clubs",
        select: "name phone secretary_name",
    }).lean();

    // console.log(league);

    if (league.image)
        preview = '/api' + league.image;

    return (
        <>
            <main className="main-body col-md-9 col-lg-9 col-xl-10">
                <div className="body-top d-flex flex-wrap justify-content-between align-items-center gap-20 mb-10">
                    <div className="top-left">
                        <p className="top-breadcrumb mb-0">{'> Leagues'}</p>
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
                        <h1 className="page-title">{league.title}</h1>

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
                                                <a className="text-primary text-decoration-none" href="#">{league.s_name}</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="left-info-box">
                                <div className="left-row row">
                                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                        <div className="label-text">
                                            <p className="mb-0">Chairman Name</p>
                                        </div>
                                    </div>
                                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                        <div className="info-text">
                                            <p className="mb-0">
                                                <a className="text-primary text-decoration-none" href="#">{league.c_name}</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <AgeCheckbox age_groups={JSON.parse(JSON.stringify(league.age_groups))}></AgeCheckbox>
                            <div className="left-info-box">
                                <div className="left-row row">
                                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                        <div className="label-text">
                                            <p className="mb-0">Descriptin</p>
                                        </div>
                                    </div>
                                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                        <div className="info-text">
                                            <p className="mb-0">
                                                <a className="text-primary text-decoration-none" href="#">{league.content}</a>
                                            </p>
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
                                                <Link className="btn-common-text" href={`/admin/leagues/${league._id}/edit`} >Edit</Link>
                                                <Link className="btn-common-text mt-30 mb-30 ps-3" href="/admin/leagues" >Back</Link>
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
                                        <span className="info-span">Chairman E-mail: <a className="text-decoration-none text-body underline-hover" href="mailto:csb9900@gmail.com">{league.email}</a></span>
                                    </p>
                                </div>
                                <div className="right-info mb-30">
                                    <p className="mb-0 fs-14 d-flex align-items-center gap-30">
                                        <span className="info-span">Chairman Tel: <a className="text-decoration-none text-body underline-hover" href="tel:+44 07453 234258">{league.telephone}</a></span>
                                        <span className="user-active">Verified</span>
                                    </p>
                                </div>

                                <div className="right-info mb-30">
                                    {/* <Link href={`/admin/leagues/${league._id}/edit`}>
                                        <Image
                                            src={preview}
                                            width={82}
                                            height={82}
                                            className={'profile-img mb-10'}
                                            alt="Club Badge"
                                        />
                                    </Link> */}
                                      <DynamicComponentShowImagesWithAlertClick images={[league.image]}></DynamicComponentShowImagesWithAlertClick>

                                    <p className="mb-0">
                                        <Link className="text-decoration-none fs-14 fw-bold text-primary underline-hover" href={`/admin/leagues/${league._id}/edit`}>League Badge</Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Suspense fallback={<div>Loading...</div>}>
                    <ClubTable clubs={JSON.parse(JSON.stringify(league.clubs))}></ClubTable>
                    </Suspense>
                </div>

            </main>
        </>

    )

}
