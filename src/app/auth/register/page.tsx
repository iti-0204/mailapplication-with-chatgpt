"use client";

// import { auth } from "@/firebase";
import { auth, db } from "../../../../firebase";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { type } from "os";
import { Input } from "postcss";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import { addDoc, collection } from "firebase/firestore";

const Register = () => {
  const [inputEmail, setInputEmail] = useState<string>("");

  const registerUserInfo = async () => {
    if (inputEmail) {
      const userInfosRef = collection(db, "userInfos");
      const auth = getAuth();
      const user = auth.currentUser;
      await addDoc(userInfosRef, {
        userId: user?.uid,
        todayQuestion: "",
        questionId: "",
        todayAnswer: "",
        yesterdayResult: "",
        lastAnswerDate: null,
      });
    }
  };

  const router = useRouter();
  type Inputs = {
    email: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        router.push("/auth/login");
        registerUserInfo();
      })
      .catch((error) => {
        // console.log(error.message);
        if (error.code === "auth/email-already-in-use") {
          alert("このメールアドレスはすでに使用されています。");
        } else {
          alert(error.message);
        }
      });
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h1 className="mb-4 text-2xl text-gray-700 font-medium">新規登録</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            {...register("email", {
              required: "メールアドレスは必須です。",
              pattern: {
                value:
                  /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
                message: "不適切なメールアドレスです",
              },
            })}
            type="text"
            className="mt-1 border-2 rounded-md w-full p-2"
            onChange={(e) => setInputEmail(e.target.value)}
          />
          {errors.email && (
            <span className="text-red-600">{errors.email.message}</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            type="password"
            {...register("password", {
              required: "パスワードは必須です。",
              minLength: {
                value: 6,
                message: "6文字以上入力してください",
              },
            })}
            className="mt-1 border-2 rounded-md w-full p-2"
          />
          {errors.password && (
            <span className="text-red-600">{errors.password.message}</span>
          )}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
            // onClick={() => registerUserInfo()}
          >
            新規登録
          </button>
        </div>
        <div className="mt-4">
          <span className="text-gray-600 text-sm">
            既にアカウントをお持ちですか？
          </span>
          <Link
            href={"/auth/login"}
            className="text-blue-500 text-sm font-bold ml-l hover:text-blue-700"
          >
            ログインページへ
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
