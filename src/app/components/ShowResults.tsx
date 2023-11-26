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
  console.log(afterOnlyMail);

  const samplequestion =
    "「佐藤様\nこんにちは。株式会社メイルズ・採用担当の川島と申します。\n企業説明会へのご参加、ありがとうございました。\nぜひ、山田様と一次面接にてお話をしたいと思っています。\nご都合の良い日時を、返信にてご連絡をお願いいたします。\n山田様からのご連絡をお待ちしております。\n株式会社メイルズ・川島\n」";
  console.log(samplequestion);

  if (afterOnlyMail === samplequestion) {
    console.log("同じん");
  }

  let togptQuestion =
    "あなたにはアドバイスを提示してほしいです。\n私にメールが届きました。そのメールの具体的な内容を次に記します。\n「佐藤様\nこんにちは。株式会社メイルズ・採用担当の川島と申します。\n企業説明会へのご参加、ありがとうございました。\nぜひ、山田様と一次面接にてお話をしたいと思っています。\nご都合の良い日時を、返信にてご連絡をお願いいたします。\n山田様からのご連絡をお待ちしております。\n株式会社メイルズ・川島\n」\n以上がメールの具体的な内容です。それに対し次の複数の返信を考えました。\n・こんにちは。ご連絡ありがとうございます。面接ですが、4月2日にしたいと思っています。お願いします。チャット大学・佐藤\n・こんにちは。チャット大学の佐藤です。面接の日程ですが、4月2日に面接をさせていただきたいです。もし4月2日が都合が悪いのであれば、別途ご連絡させていだだきます。また、面接の際の持ち物、注意事項などがあればいただきたいです。チャット大学・佐藤\nこれらの返信に対しそれぞれアドバイスを提示し、順位をつけてください";
  // let togptQuestion =
  //   "以下の[回答のメール文]をコメントと順位付けをしてほしいです。順位付けの基準については、ビジネスメールとしてより相応しいものには、高い順位を与えるという基準でお願いします。";

  let togptQuestion2 =
    "あなたにはアドバイスを提示してほしいです。\n私にメールが届きました。そのメールの具体的な内容を次に記します。\n";

  if (afterOnlyMail) {
    // togptQuestion.concat("お題\n", myTodayQuestion);
    togptQuestion2 =
      togptQuestion2 +
      afterOnlyMail +
      "\nそれに対し次の複数の返信を考えました。";
  }
  const gptsampleQ = async () => {
    togptQuestion2 +=
      "愛アイアイアイアイアイアイアイアイアイアイアイあいあいあいあいあいあい";
  };
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
          allAnswers.forEach((value, index) => {
            if (index < 2) {
              const afterDelete2 = value.text?.replace(/\n/g, "");
              togptQuestion2 =
                // togptQuestion + value.userId + "\n" + value.text + "\n";
                `${togptQuestion2} \n「川島様\n${afterDelete2}」`;
            }
          });
          togptQuestion2 =
            togptQuestion2 +
            "\nこれらに対しそれぞれアドバイスを提示し、順位をつけてください。メールの内容はすでに記載したのでそれをもとに実行してください";
          console.log(togptQuestion2);
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
    // const gpt3Response2 = await openai.chat.completions.create({
    //   messages: [{ role: "user", content: togptQuestion2 }],
    //   model: "gpt-3.5-turbo",
    // });
    const botResponse = gpt3Response.choices[0].message.content;
    console.log(botResponse);
    if (botResponse?.includes("順位") && yesterdayResult == null) {
      setYesterdayResult(botResponse);
      console.log("入れた");
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

  console.log(yesterdayResult);

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
