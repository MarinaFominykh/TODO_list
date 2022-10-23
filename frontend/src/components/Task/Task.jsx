import "./Task.css";

function Task({title, priority, finish, executor, status, onClick, task}) {
    function handleEditTaskClick() {
       onClick(task) 
    }
    return (
        <tr className="task__row">
            <td className="task__cell" onClick={handleEditTaskClick}>{title}</td>
            <td className="task__cell">{priority}</td>
            <td className="task__cell">{finish}</td>
            <td className="task__cell">{executor}</td>
            <td className="task__cell">{status}</td>
        </tr>
    )
}

export default Task;
