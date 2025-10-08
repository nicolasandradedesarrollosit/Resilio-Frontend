import React from "react";
import Layout from "./Layout";
import AuthProvider from "../../../viewmodel/oauth/AuthContext";

function App() {
  return (
    <>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </>
      
  );
}

export default App;
