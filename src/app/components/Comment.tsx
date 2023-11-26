import React from "react";

const Comment = () => {
  return (
    <div className="w-full">
      <div className="bg-white w-5/6  rounded-md flex justify-center items-center flex-col py-5 mb-10">
        <div className="w-5/6 mb-4">
          <h2 className="border-b-2 border-orange-300 text-xl inline">
            昨日のお題
          </h2>
          
        </div>
      </div>
      <div className="bg-white w-5/6  rounded-md flex justify-center items-center flex-col py-5 mb-10">
        <div className="w-5/6 mb-4">
          <h2 className="border-b-2 border-orange-300 text-xl inline">
            回答とコメント
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Comment;
