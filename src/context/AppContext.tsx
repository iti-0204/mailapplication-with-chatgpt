"use client";

import { User, onAuthStateChanged } from "firebase/auth";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth, db } from "../../firebase";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { get } from "firebase/database";

type AppProviderProps = {
  children: ReactNode;
};

type AppContextType = {
  user: User | null;
  userId: string | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  myTodayQuestion: string | null;
  setMyTodayQuestion: React.Dispatch<React.SetStateAction<string | null>>;
  myDocId: string | null;
  setMyDocId: React.Dispatch<React.SetStateAction<string | null>>;
  myQuestionId: string | null;
  setMyQuestionId: React.Dispatch<React.SetStateAction<string | null>>;
  pages: string | null;
  setPages: React.Dispatch<React.SetStateAction<string | null>>;
  todayAnswer: string | null;
  setTodayAnswer: React.Dispatch<React.SetStateAction<string | null>>;
  yesterdayResult: string | null;
  setYesterdayResult: React.Dispatch<React.SetStateAction<string | null>>;
  gptQuestion: string | null;
  setGptQuestion: React.Dispatch<React.SetStateAction<string | null>>;
  lastAnswerDate: Timestamp | null;
  setLastAnswerDate: React.Dispatch<React.SetStateAction<Timestamp | null>>;
};

const defaultContextData = {
  user: null,
  userId: null,
  setUser: () => {},
  myTodayQuestion: null,
  setMyTodayQuestion: () => {},
  myDocId: null,
  setMyDocId: () => {},
  myQuestionId: null,
  setMyQuestionId: () => {},
  pages: null,
  setPages: () => {},
  todayAnswer: null,
  setTodayAnswer: () => {},
  yesterdayResult: null,
  setYesterdayResult: () => {},
  gptQuestion: null,
  setGptQuestion: () => {},
  lastAnswerDate: null,
  setLastAnswerDate: () => {},
};

type datalist = {
  docId: string;
  id: string;
  todayQuestion: string;
  questionId: string;
  todayAnswer: string;
  lastAnswerDate: Timestamp;
  // yesterdayResult: string;
};

const AppContext = createContext<AppContextType>(defaultContextData);

export function AppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [myTodayQuestion, setMyTodayQuestion] = useState<string | null>(null);
  // userinfosのid
  const [myDocId, setMyDocId] = useState<string | null>(null);
  const [myQuestionId, setMyQuestionId] = useState<string | null>(null);
  const [pages, setPages] = useState<string | null>(null);
  const [todayAnswer, setTodayAnswer] = useState<string | null>(null);
  const [yesterdayResult, setYesterdayResult] = useState<string | null>(null);
  const [gptQuestion, setGptQuestion] = useState<string | null>(null);
  const [lastAnswerDate, setLastAnswerDate] = useState<Timestamp | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (newUser) => {
      setUser(newUser);
      setUserId(newUser ? newUser.uid : null);
      const fireStorePostData = collection(db, "userInfos");

      // ログイン後に、MyTodayQuestionに、userInfosのtodayQuestionを入れる。
      const getdocs = getDocs(fireStorePostData).then((snapShot) => {
        const datalist: datalist[] = snapShot.docs.map((doc) => ({
          docId: doc.id,
          questionId: doc.data().questionId,
          id: doc.data().userId,
          todayQuestion: doc.data().todayQuestion,
          todayAnswer: doc.data().todayAnswer,
          lastAnswerDate: doc.data().lastAnswerDate,
          // yesterdayResult:doc.data().yestedayResult
        }));
        if (newUser) {
          datalist.forEach((element) => {
            if (element.id === newUser.uid) {
              setMyTodayQuestion(element.todayQuestion);
              setMyQuestionId(element.questionId);
              setMyDocId(element.docId);
              setTodayAnswer(element.todayAnswer);
              setLastAnswerDate(element.lastAnswerDate);
            }
          });
        }
        if (lastAnswerDate) {
          if (lastAnswerDate.toDate().getDate() === new Date().getDate() - 1) {
            // 消す
            setMyTodayQuestion("");
            setMyQuestionId("");
            setTodayAnswer("");
            setLastAnswerDate(null);
            if (myDocId) {
              const docRef = doc(db, "userInfos", myDocId);
              updateDoc(docRef, {
                questionId: "",
                todayAnswer: "",
                todayQuestion: "",
              });
            }
          }
        }
      });
    });

    return () => {
      unsubscribe();
    };
  });

  return (
    <AppContext.Provider
      value={{
        user,
        userId,
        setUser,
        myTodayQuestion,
        setMyTodayQuestion,
        myDocId,
        setMyDocId,
        myQuestionId,
        setMyQuestionId,
        pages,
        setPages,
        todayAnswer,
        setTodayAnswer,
        yesterdayResult,
        setYesterdayResult,
        gptQuestion,
        setGptQuestion,
        lastAnswerDate,
        setLastAnswerDate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
