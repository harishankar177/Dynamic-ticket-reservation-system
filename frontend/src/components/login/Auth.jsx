import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";

const Auth = () => {
  const [currentView, setCurrentView] = useState("signin"); // "signin", "signup", "forgot"

  const renderAuthView = () => {
    switch (currentView) {
      case "signin":
        return (
          <SignIn
            onSignUp={() => setCurrentView("signup")}
            onForgotPassword={() => setCurrentView("forgot")}
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
