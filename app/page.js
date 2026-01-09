'use client';

import { useFormState } from 'react-dom';
import { useActionState, useState, useEffect } from "react";
import { loginAction } from "@/actions/loginAction";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const [state, formAction, isPending] = useActionState(loginAction, {
    error: null,
  });
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
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

  if (loading) return <p className="top-breadcrumb mb-0">Loading...</p>;

  return (
    <>

      <div className="wrapper fadeInDown">

        <div id="formContent">
          {/* <!-- Tabs Titles --> */}
          {/* <!-- Icon --> */}
          <div className="fadeIn first">
            <Image id="icon" src="/images/logo-dark.png" width={113} height={33} alt="FUTY" />
          </div>

          {/* <!-- Login Form --> */}
          <form action={formAction}>
            <input type="text" id="login" className="fadeIn second" name="email" placeholder="Email"></input>
            <div className="password-container w85">
              <input type={showPassword ? "text" : "password"} id="password" className="fadeIn third" name="password" placeholder="Password"></input>
              <span id="showPasswordImg" className="eye-icon" onClick={() => setShowPassword((prev) => !prev)}
                style={{ cursor: "pointer" }}>
                <Image
                  src={showPassword ? "/images/icon-closed-eye.svg" : "/images/icon-open-eye.svg"}
                  alt={showPassword ? "Closed Eye" : "Open Eye"}
                  width={24}
                  height={24}
                />
              </span>
            </div>

            {/* <input type="password" id="password" className="fadeIn third" name="password" placeholder="Password"></input> */}
            {state?.error && (
              <div className="text-danger mb-2">{state.error}</div>
            )}
            <input className="btn-login fadeIn fourth" type="submit" disabled={isPending} value={isPending ? "Loading..." : "Sign In"} ></input>
          </form>
          {/* <!-- Remind Passowrd --> */}
          {/* <div id="formFooter">
            <span className="forgot-password">Not a member? <a className="underlineHover" href="#">Register</a></span>
            <a className="forgot-password underlineHover" href="#">Forgot Password?</a>
          </div> */}
        </div>
      </div>

    </>

  );
}
