"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useState, useRef, useTransition, useEffect } from "react";
import { createManagers } from "@/actions/managersInvitationActions";
import { ManagersSchema } from "@/lib/validation/managersInvitation";
import Image from "next/image";
import Link from "next/link";
import TomSelect from "tom-select";
import "tom-select/dist/css/tom-select.bootstrap5.css";
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <>

            <button type="submit" className="btn-common-text" disabled={pending}>
                {pending ? "Adding" : "Submit"}
            </button>
            <Link className="btn-common-text mt-30 mb-30 ps-3" href="/admin/teams/invitationmanagers" >Back</Link>
        </>
    );
}
export default function NewFanPage() {
    const [state, formAction] = useActionState(createManagers, {
        success: null,
        errors: {},
    });

    const [teams, setTeams] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    useEffect(() => {

        fetch(`/api/teams`)
            .then(res => res.json())
            .then(data => {
                console.log("Teams received:", data.teams);
                setTeams(data.teams);
            })
            .catch(err => console.error(err));
    }, []);

    const [selectedClub, setSelectedClub] = useState('');
    const [selectedLeague, setSelectedLeage] = useState('');
    const [clientErrors, setClientErrors] = useState({});
    const [preview, setPreview] = useState("/images/profile-picture.jpg");
    const fileInputRef = useRef(null);
    const selectRef = useRef(null);
    const tomSelectRef = useRef(null);

    // Initialize Tom Select after teams are loaded
    useEffect(() => {
        if (!selectRef.current || teams.length === 0) return;

        // Destroy any previous instance
        if (tomSelectRef.current) {
            tomSelectRef.current.destroy();
            tomSelectRef.current = null;
        }

        // Initialize Tom Select
        tomSelectRef.current = new TomSelect(selectRef.current, {
            create: false,
            placeholder: "Choose a Team",
            sortField: { field: "text", direction: "asc" },
            onChange: (value) => {
                const selectedOption = selectRef.current.querySelector(`option[value="${value}"]`);
                const clubName = selectedOption.dataset.club || "";
                const leagueName = selectedOption.dataset.league || "";
                setSelectedClub(clubName);
                setSelectedLeage(leagueName);
            },
        });


        // Cleanup
        return () => {
            tomSelectRef.current?.destroy();
            tomSelectRef.current = null;
        };
    }, [teams]);






    const [isPending, startTransition] = useTransition();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const raw = Object.fromEntries(formData.entries());

        const result = ManagersSchema(false).safeParse(raw);

        if (!result.success) {
            setClientErrors(result.error.flatten().fieldErrors);
            return;
        }

        // 2️⃣ Async unique email check before submitting
        const res = await fetch(`/api/check-email?email=${raw.manager_email}`);
        const { exists } = await res.json();
       
        
        if (exists) {
            setClientErrors({ manager_email: ["Email already exists"] });
            return;
        }

        // 3️⃣ If all good, submit to main API
        setClientErrors({});

        startTransition(() => {
            formAction(formData);
        });

    };

    return (
        <>
            <main className="main-body col-md-9 col-lg-9 col-xl-10">
                <div className="body-top d-flex flex-wrap justify-content-between align-items-center gap-20 mb-10">
                    <div className="top-left">
                        <p className="top-breadcrumb mb-0">{'> Managers Invitation'}</p>
                    </div>
                    <div className="top-right d-flex justify-content-between align-items-center gap-10">
                        {/* <a className="btn btn-common" href="managers-new.php">New</a> */}
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
                        <h1 className="page-title">Add New Manager Invitation</h1>

                    </div>
                </div>

                <form action={formAction} onSubmit={handleSubmit}>
                    <div className="body-main-cont">
                        <div className="single-body-row row">
                            <div className="single-body-left col-lg-12 col-xl-7">
                                <div className="left-info-box">
                                    <div className="left-row row">
                                        <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                            <div className="label-text">
                                                <p className="mb-0">Name</p>
                                            </div>
                                        </div>
                                        <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                            <div className="info-text px-0">
                                                <p className="mb-0">
                                                    <input className="form-control" name="manager_name" placeholder="First Name" type="text"></input>
                                                    {state.errors?.manager_name && (
                                                        <span className="invalid-feedback" style={{ display: "block" }}>{state.errors.manager_name}</span>
                                                    )}
                                                    {clientErrors.manager_name && (
                                                        <span className="invalid-feedback" style={{ display: "block" }} >{clientErrors.manager_name}</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="left-info-box">
                                    <div className="left-row row">
                                        <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                            <div className="label-text mb-0">
                                                <p className="mb-0">Email</p>
                                            </div>
                                        </div>
                                        <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                            <div className="info-text px-0">
                                                <p className="mb-0">
                                                    <input className="form-control" type="text" name="manager_email" placeholder="Email"></input>
                                                    {state.errors?.manager_email && (
                                                        <span className="invalid-feedback" style={{ display: "block" }}>{state.errors.manager_email}</span>
                                                    )}
                                                    {clientErrors.manager_email && (
                                                        <span className="invalid-feedback" style={{ display: "block" }} >{clientErrors.manager_email}</span>
                                                    )}
                                                    
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="left-info-box">
                                    <div className="left-row row">
                                        <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                            <div className="label-text mb-0">
                                                <p className="mb-0">Telephone</p>
                                            </div>
                                        </div>
                                        <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                            <div className="info-text px-0">
                                                <p className="mb-0">
                                                    <input className="form-control" name="manager_phone" placeholder="Telephone" type="text"></input>
                                                    {state.errors?.manager_phone && (
                                                        <span className="invalid-feedback" style={{ display: "block" }}>{state.errors.manager_phone}</span>
                                                    )}
                                                    {clientErrors.manager_phone && (
                                                        <span className="invalid-feedback" style={{ display: "block" }} >{clientErrors.manager_phone}</span>
                                                    )}
                                                    
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                                <div className="left-info-box">
                                    <div className="left-row row">
                                        <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                            <div className="label-text">
                                                <p className="mb-0">Team</p>
                                            </div>
                                        </div>
                                        <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                            <div className="info-text px-0">
                                                <p className="mb-0">
                                                    <select
                                                        className="form-control"
                                                        name="team_id"
                                                        ref={selectRef}
                                                    >
                                                        <option value="">Choose a Team</option>
                                                        {teams.map((team) => (
                                                            <option key={team._id} data-club={team?.club?.name} data-league={team?.club?.league?.title} value={team._id}>
                                                                {team.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {state.errors?.team_id && (
                                                        <span className="invalid-feedback" style={{ display: "block" }}>{state.errors.team_id}</span>
                                                    )}
                                                    {clientErrors.team_id && (
                                                        <span className="invalid-feedback" style={{ display: "block" }} >{clientErrors.team_id}</span>
                                                    )}
                                                </p>
                                                {selectedLeague && <p className="mb-0">League:{selectedLeague}</p>}
                                                {selectedClub && <p className="mb-0">Club:{selectedClub}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>



                                <div className="left-info-box">
                                    <div className="left-row row">
                                        <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                            <div className="label-text mb-0">
                                                <p className="mb-0">Nickname</p>
                                            </div>
                                        </div>
                                        <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                            <div className="info-text px-0">
                                                <p className="mb-0">
                                                    <input name="manager_nick_name" placeholder="Nickname" className="form-control" type="text"></input>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="left-info-box">
                                    <div className="left-row row">
                                        <div className="left-label-col col-md-5 col-lg-4 col-xl-4">
                                            <div className="label-text mb-0">
                                                <p className="mb-0">Address</p>
                                            </div>
                                        </div>
                                        <div className="left-info-col col-md-7 col-lg-8 col-xl-8">
                                            <div className="info-text px-0">
                                                <p className="mb-0">
                                                    <textarea name="manager_address" placeholder="Address" className="form-control"></textarea>
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
                                            <div className="info-text px-0">
                                                <p className="mb-0">
                                                    <SubmitButton />
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </form>

            </main>
        </>
    );
}
