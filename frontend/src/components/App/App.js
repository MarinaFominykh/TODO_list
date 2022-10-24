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
  getUsers,
  addTask,
  updateTask,
} from "../../utils/api.js";

import {CurrentUserContext} from "../../contexts/CurrentUserContext.jsx"
import {
  CONFLICT_LOGIN_MESSAGE,
  AUTH_DATA_ERROR_MESSAGE,
  SERVER_ERROR_MESSAGE,
  INVALID_TOKEN_ERROR_MESSAGE,
  INVALID_DATA_ERROR_MESSAGE,
  MISS_SUBORDINATE_MESSAGE,
} from "../../utils/errorMessages.js";

function App() {
  const history = useHistory();
  let location = useLocation();
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

  // Текущая дата
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();
  today = mm + "." + dd + "." + yyyy;

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

  // проверка токена
  function checkToken() {
    const token = localStorage.getItem("token");
    if (token) {
      getProfile(token)
        .then((res) => {
          if (res) {
            setLoggedIn(true);
            setCurrentUser(res);
            history.push(location);
          }
        })
        .catch((err) => {
          console.log(err);
          localStorage.removeItem("token");
          history.push("/");
        });
    }
  }

  // Выйти из аккаунта
  const handleSignOut = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setCurrentUser(null);
    setTasks([]);
    setUsers([]);
    setMessage("");
    history.push("/sign-in");
  };

  // Обработчики кликов

  function handleAddTaskClick() {
    if (filteredUsers.length <= 1) {
      setIsFormAddTaskOpen(true);
      showInfoToolTip(MISS_SUBORDINATE_MESSAGE);
    }
    setIsFormAddTaskOpen(true);
  }

  function handleEditTaskClick(data) {
    if (currentUser.director === data.author._id) {
      setIsDisabled(true);
      setCheckRight(true);
    }

    setEditTaskState(data);
    setIsFormEditTaskOpen(true);
  }

  function handleClosePopupClick() {
    setIsFormAddTaskOpen(false);
    setIsFormEditTaskOpen(false);
    setIsDisabled(false);
    setCheckRight(false);
    setMessage("");
  }
  function addNewTask(data) {
    addTask(data)
      .then((newTask) => {
        // setTasks([...tasks, newTask]);
        // Необходим рефакторинг, чтобы избавиться от избыточных запросов к серверу
        getTasks().then((tasks) => {
          setTasks(tasks);
          console.log(tasks)
        });
        setIsFormAddTaskOpen(false);
      })
      .catch(console.log);
  }

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

  //Получаем задачи с сервера, только если пользователь залогинен
  useEffect(() => {
    if (loggedIn) {
      getTasks()
        .then((tasks) => {
          setTasks(tasks);
        })
        .catch(console.log());
    }
  }, [loggedIn]);

  // Функция запроса к серверу за пользователями
  function fetchUsers() {
    getUsers()
      .then((users) => {
        setUsers(users);
      })
      .catch(console.log());
  }

  //Фильтрация пользователей по наличию подчиненных
  function filter() {
    setFilteredUsers(
      users.filter((el) => {
        return (
          el?.director?._id === currentUser._id || el._id === currentUser._id
        );
      })
    );
  }

  // Вызываем функцию фильтрации после изменения стейта всех пользователей
  useEffect(() => {
    filter();
  }, [users]);

  // Получаем пользователей с сервера, только если пользователь залогинен
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUsers();
    }
  }, [loggedIn]);

  // Получаем данные текущего пользователя, записываем в контекст
  useEffect(() => {
    if (loggedIn) {
      getProfile()
        .then((user) => {
          setCurrentUser(user);
        })
        .catch(console.log());
    }
  }, [loggedIn]);

  // Проверка токена после того, как пользователь залогинился
  useEffect(() => {
    checkToken();
  }, [loggedIn]);

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
      <Header signOut={handleSignOut} />
      <CurrentUserContext.Provider value={currentUser}>
        <Switch>
          <ProtectedRoute exact path="/" loggedIn={loggedIn}>
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
          // users={users}
          users={filteredUsers}
          onClick={handleClosePopupClick}
          message={message}
        />
        <EditTaskFormPopup
          isOpen={isFormEditTaskOpen}
          onEditTask={editTask}
          onClick={handleClosePopupClick}
          // users={users}
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
