"use client";

import { updateLeague } from "@/actions/leaguesActions";
import { LeaguesSchema } from "@/lib/validation/leagues";
import { useFormStatus } from "react-dom";
import { useActionState, useState, startTransition } from "react";
import Image from "next/image";
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? "Editing" : "Edit League"}
    </button>
  );
}

export default function EditLeagueForm({ league }) {
  const [state, formAction] = useActionState(
    updateLeague.bind(null, league._id),
    {
      success: null,
      errors: {},
    }
  );

  const [clientErrors, setClientErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const raw = Object.fromEntries(formData.entries());

    // Check if a new image was uploaded
    const imageFile = e.target.image.files[0];
    if (imageFile) {
      formData.set("image", imageFile); // Append the new file
    } else {
      formData.delete("image"); // Remove the image key if no new file is uploaded
    }

    const result = LeaguesSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!result.success) {
      setClientErrors(result.error.flatten().fieldErrors);
      return;
    }

    setClientErrors({});

    // Wrap the async function call inside startTransition
    startTransition(() => {
      formAction(formData); // Trigger the server action
    });
  };

  return (
    <div className="card card-primary">
      <div className="card-header">
        <h3 className="card-title">Edit League</h3>
      </div>

      <form action={formAction} onSubmit={handleSubmit}>
        <div className="card-body">
          <div className="form-group">
            <label htmlFor="leagueName">League Name</label>
            <input
              id="leagueName"
              type="text"
              className="form-control"
              name="title"
              defaultValue={league.title}
              placeholder="League Name"
            />
            {clientErrors.title && (
              <span className="invalid-feedback" style={{ display: "block" }}>
                {clientErrors.title}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="leagueName">League Image</label>
            <input
              id="image"
              type="file"
              className="form-control"
              name="image"
              accept="image/*"
            />
            {clientErrors.image && (
              <span className="invalid-feedback" style={{ display: "block" }}>
                {clientErrors.image}
              </span>
            )}

            {league.image && (
              <div className="mt-2">
                <Image
              src={`/api${league.image}`}
              alt={league.image}
              width={100}
              height={100}
              priority
            />

              
                <p>Current Image</p>
              </div>
            )}
          </div>

          <div className="form-group">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="isActive"
                value="true"
                defaultChecked={league.isActive === true}
              />
              <label className="form-check-label">Active</label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="isActive"
                value="false"
                defaultChecked={league.isActive === false}
              />
              <label className="form-check-label">Inactive</label>
            </div>
          </div>
        </div>

        <div className="card-footer">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
