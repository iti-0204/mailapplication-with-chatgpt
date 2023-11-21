import Image from "next/image";
import Sidebar from "./components/Sidebar";
import Theme from "./components/Theme";

export default function Home() {
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
