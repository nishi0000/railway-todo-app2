import axios from "axios";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signIn } from "../authSlice";
import { Header } from "../components/Header";
import { url } from "../const";
import "./signUp.scss";

export const SignUp = () => {
  const Navigate = useNavigate();//ページ遷移用関数
  const auth = useSelector((state) => state.auth.isSignIn);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");//email用state
  const [name, setName] = useState("");//ユーザーネーム用state
  const [password, setPassword] = useState("");//パスワード用state
  const [errorMessage, setErrorMessge] = useState();//エラーメッセージ用state
  const [cookies, setCookie, removeCookie] = useCookies(); // eslint-disable-line no-unused-vars
  const handleEmailChange = (e) => setEmail(e.target.value);//emailが入力されたら保存
  const handleNameChange = (e) => setName(e.target.value);//ユーザーネームが入力されたら保存
  const handlePasswordChange = (e) => setPassword(e.target.value);//パスワードが入力されたら保存

  const onSignUp = () => {//データ登録用の関数
    const data = {//オブジェクトを作って現在情報をセット
      email: email,
      name: name,
      password: password,
    };

    //urlは"https://qvg1o8w2ef.execute-api.ap-northeast-1.amazonaws.com/"    

    axios
      .post(`${url}/users`, data)//ユーザーデータを作成するURLに、dataオブジェクトをpost
      .then((res) => {//ポストしてからの処理
        const token = res.data.token;
        dispatch(signIn());
        setCookie("token", token);
        Navigate("/");//ここでホームに飛んでる
      })
      .catch((err) => {
        setErrorMessge(`サインアップに失敗しました。 ${err}`);
      });

    if (auth) return <Navigate replace to="/" />;//もしauthがtrueならhomeに飛ばす
  };


  return (
    <div>
      <Header />
      <main className="signup">
        <h2>新規作成</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="signup-form">
          <label>メールアドレス</label>
          <br />
          <input
            type="email"
            onChange={handleEmailChange}
            className="email-input"
          />
          <br />
          <label>ユーザ名</label>
          <br />
          <input
            type="text"
            onChange={handleNameChange}
            className="name-input"
          />
          <br />
          <label>パスワード</label>
          <br />
          <input
            type="password"
            onChange={handlePasswordChange}
            className="password-input"
          />
          <br />
          <button type="button" onClick={onSignUp} className="signup-button">
            作成
          </button>
        </form>
      </main>
    </div>
  );
};
