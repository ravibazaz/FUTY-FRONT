"use client";
import Swal from "sweetalert2";
import { useState } from "react";
import Image from "next/image";
export default function ShowImagesWithAlertClick(props) {

    const [selectedImages, setselectedImages] = useState(props.images ? props.images : '');

    const handleDelete = async (link) => {
        console.log(link);
        const result = await Swal.fire({
            imageUrl: '/api'+link, // Replace with your image URL
            imageAlt: 'Custom image',
            showConfirmButton: false,
            allowOutsideClick: true,
            animation: true, // Optional: disable animation if desired
            showCloseButton: true // This enables the close button
        });
    };
    return (
        <div className="d-flex flex-wrap gap-15" style={{ cursor: 'pointer' }}>
            {selectedImages.length > 0 ? (
                selectedImages.map((l, index) => (
                    <Image
                        key={index}
                        src={'/api' + l}
                        width={82}
                        height={82}
                        alt="Profile Image"
                        title="test2"
                        onClick={() => handleDelete(l)}

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
        // <button
        //     type="button"
        //     onClick={handleDelete}
        //     className="btn-common-text ps-2"
        // >
        //     Delete
        // </button>
    );
}
