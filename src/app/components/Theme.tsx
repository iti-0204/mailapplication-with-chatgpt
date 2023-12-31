"use client";

import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../../../firebase";
import { useAppContext } from "@/context/AppContext";

type Question = {
  id: string;
  createdAt: Timestamp;
  theme: string;
};

const Theme = () => {
  const {
    myTodayQuestion,
    setMyTodayQuestion,
    userId,
    myDocId,
    myQuestionId,
    setMyQuestionId,
    todayAnswer,
    setTodayAnswer,
  } = useAppContext();

  const [inputAnswer, setInputAnswer] = useState<string>("");

  const sendAnswer = async () => {
    console.log("送りました");
    if (!inputAnswer) {
      alert("入力してください。");
    }
    console.log(myQuestionId);
    if (inputAnswer && myQuestionId) {
      console.log(myQuestionId);
      const questionRef = collection(db, "problems", myQuestionId, "answers");
      await addDoc(questionRef, {
        createdAt: serverTimestamp(),
        text: inputAnswer,
        userId: userId,
      });
    }
    if (myDocId) {
      const docRef = doc(db, "userInfos", myDocId);
      updateDoc(docRef, {
        todayAnswer: inputAnswer,
      });
      setTodayAnswer(inputAnswer);
    }
  };

  useEffect(() => {
    const fetchProblem = async () => {
      // もしAppContext.tsxで、ユーザー情報を取得した結果、本日のお題が""だった時、
      // 以下の処理で本日のお題を設定。
      if (myTodayQuestion === "") {
        // まず全ての問題をデータベースから取得
        const problemCollectionRef = collection(db, "problems");
        const q = query(problemCollectionRef);
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const newQuestion: Question[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            createdAt: doc.data().createdAt,
            theme: doc.data().theme,
          }));
          // データの中から、当日のものだけ取得
          console.log(newQuestion[1].createdAt.toDate().getDate());
          const todayQuestion = newQuestion.filter((value, index) => {
            if (value.createdAt.toDate().getDate() === new Date().getDate()) {
              return newQuestion[index];
            }
          });
          // ランダムで選択
          const todayIndex = Math.floor(Math.random() * todayQuestion.length);
          const todayTheme = todayQuestion[todayIndex].theme;
          setMyQuestionId(todayQuestion[todayIndex].id);
          // userinfosのtodayQuestionを変更
          if (myDocId) {
            console.log(todayTheme);
            const docRef = doc(db, "userInfos", myDocId);
            updateDoc(docRef, {
              todayQuestion: todayTheme,
              questionId: todayQuestion[todayIndex].id,
            });
          }
          // グローバルステートも更新
          setMyTodayQuestion(todayTheme);
          return () => {
            unsubscribe();
          };
        });
      }
    };
    fetchProblem();
  }, []);

  return (
    <div className="flex items-center flex-col bg-base-gray border-0 ">
      <h1 className="text-2xl py-5">本日のお題</h1>
      <div className="bg-white w-5/6  rounded-md flex justify-center items-center flex-col py-5 mb-10">
        <div className="w-5/6 mb-4">
          <h2 className="border-b-2 border-orange-300 text-xl inline">お題</h2>
        </div>
        <div className="bg-normal-beige border-0  w-4/5 rounded-md p-4">
          <p className="whitespace-pre-wrap">
            {myTodayQuestion?.replaceAll("\\n", "\n")}
          </p>
        </div>
      </div>
      <div className="bg-white w-5/6  rounded-md flex justify-center items-center flex-col py-5 mb-4">
        <div className="w-5/6 mb-4">
          <h2 className="border-b-2 border-orange-300 text-xl inline">
            メールを書く
          </h2>
        </div>
        {todayAnswer == null || todayAnswer == "" ? (
          <div className="w-5/6 flex flex-col items-center">
            <textarea
              name=""
              id=""
              rows={10}
              required
              className="border-2 w-full my-6"
              onChange={(e) => setInputAnswer(e.target.value)}
            ></textarea>
            <button
              className="mt-4 bg-orange-300 rounded px-4 py-2"
              onClick={() => sendAnswer()}
            >
              提出
            </button>
          </div>
        ) : (
          <div className="py-10">
            <p className="text-center">今日はすでにメールを書いています。</p>
            <p className="text-center">結果をご覧ください。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Theme;
