"use client";

import {
  Timestamp,
  collection,
  doc,
  onSnapshot,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";

type Question = {
  id: string;
  createdAt: Timestamp;
  theme: string;
};

const Theme = () => {
  const [question, setQuestion] = useState<Question[]>([]);
  useEffect(() => {
    const fetchProblem = async () => {
      const problemCollectionRef = collection(db, "problems");
      const q = query(problemCollectionRef);
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newQuestion: Question[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          createdAt: doc.data().createdAt,
          theme: doc.data().theme,
        }));
        setQuestion(newQuestion);
        console.log(newQuestion[1]);
      });
    };
    fetchProblem();
  }, []);

  return (
    <div className="flex items-center flex-col bg-base-gray border-0 ">
      <h1 className="text-2xl py-5">本日のお題</h1>
      <div className="bg-white w-5/6  rounded-md flex justify-center items-center flex-col py-5 mb-10">
        <div className="w-5/6 mb-4">
          <h2 className="border-b-2 border-orange-400 text-xl inline">お題</h2>
        </div>
        <div className="bg-normal-beige border-0 h-40 w-4/5 rounded-md">
          <p>
            ここにお題の文章が入ります・・・・・・・ ・・・
            <br />
            brで改行
          </p>
        </div>
      </div>
      <div className="bg-white w-5/6  rounded-md flex justify-center items-center flex-col py-5">
        <div className="w-5/6 mb-4">
          <h2 className="border-b-2 border-orange-400 text-xl inline">
            メールを書く
          </h2>
        </div>
        <textarea name="" id="" rows={10} className="border-2 w-4/5"></textarea>
      </div>
    </div>
  );
};

export default Theme;
