"use client";

import React, { useEffect } from "react";
import Rank from "./Rank";
import Comment from "./Comment";
import { useAppContext } from "@/context/AppContext";
import { Timestamp, collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../../firebase";
import OpenAI from "openai";

type Answer = {
  createdAt: Timestamp;
  text: string;
  userId: string;
};

const ShowResults = () => {
  const {
    todayAnswer,
    setTodayAnswer,
    myQuestionId,
    setMyQuestionId,
    myTodayQuestion,
    setMyTodayQuestion,
  } = useAppContext();

  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });

  let togptQuestion =
    "今から審査員になってください。今回メールに関するお題が一つ与えられ、それに対していくつかのユーザーが回答します。今回審査員には、与えられたお題と、それに対する全ての回答についてコメントをし、順位付けをしてほしいです。コメントについては、良かった点と改善すると良い点をそれぞれ書いてほしいです。順位付けの基準については、ビジネスメールとしてより相応しいものには、高い順位を与えるという基準でお願いします。回答のフォーマットについても指定をします。以下のフォーマットでコメントと順位をつけてください。\n1位：〇〇(ユーザーid)：コメント〜〜〜\n2位：〇〇(ユーザーid)：コメント〜〜〜\n3位：〇〇(ユーザーid)：コメント〜〜〜\n以下は今回のお題と、各ユーザーの回答、回答したユーザーのユーザーidです。お願いします。";

  if (myTodayQuestion) {
    // togptQuestion.concat("お題\n", myTodayQuestion);
    togptQuestion = togptQuestion + "\nお題\n" + myTodayQuestion + "\n";
  }

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
          togptQuestion = togptQuestion + "\n回答\n";
          allAnswers.forEach((value, index) => {
            togptQuestion =
              togptQuestion + value.userId + "\n" + value.text + "\n\n";
          });
          console.log(togptQuestion);
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
