import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Header } from "../components/Header";
import { url } from "../const";
import "./home.scss";

export const Home = () => {
  const [isDoneDisplay, setIsDoneDisplay] = useState("todo"); // todo->未完了 done->完了
  const [lists, setLists] = useState([]);
  const [selectListId, setSelectListId] = useState();
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [cookies] = useCookies();
  const handleIsDoneDisplayChange = (e) => setIsDoneDisplay(e.target.value);

  useEffect(() => {
    axios
      .get(`${url}/lists`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setLists(res.data);
      })
      .catch((err) => {
        setErrorMessage(`リストの取得に失敗しました。${err}`);
      });
  }, []);

  useEffect(() => {
    const listId = lists[0]?.id;
    if (typeof listId !== "undefined") {
      setSelectListId(listId);
      axios
        .get(`${url}/lists/${listId}/tasks`, {
          headers: {
            authorization: `Bearer ${cookies.token}`,
          },
        })
        .then((res) => {
          setTasks(res.data.tasks);
        })
        .catch((err) => {
          setErrorMessage(`タスクの取得に失敗しました。${err}`);
        });
    }
  }, [lists]);

  // ***
  // 参考URLhttps://www.webcreatorbox.com/tech/react-analogue-clock

  // setInterval で作成されたタイマーは、clearInterval 関数が呼び出されるまで実行されます。
  // useEffect ではクリーンアップのための機能として、コンポーネントが再レンダリングされる直前などに実行したい処理を、
  // 戻り値として指定できるようです。
  // ということで、コンポーネントがアンマウントされると、clearInterval を使用してタイマーを停止してみます。

  const [date, setDate] = useState(); // eslint-disable-line no-unused-vars

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date().getTime());
    }, 1000);

    console.log(date);
    return () => clearInterval(timer);
  }, [date]);

  // ***

  const handleSelectList = (id) => {
    setSelectListId(id);
    axios
      .get(`${url}/lists/${id}/tasks`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setTasks(res.data.tasks);
      })
      .catch((err) => {
        setErrorMessage(`タスクの取得に失敗しました。${err}`);
      });
  };

  return (
    <div>
      <Header />
      <main className="taskList">
        <p>{date}</p>
        <p className="error-message">{errorMessage}</p>
        <div>
          <div className="list-header">
            <h2>リスト一覧</h2>
            <div className="list-menu">
              <p>
                <Link to="/list/new">リスト新規作成</Link>
              </p>
              <p>
                <Link to={`/lists/${selectListId}/edit`}>
                  選択中のリストを編集
                </Link>
              </p>
            </div>
          </div>
          <ul className="list-tab">
            {lists.map((list, key) => {
              const isActive = list.id === selectListId;
              return (
                <li
                  key={key}
                  className={`list-tab-item ${isActive ? "active" : ""}`}
                  onClick={() => handleSelectList(list.id)}
                >
                  {list.title}
                </li>
              );
            })}
          </ul>
          <div className="tasks">
            <div className="tasks-header">
              <h2>タスク一覧</h2>
              <Link to="/task/new">タスク新規作成</Link>
            </div>
            <div className="display-select-wrapper">
              <select
                onChange={handleIsDoneDisplayChange}
                className="display-select"
              >
                <option value="todo">未完了</option>
                <option value="done">完了</option>
              </select>
            </div>
            <Tasks
              tasks={tasks}
              selectListId={selectListId}
              isDoneDisplay={isDoneDisplay}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

// 表示するタスク
const Tasks = (props) => {
  const { tasks, selectListId, isDoneDisplay } = props;
  if (tasks === null) return <></>;

  if (isDoneDisplay === "done") {
    return (
      <ul>
        {tasks
          .filter((task) => {
            return task.done === true;
          })
          .map((task, key) => {
            return (
              <li key={key} className="task-item">
                <Link
                  to={`/lists/${selectListId}/tasks/${task.id}`}
                  className="task-item-link"
                >
                  {task.title}
                  <br />
                  {task.done ? "完了" : "未完了"}
                </Link>
              </li>
            );
          })}
      </ul>
    );
  }

  return (
    <ul>
      {
      tasks
        .filter((task) => {
          return task.done === false;
        })
        .map((task, key) => {
          const limit = new Date(task.limit);
          const limitDate = limit.getTime();
          const loadDate = new Date().getTime();
          const limitTime = limitDate - loadDate;

          const time = [
            limit.getFullYear(),
            limit.getMonth() + 1,
            limit.getDate(),
            limit.getHours(),
            limit.getMinutes(),
          ];
          const [year, month, date, hours, minutes] = time;
          // const year = limit.getFullYear();
          // const month = limit.getMonth() + 1;
          // const date = limit.getDate();
          // const hours = limit.getHours();
          // const minutes = limit.getMinutes();

          // console.log(loadDate);
          // console.log(limitDate);
          // console.log(year);

          return (
            <li key={key} className="task-item">
              <Link
                to={`/lists/${selectListId}/tasks/${task.id}`}
                className="task-item-link"
              >
                {task.title}
                <br />
                {`${year}年${month}月${date}日${hours}時${minutes}分までに終わらせましょう！`}
                {loadDate > limitDate ? (
                  <p>期限切れです。</p>
                ) : (
                  <p>{`残り時間は${Math.trunc(
                    limitTime / 24 / 60 / 60 / 1000,
                  )}日${Math.trunc(
                    (limitTime / 60 / 60 / 1000) % 24,
                  )}時間${Math.trunc(
                    (limitTime / 60 / 1000) % 60,
                  )}分です。`}</p>
                )}
                {task.done ? "完了" : "未完了"}
              </Link>
            </li>
          );
        })}
    </ul>
  );
};
