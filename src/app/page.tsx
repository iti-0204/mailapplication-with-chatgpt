"use client";

import Image from "next/image";
import Sidebar from "./components/Sidebar";
import Theme from "./components/Theme";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useAppContext();
  const router = useRouter();

  if (!user) {
    router.push("/auth/login");
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="h-full flex" style={{ width: "1280px" }}>
        <div className="w-1/6 h-full  ">
          <Sidebar />
        </div>
        <div className="w-5/6 h-full ">
          <Theme />
        </div>
      </div>
    </div>
  );
}
