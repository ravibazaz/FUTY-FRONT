import ChangeStatus from "@/components/ChangeStatus";
import ClubDropdown from "@/components/ClubDropdown";
import { connectDB } from "@/lib/db";
import Stores from "@/lib/models/Stores";
import Image from "next/image";
import Link from "next/link";
import dynamic from 'next/dynamic';
const DynamicComponentShowImagesWithAlertClick = dynamic(() => import('@/components/ShowImagesWithAlertClick'), {
  loading: () => <p>Loading component...</p>, // The fallback UI
});
export default async function ViewFansPage({ params }) {
    const id = (await params).id;
    let preview = "/images/club-badge.jpg";
    await connectDB();
    const store = await Stores.findById(id).populate("category","title").lean();
   
    if (store.image)
        preview = '/api' + store.image;

    return (
        <>
            <main className="main-body col-md-9 col-lg-9 col-xl-10">
                <div className="body-top d-flex flex-wrap justify-content-between align-items-center gap-20 mb-10">
                    <div className="top-left">
                        <p className="top-breadcrumb mb-0">{'> Product'}</p>
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
                        <h1 className="page-title">{store.title}</h1>

                    </div>
                </div>

                <div className="body-main-cont">
                    <div className="single-body-row row">
                        <div className="single-body-left col-lg-12 col-xl-7">
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
                                                <a className="text-primary text-decoration-none" href="#">{store.content}</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="left-info-box">
                                <div className="left-row row">
                                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                        <div className="label-text">
                                            <p className="mb-0">Product Category</p>
                                        </div>
                                    </div>
                                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                        <div className="info-text">
                                            <p className="mb-0">
                                                <a className="text-primary text-decoration-none" href="#">{store.category?.title}</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="left-info-box">
                                <div className="left-row row">
                                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                        <div className="label-text">
                                            <p className="mb-0">Product Price</p>
                                        </div>
                                    </div>
                                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                        <div className="info-text">
                                            <p className="mb-0">
                                                <a className="text-primary text-decoration-none" href="#">{store.price}</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="left-info-box">
                                <div className="left-row row">
                                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                        <div className="label-text">
                                            <p className="mb-0">Product Discount</p>
                                        </div>
                                    </div>
                                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                        <div className="info-text">
                                            <p className="mb-0">
                                                <a className="text-primary text-decoration-none" href="#">{store.discount}</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="left-info-box">
                                <div className="left-row row">
                                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                        <div className="label-text">
                                            <p className="mb-0">Product Shipping cost</p>
                                        </div>
                                    </div>
                                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                        <div className="info-text">
                                            <p className="mb-0">
                                                <a className="text-primary text-decoration-none" href="#">{store.shipping_cost}</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="left-info-box">
                                <div className="left-row row">
                                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                        <div className="label-text">
                                            <p className="mb-0">Product Size</p>
                                        </div>
                                    </div>
                                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                        <div className="info-text">
                                            <p className="mb-0">
                                                <a className="text-primary text-decoration-none" href="#">{store.size}</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="left-info-box">
                                <div className="left-row row">
                                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                        <div className="label-text">
                                            <p className="mb-0">Product Color</p>
                                        </div>
                                    </div>
                                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                        <div className="info-text">
                                            <p className="mb-0">
                                                <a className="text-primary text-decoration-none" href="#">{store.color}</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="left-info-box">
                                <div className="left-row row">
                                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                        <div className="label-text">
                                            <p className="mb-0">Product Material</p>
                                        </div>
                                    </div>
                                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                        <div className="info-text">
                                            <p className="mb-0">
                                                <a className="text-primary text-decoration-none" href="#">{store.material}</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="left-info-box">
                                <div className="left-row row">
                                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                        <div className="label-text">
                                            <p className="mb-0">Product Code</p>
                                        </div>
                                    </div>
                                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                        <div className="info-text">
                                            <p className="mb-0">
                                                <a className="text-primary text-decoration-none" href="#">{store.product_code}</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="left-info-box">
                                <div className="left-row row">
                                    <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                        <div className="label-text">
                                            <p className="mb-0">Product Other Information</p>
                                        </div>
                                    </div>
                                    <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                        <div className="info-text">
                                            <p className="mb-0">
                                                <a className="text-primary text-decoration-none" href="#">{store.other_product_info}</a>
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
                                                <Link className="btn-common-text" href={`/admin/stores/${store._id}/edit`} >Edit</Link>
                                                <Link className="btn-common-text ps-3" href={`/admin/stores`} >Back</Link>

                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="single-body-right col-lg-12 col-xl-5">
                            <div className="right-info-box">
                                {/* <h2 className="info-box-title fs-14 fw-bold mb-30">Contact Details</h2> */}
                                <div className="right-info mb-30">
                                    {/* <Link href={`/admin/stores/${store._id}/edit`}>
                                        <Image
                                            src={preview}
                                            width={82}
                                            height={82}
                                            className={'profile-img mb-10'}
                                            alt="Club Badge"
                                        />
                                    </Link> */}
                                     <DynamicComponentShowImagesWithAlertClick images={store.image ? [store.image] : []}></DynamicComponentShowImagesWithAlertClick>

                                    <p className="mb-0">
                                        <Link className="text-decoration-none fs-14 fw-bold text-primary underline-hover" href={`/admin/stores/${store._id}/edit`}>Product Badge</Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>




                </div>

            </main>
        </>

    )

}
