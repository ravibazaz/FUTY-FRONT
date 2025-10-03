"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useState } from "react";
import { createLeagues } from "@/actions/leaguesActions";
import { LeaguesSchema } from "@/lib/validation/leagues";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? "Adding" : "Add League"}
    </button>
  );
}

export default function NewLeaguePage() {
  const [state, formAction] = useActionState(createLeagues, {
    success: null,
    errors: {},
  });

  const [clientErrors, setClientErrors] = useState({});

  const handleSubmit = (e) => {
    const formData = new FormData(e.target);
    const raw = Object.fromEntries(formData.entries());

    const result = LeaguesSchema.safeParse(raw);

    if (!result.success) {
      e.preventDefault(); // prevent server call
      setClientErrors(result.error.flatten().fieldErrors);
    } else {
      setClientErrors({});
    }
  };

  return (
    <div className="card card-primary">
      <div className="card-header">
        <h3 className="card-title">Add League</h3>
      </div>
      <form  action={formAction} onSubmit={handleSubmit}  >
        <div className="card-body">
          <div className="form-group">
            <label forhtml="exampleInputEmail1">League Name</label>
            <input
              type="text"
              className="form-control"
              name="title"
              placeholder="League Name"
            ></input>
            {state.errors?.title && (
              <span className="invalid-feedback" style={{ display:"block" }}>{state.errors.title}</span>
            )}
            {clientErrors.title && (
              <span className="invalid-feedback" style={{ display:"block" }} >{clientErrors.title}</span>
            )}
          </div>
          <div className="form-group">
            <label forhtml="exampleInputImage">Image</label>
            <input
              type="file"
              className="form-control"
              name="image"
               accept="image/*"
            ></input>
            {state.errors?.image && (
              <span className="invalid-feedback" style={{ display:"block" }}>{state.errors.image}</span>
            )}
            {clientErrors.image && (
              <span className="invalid-feedback" style={{ display:"block" }} >{clientErrors.image}</span>
            )}
          </div>
          <div className="form-group">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="isActive"
                defaultChecked={true}
                value="true"
              ></input>
              <label className="form-check-label">Active</label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="isActive"
                value="false"
              ></input>
              <label className="form-check-label">InActive</label>
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
