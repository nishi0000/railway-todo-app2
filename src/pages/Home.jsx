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
  const [update, setUpdate] = useState(); // 画面更新用ステート
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

  useEffect(() => {
    // 画面更新用関数
    const timer = setInterval(() => {
      setUpdate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [update]);

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

  const onKeyDownHandleSelectList = (e, key, id) => {
    if (e.keyCode === 13) {
      handleSelectList(id);
    } else if (e.keyCode === 37) {
      if (key === 0) {
        document.getElementById(`tab${lists.length - 1}`).focus();
      } else {
        document.getElementById(`tab${key - 1}`).focus();
      }
    } else if (e.keyCode === 39) {
      if (key === lists.length - 1) {
        document.getElementById(`tab0`).focus();
      } else {
        document.getElementById(`tab${key + 1}`).focus();
      }
    }
  };

  const onCheangeHandleSelectList = () => {
    const id = document.getElementById("list-tab-sp").value;
    console.log(id);
    handleSelectList(id);
  };

  return (
    <div>
      <Header />
      <main className="taskList">
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
          <div className="list-tab-sp-container">
            <select
              id="list-tab-sp"
              onChange={() => {
                onCheangeHandleSelectList();
              }}
            >
              {lists.map((list) => {
                return (
                  <option value={list.id} key={list.id}>
                    {list.title}
                  </option>
                );
              })}
            </select>
          </div>

          <ul className="list-tab" role="tablist">
            {lists.map((list, key) => {
              const isActive = list.id === selectListId;
              return (
                  <li
                    key={key}
                    id={`tab${key}`}
                    className={`list-tab-item ${isActive ? "active" : ""}`}
                    onClick={() => handleSelectList(list.id)}
                    onKeyDown={(e) =>
                      onKeyDownHandleSelectList(e, key, list.id)
                    }
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={selectListId}
                    tabIndex={isActive ? "-1" : "0"}
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

const Tasks = (props) => {
  const { tasks, selectListId, isDoneDisplay } = props;
  
  const dateConversion = (date) => {
    return new Date(
      new Date(date).getTime() + new Date(date).getTimezoneOffset() * 60 * 1000,
    );
  };

  const timeConversion = (limit) => {
    return [
      limit.getFullYear(),
      limit.getMonth() + 1,
      limit.getDate(),
      limit.getHours(),
      limit.getMinutes(),
    ];
    } 

  if (tasks === null) return <></>;

  if (isDoneDisplay === "done") {
    return (
      <ul>
        {tasks
          .filter((task) => {
            return task.done === true;
          })
          .map((task, key) => {
            const limit = dateConversion(task.limit);

            const [year, month, date, hours, minutes] = timeConversion(limit);

            tasks.sort(
              (a, b) =>
                new Date(b.limit).getTime() - new Date(a.limit).getTime(),
            ); // ソート機能追加

            return (
              <li
                key={key}
                role="tabpanel"
                id={selectListId}
                className="task-item"
              >
                <Link
                  to={`/lists/${selectListId}/tasks/${task.id}`}
                  className="task-item-link"
                >
                  {task.title}
                  <br />
                  {`タスク完了日:${year}/${month}/${date} `}
                  {hours < 10 ? `0${hours}:` : `${hours}:`}
                  {minutes < 10 ? `0${minutes}` : `${minutes}`}
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
      {tasks
        .filter((task) => {
          return task.done === false;
        })
        .map((task, key) => {
          const limit = dateConversion(task.limit);

          const limitDate = limit.getTime();
          const loadDate = new Date().getTime();
          const limitTime = limitDate - loadDate;

          const [year, month, date, hours, minutes] = timeConversion(limit);

          const remainingTime = [
            Math.trunc(limitTime / 24 / 60 / 60 / 1000),
            Math.trunc((limitTime / 60 / 60 / 1000) % 24),
            Math.trunc((limitTime / 60 / 1000) % 60),
            Math.trunc((limitTime / 1000) % 60),
          ];

          const [
            remainingDate,
            remainingHours,
            remainingMinutes,
            remainingSeconds,
          ] = remainingTime;

          tasks.sort(
            (a, b) => new Date(a.limit).getTime() - new Date(b.limit).getTime(),
          ); // ソート機能追加

          return (
            <li
              key={key}
              className="task-item"
              role="tabpanel"
              id={selectListId}
            >
              <Link
                to={`/lists/${selectListId}/tasks/${task.id}`}
                className="task-item-link"
              >
                {task.title}
                <br />
                {`達成期限:${year}/${month}/${date} `}
                {hours < 10 ? `0${hours}:` : `${hours}:`}
                {minutes < 10 ? `0${minutes}` : `${minutes}`}
                {loadDate > limitDate ? (
                  <p>期限切れ</p>
                ) : (
                  <p>
                    {`残り時間:`}
                    {remainingDate > 0 ? `${remainingDate}日` : ``}
                    {remainingHours > 0 ? `${remainingHours}時間` : ``}
                    {remainingMinutes > 0 ? `${remainingMinutes}分` : ``}
                    {`${remainingSeconds}秒`}
                  </p>
                )}
                {task.done ? "完了" : "未完了"}
              </Link>
            </li>
          );
        })}
    </ul>
  );
};
