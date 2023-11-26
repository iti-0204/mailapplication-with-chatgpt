import { useAppContext } from "@/context/AppContext";
import React from "react";

const Rank = () => {
  const { yesterdayResult } = useAppContext();
  return (
    <div className="bg-white w-5/6  rounded-md flex justify-center items-center flex-col py-5 mb-10">
      <div className="w-5/6 mb-4">
        <h2 className="border-b-2 border-orange-300 text-xl inline">順位</h2>
        <p>{yesterdayResult}</p>
      </div>
    </div>
  );
};

export default Rank;
