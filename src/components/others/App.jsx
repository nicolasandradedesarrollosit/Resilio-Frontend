import React from "react";
import Layout from "./Layout";
import AuthProvider from "../context/AuthContextOauth";
import UserProvider from "../context/UserContext";

function App() {
  return (
    <>
      <AuthProvider>
        <UserProvider>
          <Layout />
        </UserProvider>
      </AuthProvider>
    </>
      
  );
}

export default App;
