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
    yesterdayResult,
    setYesterdayResult,
    gptQuestion,
    setGptQuestion,
  } = useAppContext();

  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });

  console.log(myTodayQuestion);
  const afterDeleteLine = myTodayQuestion?.replace(/\\n/g, "\n");
  const afterDeleteSpace1 = afterDeleteLine?.replace(/　/g, "");
  const afterDeleteSpace2 = afterDeleteSpace1?.replace(/ /g, "");
  const afterOnlyMail = afterDeleteSpace2?.substring(
    afterDeleteSpace2.indexOf("「"),
    afterDeleteSpace2.indexOf("」") + 1
  );

  let togptQuestion2 =
    "あなたにはアドバイスを提示してほしいです。\n私にメールが届きました。そのメールの具体的な内容を次に記します。\n";

  if (afterOnlyMail) {
    togptQuestion2 =
      togptQuestion2 +
      afterOnlyMail +
      "\nそれに対し次の複数の返信を考えました。";
  }

  const gptsetting = async () => {
    if (todayAnswer && todayAnswer != "" && gptQuestion == null) {
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
          // プロンプトの作成
          allAnswers.forEach((value) => {
            togptQuestion2 = `${togptQuestion2} \n${value.userId}の回答\n「川島様\n${value.text}」`;
          });
          togptQuestion2 =
            togptQuestion2 +
            "\nこれらに対しそれぞれアドバイスを提示し、順位をつけてください。また回答のフォーマットについても以下の通りにお願いします。\n1位：\n{1位のユーザーid}\n回答：{1位のユーザーの回答文}\nアドバイス：\n{アドバイス}\n";
          setGptQuestion(togptQuestion2);
          // 送信
          return () => {
            unsubscribe();
          };
        });
      }
    }
  };

  // ここからchatgptの処理
  // もし昨日問題を回答していたら、
  const gptSeeking = async () => {
    console.log(togptQuestion2);
    const gpt3Response = await openai.chat.completions.create({
      messages: [{ role: "user", content: gptQuestion }],
      model: "gpt-3.5-turbo",
    });
    const botResponse = gpt3Response.choices[0].message.content;
    // レスポンスをグローバル変数に格納
    if (botResponse?.includes("1位") && yesterdayResult == null) {
      setYesterdayResult(botResponse);
    }
  };
  useEffect(() => {
    const f = async () => {
      await gptsetting();
      console.log(togptQuestion2);
      if (gptQuestion != null) {
        gptSeeking();
      }
    };
    f();
  });

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
