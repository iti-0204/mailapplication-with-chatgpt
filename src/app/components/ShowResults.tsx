"use client";

import React, { useEffect } from "react";
import Rank from "./Rank";
import Comment from "./Comment";
import { useAppContext } from "@/context/AppContext";
import { Timestamp, collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../../firebase";

type Answer = {
  createdAt: Timestamp;
  text: string;
  userId: string;
};

const ShowResults = () => {
  const { todayAnswer, setTodayAnswer, myQuestionId, setMyQuestionId } =
    useAppContext();

  // ここからchatgptの処理
  // もし昨日問題を回答していたら、
  useEffect(() => {
    if (todayAnswer && todayAnswer != "") {
      // ----まず問題のidから、その問題の回答を全て取得する
      // その問題の回答を集める
      if (myQuestionId) {
        const CollectionRef = collection(
          db,
          "problems",
          myQuestionId,
          "answers"
        );
        const q = query(CollectionRef);
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const allAnswers: Answer[] = snapshot.docs.map((doc) => ({
            createdAt: doc.data().createdAt,
            text: doc.data().text,
            userId: doc.data().userId,
          }));
          console.log(allAnswers);
          return () => {
            unsubscribe();
          };
        });
      }
    }
  });

  // その後、chatgptにぶつける
  // レスポンスから順位を判定して、順位とコメントを描画。
  return (
    <div className="flex items-center flex-col bg-base-gray border-0 ">
      <h1 className="text-2xl py-5">結果を見る</h1>
      <div className="flex w-full justify-between">
        <div className="w-1/2 h-full flex justify-center">
          <Rank />
        </div>
        <div className="w-1/2 h-full flex justify-center">
          <Comment />
        </div>
      </div>
    </div>
  );
};

export default ShowResults;
