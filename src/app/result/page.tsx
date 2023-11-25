import React from "react";
import Sidebar from "../components/Sidebar";
import ShowResults from "../components/ShowResults";

const page = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="h-full flex" style={{ width: "1280px" }}>
        <div className="w-1/6 h-full  ">
          <Sidebar />
        </div>
        <div className="w-5/6 h-full ">
          <ShowResults />
        </div>
      </div>
    </div>
  );
};

export default page;
