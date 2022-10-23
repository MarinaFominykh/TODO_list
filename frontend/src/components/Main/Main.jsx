import "./Main.css";
import Task from "../Task/Task.jsx";

function Main({ tasks, onClickAddTask, onClickEditTask }) {
  return (
    <main className="main">
      <h1 className="main__title">ToDo</h1>
      <table className="task">
        <thead className="task__head">
          <tr className="task__row">
            <th className="task__cell">Заголовок</th>
            <th className="task__cell">Приоритет</th>
            <th className="task__cell">Дата окончания</th>
            <th className="task__cell">Ответственный</th>
            <th className="task__cell">Статус</th>
          </tr>
        </thead>
        <tbody className="task__body">
          {tasks.map((task) => {
            return (
              <Task
                key={task._id}
                title={task.title}
                priority={task.priority}
                finish={task.finish}
                executor={`${task.executor.name} ${task.executor.patronymic} ${task.executor.surname}`}
                status={task.status}
                onClick={onClickEditTask}
                task={task}
              />
            );
          })}
        </tbody>
      </table>
      <button className="main__add-task" onClick={onClickAddTask}>Добавить задачу</button>
    </main>
  );
}

export default Main;
