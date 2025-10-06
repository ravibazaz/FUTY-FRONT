'use client';

import { useFormState } from 'react-dom';
import { useActionState, useState, useEffect } from "react";
import { loginAction } from "@/actions/loginAction";
import { useRouter } from "next/navigation";


export default function Home() {
  const [state, formAction, isPending] = useActionState(loginAction, {
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
    <>
     
      <div className="wrapper fadeInDown">

        <div id="formContent">
          {/* <!-- Tabs Titles --> */}
          {/* <!-- Icon --> */}
          <div className="fadeIn first">
            <img id="icon" src="/images/logo-dark.png" alt="FUTY" />
          </div>

          {/* <!-- Login Form --> */}
          <form action={formAction}>
            <input type="text" id="login" className="fadeIn second" name="email" placeholder="Email"></input>
            <input type="password" id="password" className="fadeIn third" name="password" placeholder="Password"></input>
            {state?.error && (
              <div className="text-danger mb-2">{state.error}</div>
            )}
            <input className="btn-login fadeIn fourth" type="submit" disabled={isPending} value= {isPending ? "Loading..." : "Sign In"} ></input>
          </form>
          {/* <!-- Remind Passowrd --> */}
          <div id="formFooter">
            <span className="forgot-password">Not a member? <a className="underlineHover" href="#">Register</a></span>
            <a className="forgot-password underlineHover" href="#">Forgot Password?</a>
          </div>
        </div>
      </div>

    </>

  );
}
