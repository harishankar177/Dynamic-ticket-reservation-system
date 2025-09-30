import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";

const Auth = () => {
  const [currentView, setCurrentView] = useState("signin");

  const renderAuthView = () => {
    switch (currentView) {
      case "signin":
        return (
          <SignIn
            onForgotPassword={() => setCurrentView("forgot")}
            onSignUp={() => setCurrentView("signup")}
          />
        );
      case "signup":
        return <SignUp onSignIn={() => setCurrentView("signin")} />;
      case "forgot":
        return <ForgotPassword onBack={() => setCurrentView("signin")} />;
      default:
        return null;
    }
  };

  return <AuthLayout>{renderAuthView()}</AuthLayout>;
};

export default Auth;
          
