import React from "react";
import Layout from "./Layout";
import AuthProvider from "../context/AuthContextOauth";
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
