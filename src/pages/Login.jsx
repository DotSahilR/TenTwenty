import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoginForm from "../components/LoginForm";

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen w-screen flex">
      <div className="flex flex-col items-center justify-center basis-1/2 flex-1 px-6 py-12 bg-gray-50">
        <LoginForm />
      </div>

      <div className="blue-gradient flex flex-col justify-center basis-1/2 flex-1 text-white px-9 ">
        <div className="space-y-6 max-w-md mx-auto w-64">
          <h1 className="text-4xl text-center font-bold">TickTrack</h1>
          <p className="text-sm text-center text-blue-100 mt-2">
            Introducing ticktock, our cutting-edge timesheet web application
            designed to revolutionize how you manage employee work hours. With
            TickTrack, you can effortlessly track and monitor employee
            attendance and productivity from anywhere, anytime, using any
            internet-connected device. Gain real-time insights into project
            timelines and team performance. Simplify payroll processing with
            accurate, automated time tracking.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
