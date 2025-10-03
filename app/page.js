
'use client';
import { useFormState } from 'react-dom';
import { useActionState, useState,useEffect } from "react";
import { loginAction } from "@/actions/loginAction";
import { useRouter } from "next/navigation";

export default function Home() {

  const [state, formAction] = useActionState(loginAction, {
    error: null,
  });

  const router = useRouter();
  const [loading, setLoading] = useState(true);

    useEffect(() => {
      async function checkAuth() {
        try {
          const res = await fetch("/api/check-auth");
          const { isAuthenticated } = await res.json();
  
          if (isAuthenticated) {
            router.push("/admin/dashboard");
          } else {
            setLoading(false); // Show login form if not authenticated
          }
        } catch (err) {
          console.error("Error checking auth:", err);
          setLoading(false);
        }
      }
  
      checkAuth();
    }, [router]);
  
    if (loading) return <p>Loading...</p>;
    
  return (
    <div className="hold-transition login-page">
      <div className="login-box">
        <div className="login-logo">
          <a href="#">FUTY</a>
        </div>
        <div className="card">
          <div className="card-body login-card-body">
            <p className="login-box-msg">Sign in to start your session</p>

            <form action={formAction}  >
              <div className="input-group mb-3">
                <input
                  type="email"
                   name="email"
                  className="form-control"
                  placeholder="Email"
                ></input>
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-envelope"></span>
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  type="password"
                   name="password"
                  className="form-control"
                  placeholder="Password"
                ></input>
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock"></span>
                  </div>
                </div>
              </div>
              {state?.error && (
              <div className="text-danger mb-2">{state.error}</div>
            )}
              <div className="row">
                <div className="col-4">
                  <button type="submit" className="btn btn-primary btn-block">
                    Sign In
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
