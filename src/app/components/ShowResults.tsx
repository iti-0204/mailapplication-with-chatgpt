import React from "react";
import Rank from "./Rank";
import Comment from "./Comment";

const ShowResults = () => {

  // ここからchatgptの処理
  // もし昨日問題を回答していたら、
  // ----まず問題のidから、その問題の回答を全て取得する

  // その問題の回答を集める
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
