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
  const [date, setDate] = useState(); // 画面更新用ステート
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
      setDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [date]);

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


  const [state,setState] = useState({
    tab: 'panel1',
  })

  const hantei = (e) => {
    console.log(e.currentTarget.getAttribute("aria-controls"));

  const element = e.currentTarget;

  // aria-controls 属性の値を取得
  const tabState = element.getAttribute('aria-controls');

  // プロパティーを更新
  setState({
    tab: tabState,
  });
  };

  return (

      <div class="tabs">
        <ul role="tablist" aria-label="Sample Tabs">
          <li role="tab" aria-selected={state.tab === 'panel-1'} aria-controls="panel-1" id="tab-1" tabindex="0" onClick={hantei}>
            a選択中
          </li>
          <li
            role="tab"
            aria-controls="panel-2"
            id="tab-2"
            tabindex="0"
            onClick={hantei}
            aria-selected={state.tab === 'panel-2'}
          >
            b
          </li>
          <li
            role="tab"
            aria-controls="panel-3"
            id="tab-3"
            tabindex="0"
            onClick={hantei}
            aria-selected={state.tab === 'panel-3'}
          >
            c
          </li>
        </ul>

    <div role="tabpanel"
        id="panel-1"
        aria-hidden={state.tab !== 'panel-1'}>
    カベルネ・ソーヴィニョンはブドウの一品種。赤ワインの中でも渋くて重い味わいが特徴です。
  </div>
  <div role="tabpanel"
        id="panel-2"
        aria-hidden={state.tab !== 'panel-2'}>
    メルローはブドウの一品種。味はカベルネ・ソーヴィニョンほど酸味やタンニンは強くなく、芳醇でまろやかで繊細な味わいです。
  </div>
  <div role="tabpanel"
        id="panel-3"
        aria-hidden={state.tab !== 'panel-3'}>
    ピノ・ノワールはブドウの一品種。カベルネ・ソーヴィニョンと対照的で比較的軽口な味わいです。
  </div>




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
          <ul className="list-tab" role="tablist">
            {lists.map((list, key) => {
              const isActive = list.id === selectListId; // リストIDとセレクトリストIDが一致してたらtrueを返す
              return (
                <li
                  key={key}
                  className={`list-tab-item ${isActive ? "active" : ""}`}
                  onClick={() => handleSelectList(list.id)}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={selectListId}
                  tabindex="0"
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
      new Date(date).getTime() + new Date(date).getTimezoneOffset() * 60 * 1000
    );
  };

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

            const time = [
              limit.getFullYear(),
              limit.getMonth() + 1,
              limit.getDate(),
              limit.getHours(),
              limit.getMinutes(),
            ];
            const [year, month, date, hours, minutes] = time;

            tasks.sort(
              (a, b) =>
                new Date(b.limit).getTime() - new Date(a.limit).getTime()
            ); // ソート機能追加

            return (
              <li key={key} role="tabpanel" id={selectListId} className="task-item">
                <Link
                  to={`/lists/${selectListId}/tasks/${task.id}`}
                  className="task-item-link"
                >
                  {task.title}
                  <br />
                  {`タスク完了日時：${year}年${month}月${date}日${hours}時${minutes}分`}
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

          const time = [
            limit.getFullYear(),
            limit.getMonth() + 1,
            limit.getDate(),
            limit.getHours(),
            limit.getMinutes(),
          ];
          const [year, month, date, hours, minutes] = time;

          tasks.sort(
            (a, b) => new Date(a.limit).getTime() - new Date(b.limit).getTime()
          ); // ソート機能追加

          return (
            <li key={key} className="task-item" role="tabpanel" id={selectListId}>
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
                    limitTime / 24 / 60 / 60 / 1000
                  )}日
                  ${Math.trunc(
                    (limitTime / 60 / 60 / 1000) % 24
                  )}時間${Math.trunc(
                    (limitTime / 60 / 1000) % 60
                  )}分${Math.trunc((limitTime / 1000) % 60)}秒です。`}</p>
                )}
                {task.done ? "完了" : "未完了"}
              </Link>
            </li>
          );
        })}
    </ul>
  );
};
