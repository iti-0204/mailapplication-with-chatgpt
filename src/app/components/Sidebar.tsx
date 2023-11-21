import React from "react";
import {
  AiOutlineEdit,
  AiOutlineFileDone,
  AiOutlineSearch,
  AiOutlineStock,
  AiOutlineUser,
} from "react-icons/ai";

const Sidebar = () => {
  return (
    <div className="flex items-center flex-col gap-5 pt-20  bg-base-gray h-full border-0">
      <div className="w-20 h-20 bg-selected-gray  flex justify-center items-center flex-col rounded-md">
        <AiOutlineEdit size={"50%"} />
        <p>本日のお題</p>
      </div>
      <div className="w-20 h-20   flex justify-center items-center flex-col rounded-md">
        <AiOutlineFileDone size={"50%"} />
        <p>結果を見る</p>
      </div>
      <div className="w-20 h-20   flex justify-center items-center flex-col rounded-md">
        <AiOutlineSearch size={"50%"} />
        <p>検索</p>
      </div>
      <div className="w-20 h-20   flex justify-center items-center flex-col rounded-md">
        <AiOutlineStock size={"50%"} />
        <p>復習</p>
      </div>
      <div className="w-20 h-20   flex justify-center items-center flex-col rounded-md">
        <AiOutlineUser size={"50%"} />
        <p>マイページ</p>
      </div>
    </div>
  );
};

export default Sidebar;
