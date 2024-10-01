"use client";
import { useState, useEffect } from "react";

import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

export default function Home() {
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    console.log("Home component mounted");
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {showLogin ? <LoginForm /> : <RegisterForm />}
        <div className="text-center mt-4">
          {showLogin ? (
            <p>
              Don't have an account?{" "}
              <button
                onClick={() => setShowLogin(false)}
                className="text-blue-500 hover:underline"
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => setShowLogin(true)}
                className="text-blue-500 hover:underline"
              >
                Log In here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
