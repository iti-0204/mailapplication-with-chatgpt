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
import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
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
};

const defaultContextData = {
  user: null,
  userId: null,
  setUser: () => {},
  myTodayQuestion: null,
  setMyTodayQuestion: () => {},
  myDocId: null,
  setMyDocId: () => {},
};

type datalist = {
  docId: string;
  id: string;
  todayQuestion: string;
};

const AppContext = createContext<AppContextType>(defaultContextData);

export function AppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [myTodayQuestion, setMyTodayQuestion] = useState<string | null>(null);
  const [myDocId, setMyDocId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (newUser) => {
      setUser(newUser);
      setUserId(newUser ? newUser.uid : null);
      const fireStorePostData = collection(db, "userInfos");

      // ログイン後に、MyTodayQuestionに、userInfosのtodayQuestionを入れる。
      const getdocs = getDocs(fireStorePostData).then((snapShot) => {
        const datalist: datalist[] = snapShot.docs.map((doc) => ({
          docId: doc.id,
          id: doc.data().userId,
          todayQuestion: doc.data().todayQuestion,
        }));
        if (newUser) {
          datalist.forEach((element) => {
            if (element.id === newUser.uid) {
              setMyTodayQuestion(element.todayQuestion);
              setMyDocId(element.docId);
            }
          });
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
