import "./App.css";
import { useState, useEffect, createContext } from "react";
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  Redirect,
} from "react-router-dom";

import Login from "../Login/Login.jsx";
import Main from "../Main/Main.jsx";
import Header from "../Header/Header.jsx";
import AddTaskFormPopup from "../AddTaskForm/AddTaskFormPopup.jsx";
import EditTaskFormPopup from "../EditTaskFormPopup/EditTaskFormPopup.jsx";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute.jsx";
import {
  authorize,
  getProfile,
  getTasks,
  addTask,
  renderTasksAndUsers,
  updateTask,
} from "../../utils/api.js";

import { CurrentUserContext } from "../../contexts/CurrentUserContext.jsx";
import {
  AUTH_DATA_ERROR_MESSAGE,
  SERVER_ERROR_MESSAGE,
  INVALID_TOKEN_ERROR_MESSAGE,
  INVALID_DATA_ERROR_MESSAGE,
  MISS_SUBORDINATE_MESSAGE,
} from "../../utils/errorMessages.js";

function App() {
  const history = useHistory();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [message, setMessage] = useState("");
  const [isFormAddTaskOpen, setIsFormAddTaskOpen] = useState(false);
  const [isFormEditTaskOpen, setIsFormEditTaskOpen] = useState(false);
  const [editTaskState, setEditTaskState] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);
  const [checkRight, setCheckRight] = useState(false);

  // демонстрация ошибки и таймер
  const showInfoToolTip = (error) => {
    setMessage(error);
    setTimeout(() => setMessage(""), 5000);
  };

  // авторизация
  function handleLogin({ login, password }) {
    authorize(login, password)
      .then((jwt) => {
        if (jwt.token) {
          localStorage.setItem("token", jwt.token);
          setLoggedIn(true);
          history.push("/");
        }
        showInfoToolTip(INVALID_TOKEN_ERROR_MESSAGE);
      })
      .catch((error) => {
        if (error === 400) {
          showInfoToolTip(INVALID_DATA_ERROR_MESSAGE);
        } else if (error === 401) {
          showInfoToolTip(AUTH_DATA_ERROR_MESSAGE);
        } else {
          showInfoToolTip(SERVER_ERROR_MESSAGE);
        }
      });
  }

  // проверка токена и получение данных текущего пользователя
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getProfile(token)
        .then((data) => {
          if (data) {
            setCurrentUser(data);
            setLoggedIn(true);
            history.push("/");
          }
        })
        .catch((err) => console.log(err));
    }
  }, [history, loggedIn]);

  // Получаем задачи и пользователей, записываем в стейт
  useEffect(() => {
    if (loggedIn) {
      renderTasksAndUsers()
        .then(([dataTasks, dataUsers]) => {
          setUsers(dataUsers);
          setTasks(dataTasks);
        })
        .catch((err) => console.log(err));
    }
  }, [loggedIn]);

  // Выйти из аккаунта
  const handleSignOut = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    history.push("/sign-in");
  };

  //Фильтрация пользователей по наличию подчиненных
  function filter() {
    setFilteredUsers(
      users.filter((el) => {
        return (
          el?.director?._id === currentUser._id || el?._id === currentUser._id
        );
      })
    );
  }

  // Вызываем функцию фильтрации после изменения стейта всех пользователей
  useEffect(() => {
    filter();
  }, [users]);

  // Обработчики кликов

  // клик на кнопку открытия формы добавления задачи
  function handleAddTaskClick() {
    if (filteredUsers.length <= 1) {
      setIsFormAddTaskOpen(true);
      showInfoToolTip(MISS_SUBORDINATE_MESSAGE);
    }
    setIsFormAddTaskOpen(true);
  }
  // клик на кнопку открытия формы редактирования задачи
  function handleEditTaskClick(data) {
    if (currentUser.director === data.author._id) {
      setIsDisabled(true);
      setCheckRight(true);
    }

    setEditTaskState(data);
    setIsFormEditTaskOpen(true);
  }
  // клик на кнопку закрытия попапов
  function handleClosePopupClick() {
    setIsFormAddTaskOpen(false);
    setIsFormEditTaskOpen(false);
    setIsDisabled(false);
    setCheckRight(false);
    setMessage("");
  }

  // Добавление новой задачи
  function addNewTask(data) {
    addTask(data)
      .then((newTask) => {
        // setTasks([...tasks, newTask]);
        // Необходим рефакторинг, чтобы избавиться от избыточных запросов к серверу
        getTasks().then((tasks) => {
          setTasks(tasks);
          console.log(tasks);
        });
        setIsFormAddTaskOpen(false);
      })
      .catch(console.log);
  }
  // Редактирование задачи
  function editTask(data) {
    if (currentUser.director === editTaskState.author._id) {
      const updateData = {
        title: data.title,
        description: editTaskState.description,
        finish: editTaskState.finish,
        priority: editTaskState.priority,
        status: data.status,
        executor: editTaskState.executor,
      };
      updateTask(editTaskState, updateData);
    }
    updateTask(editTaskState, data)
      .then(() => {
        // setTasks([...tasks, newTask]);
        // Необходим рефакторинг, чтобы избавиться от избыточных запросов к серверу
        getTasks().then((tasks) => {
          setTasks(tasks);
        });
        setIsFormEditTaskOpen(false);
      })
      .catch(console.log);
  }

  //Закрытие попапа клавишей ESC и снятие слушателя
  useEffect(() => {
    const closeByEscape = (e) => {
      if (e.key === "Escape") {
        handleClosePopupClick();
      }
    };
    document.addEventListener("keydown", closeByEscape);
    return () => document.removeEventListener("keydown", closeByEscape);
  }, []);

  return (
    <div className="App">
      <CurrentUserContext.Provider value={currentUser}>
        <Switch>
          <ProtectedRoute exact path="/" loggedIn={loggedIn}>
            <Header signOut={handleSignOut} />
            <Main
              tasks={tasks}
              onClickAddTask={handleAddTaskClick}
              onClickEditTask={handleEditTaskClick}
              users={filteredUsers}
              allusers={users}
              isLoggedIn={loggedIn}
            ></Main>
          </ProtectedRoute>

          <Route path="/sign-in">
            <Login onLogin={handleLogin} message={message} />
          </Route>
          <Route>
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
          </Route>
        </Switch>
        <AddTaskFormPopup
          isOpen={isFormAddTaskOpen}
          onAddTask={addNewTask}
          users={filteredUsers}
          onClick={handleClosePopupClick}
          message={message}
        />
        <EditTaskFormPopup
          isOpen={isFormEditTaskOpen}
          onEditTask={editTask}
          onClick={handleClosePopupClick}
          users={filteredUsers}
          message={message}
          isDisabled={isDisabled}
          checkRight={checkRight}
        />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
