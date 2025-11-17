"use client";
import Swal from "sweetalert2";

export default function DeleteButton({ id }) {
    const handleDelete = async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You cannot undo this action!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e3342f",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            // Submit the form programmatically
            document.getElementById(`delete-form-${id}`).requestSubmit();
        }
    };
    return (
        <button
            type="button"
            onClick={handleDelete}
            className="btn-common-text ps-2"
        >
            Delete
        </button>
    );
}
