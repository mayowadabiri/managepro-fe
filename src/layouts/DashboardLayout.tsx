import React, { useEffect, useState, useRef } from "react";
import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import {
  BellIcon,
  UserIcon,
  SearchIcon,
  SettingsIcon,
  LogOutIcon,
  CreditCardIcon,
  InfoIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  MenuIcon,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import MobileSidebar from "../components/MobileSidebar";
import Header from "../components/Header";
import NotificationsMenu from "../components/NotificationsMenu";
import ProfileMenu from "../components/ProfileMenu";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = () => {
  const navigate = useNavigate();


  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
