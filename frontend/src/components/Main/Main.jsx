import { useState, useEffect, useContext } from "react";
import "./Main.css";
import Task from "../Task/Task.jsx";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import moment from "moment";
function Main({ tasks, onClickAddTask, onClickEditTask, users, allusers }) {
  const currentUser = useContext(CurrentUserContext);
  const [filteredTasks, setfilteredTasks] = useState(tasks);
  const [isPeriodChecked, setIsPeriodChecked] = useState("");
  const [isExecutorChecked, setIsExecutorChecked] = useState("");
  const [isDirector, setIsDirector] = useState(false);

  function handlePeriodInputChange(e) {
    setIsPeriodChecked(e.target.value);
  }

  function handleExecutorInputChange(e) {
    setIsExecutorChecked(e.target.value);
  }

  // Фильтрация задач по исполнителю
  function filterExecutorTasks() {
    return setfilteredTasks(
      tasks.filter((task) => {
        return task.executor._id === isExecutorChecked;
      })
    );
  }

  // Фильтрация задач по дате завершения
  function filterTasks() {
    if (isPeriodChecked === "на сегодня") {
      const array = tasks.filter((task) => {
        return (
          moment(task.finish).format("DD.MM.YYYY").toString() ===
            moment().format("DD.MM.YYYY").toString() &&
          task.executor._id === currentUser._id
        );
      });

      return setfilteredTasks(array);
    } else if (isPeriodChecked === "на неделю") {
      const array = tasks.filter((task) => {
        return (
          moment(task.finish).isBefore(moment().add("days", 7)) &&
          task.executor._id === currentUser._id
        );
      });

      return setfilteredTasks(array);
    } else if (isPeriodChecked === "на будущее") {
      const array = tasks.filter((task) => {
        return (
          moment(task.finish).isAfter(moment().add("days", 7)) &&
          task.executor._id === currentUser._id
        );
      });

      return setfilteredTasks(array);
    }
    return;
  }

  // Проверяем, есть ли у текущего пользователя подчиненные
  function checkSubordinate() {
    const array = allusers.filter((el) => {
      return el?.director?._id === currentUser._id;
    });
    return array.length !== 0 && setIsDirector(true);
  }

  useEffect(() => {
    filterTasks();
  }, [isPeriodChecked]);

  useEffect(() => {
    filterExecutorTasks();
  }, [isExecutorChecked]);

  useEffect(() => {
    checkSubordinate();
  }, [users]);

  console.log(isDirector);
  return (
    <main className="main">
      <h1 className="main__title">ToDo</h1>
      <div className="main-filter-container">
        <label className="main__filter-label" htmlFor="period">
          Выбрать по дате завершения
        </label>
        <select
          name="period"
          id="period"
          className="main__filter-input form__input"
          value={isPeriodChecked}
          onChange={handlePeriodInputChange}
        >
          <option value=""></option>
          <option value="на сегодня">на сегодня</option>
          <option value="на неделю">на неделю</option>
          <option value="на будущее">на будущее</option>
        </select>
        {isDirector && (
          <>
            <label className="main__filter-label" htmlFor="executor">
              Выбрать по исполнителю
            </label>
            <select
              name="executor"
              id="executor"
              className="main__filter-input form__input"
              value={isExecutorChecked}
              onChange={handleExecutorInputChange}
            >
              <option value=""></option>
              {users.map((user) => {
                return (
                  <option key={user._id} value={user._id}>
                    {user.surname}
                  </option>
                );
              })}
            </select>
          </>
        )}
      </div>

      <table className="task">
        <thead className="task__head">
          <tr className="task__row">
            <th className="task__cell task__cell-head">Заголовок</th>
            <th className="task__cell task__cell-head">Приоритет</th>
            <th className="task__cell task__cell-head">Дата окончания</th>
            <th className="task__cell task__cell-head">Ответственный</th>
            <th className="task__cell task__cell-head">Статус</th>
          </tr>
        </thead>
        <tbody className="task__body">
          {(isPeriodChecked || isExecutorChecked ? filteredTasks : tasks)
            .map((task) => {
              return (
                <Task
                  key={task._id}
                  title={task.title}
                  priority={task.priority}
                  finish={moment(task.finish).format("DD.MM.YYYY")}
                  executor={`${task.executor.name} ${task.executor.patronymic} ${task.executor.surname}`}
                  status={task.status}
                  onClick={onClickEditTask}
                  task={task}
                />
              );
            })
            .sort(function (a, b) {
              return moment(a.props.task?.updatedAt) <
                moment(b.props.task?.updatedAt)
                ? 1
                : -1;
            })}
        </tbody>
      </table>
      <button className="main__add-task" onClick={onClickAddTask}>
        Добавить задачу
      </button>
    </main>
  );
}

export default Main;
