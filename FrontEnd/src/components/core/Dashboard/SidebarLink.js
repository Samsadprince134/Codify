import React from "react";
import { NavLink, matchPath } from "react-router-dom";
import * as Icons from "react-icons/vsc";

import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
export default function SidebarLink({ link, iconName }) {
    console.log("Link is -->" , link)
  const Icon = Icons[iconName]
  console.log("icon---->" , Icon)
  const location = useLocation();
  const dispatch = useDispatch();
  function MatchRoute(route) {
    return matchPath({ path: route }, location.pathname);
  }
  return (
    <NavLink
      to={link.path}
      className={` relative px-8 py-2 text-sm ${
        MatchRoute(link.path) ? "bg-yellow-400" : "bg-opacity-0"
      }`}
    >
    <span
        className={`absolute left-0 top-0 h-full w-[0.2rem] bg-yellow-50 ${
          MatchRoute(link.path) ? "opacity-100" : "opacity-0"
        } `}
      ></span>

      <div className="flex items-center gap-x-2">
        <Icon className = "text-lg"></Icon>
        <span>{link.name}</span>

      </div> 

    </NavLink>
  );
}
