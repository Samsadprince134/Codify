import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/core/Dashboard/Sidebar";
export default function Dashboard() {
  const { loading: authLoading } = useSelector((state) => state.auth);
  const { loading: profileLoading } = useSelector((state) => state.profile);
  if (profileLoading || authLoading) {
    return <div className="text-white">Spinner loaidng</div>;
  }
  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] ">
      <div className="h-[calc(100vh-3.5rem)] overflow-auto flex-1 flex ">
        <Sidebar></Sidebar>
        <div className="mx-auto w-11/12 max-w-[1000px] py-10 ">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
}
