import "./App.css";
import { useState, useEffect } from "react";
import { Route, Switch, useHistory, useLocation,} from "react-router-dom";
import Login from "../Login/Login.jsx";
import Main from "../Main/Main.jsx";
import { authorize, getProfile, getTasks } from "../../utils/api.js";

function App() {
  const history = useHistory();
  let location = useLocation();
  const [tasks, setTasks] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  // авторизация
  function handleLogin({ login, password }) {
    authorize(login, password)
      .then((jwt) => {
        if (jwt.token) {
          localStorage.setItem("token", jwt.token);
          setLoggedIn(true);
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
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
    }};

  useEffect(() => {
    getTasks()
      .then((tasks) => {
        setTasks(tasks);
        console.log(tasks);
      })
      .catch(console.log());
  }, []);

  useEffect(() => {
    checkToken();
  }, []);
  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <Main tasks={tasks}></Main>
        </Route>
        <Route path="/sign-in">
          <Login onLogin={handleLogin} />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
