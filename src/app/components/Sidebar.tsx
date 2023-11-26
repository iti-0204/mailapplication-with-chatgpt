"use client";

import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import React from "react";
import {
  AiOutlineEdit,
  AiOutlineFileDone,
  AiOutlineSearch,
  AiOutlineStock,
  AiOutlineUser,
} from "react-icons/ai";

const Sidebar = () => {
  const router = useRouter();

  const { pages, setPages, userId, user } = useAppContext();

  const pushTop = () => {
    setPages("top");
    router.push("./");
  };

  const pushResult = () => {
    setPages("result");
    router.push("./result");
  };

  return (
    <div className="flex items-center flex-col gap-5 pt-20  bg-base-gray h-full border-0">
      <div
        className={
          pages === "top"
            ? "w-20 h-20 flex justify-center items-center flex-col rounded-md bg-selected-gray"
            : "w-20 h-20 flex justify-center items-center flex-col rounded-md"
        }
        onClick={() => pushTop()}
      >
        <AiOutlineEdit size={"50%"} />
        <p>本日のお題</p>
      </div>
      <div
        className={
          pages === "result"
            ? "w-20 h-20 flex justify-center items-center flex-col rounded-md bg-selected-gray"
            : "w-20 h-20 flex justify-center items-center flex-col rounded-md"
        }
        onClick={() => pushResult()}
      >
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

      {user && (
        <div className="pt-6">
          ユーザーID:
          <div className="text-xs">{userId}</div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
