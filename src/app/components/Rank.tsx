import { useAppContext } from "@/context/AppContext";
import React from "react";

const Rank = () => {
  const { yesterdayResult } = useAppContext();

  const resultList = [];

  let searchIndex = 0;

  let rankUser: string = "";
  let answer: string = "";
  let advice: string = "";

  // まず文章を見て、0文字目から、○位：という文字列を探す。次に、回答：という文字列を探す。
  // ここで、substring()で以上の二つを指定すると、一位のユーザーidが出る。
  //それをranklistに登録する。
  // 次に、回答：という文字列を探す。その後、アドバイス：という文字列を探す。
  if (yesterdayResult) {
    while (searchIndex != -3) {
      rankUser = yesterdayResult.substring(
        yesterdayResult.indexOf("位：", searchIndex) + 2,
        yesterdayResult.indexOf("回答：", searchIndex) - 1
      );
      searchIndex = yesterdayResult.indexOf("回答：", searchIndex) - 1;
      console.log(rankUser);
      answer = yesterdayResult.substring(
        yesterdayResult.indexOf("回答：", searchIndex) + 3,
        yesterdayResult.indexOf("アドバイス：", searchIndex)
      );
      searchIndex = yesterdayResult.indexOf("アドバイス：", searchIndex) - 6;
      console.log(answer);
      advice = yesterdayResult.substring(
        yesterdayResult.indexOf("アドバイス：", searchIndex) + 6,
        yesterdayResult.indexOf("位：", searchIndex) == -1
          ? yesterdayResult.length
          : yesterdayResult.indexOf("位：", searchIndex) - 1
      );
      searchIndex = yesterdayResult.indexOf("位：", searchIndex) - 2;
      console.log(advice);
      console.log(searchIndex);
      resultList.push({ userId: rankUser, answer: answer, advice: advice });
      console.log(resultList);
    }
  }

  return (
    <div className="bg-white w-5/6  rounded-md flex justify-center items-center flex-col py-5 mb-10">
      <div className="w-5/6 mb-4">
        <h2 className="border-b-2 border-orange-300 text-xl inline">順位</h2>
        <div className="py-4">
          {resultList.map((value, index) => (
            <div>
              <p key={index}>
                {index + 1}位：{value.userId}
              </p>
              <p key={index}>回答：{value.answer}</p>
              <p key={index}>アドバイス：{value.advice}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rank;
