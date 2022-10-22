import "./Login.css";
import { useEffect } from "react";
import Form from "../Form/Form.jsx";
import { useFormWithValidation } from "../../hooks/useFormValidation.js";

function Login({onLogin}) {
  const { values, handleChange, resetForm, errors, isValid } =
    useFormWithValidation();
  useEffect(() => {
    resetForm();
  }, [resetForm]);

  function handleSubmit(e) {
    e.preventDefault();
    console.log(values);
    if (!values) {
      return;
    }
    onLogin(values);
  }
  return (
    <section className="login">
      <Form
        onSubmit={handleSubmit}
        button="Войти"
        title="Авторизация"
        classForm="login__form"
      >
        <input
          name="login"
          className="form__input"
          placeholder="Логин"
          value={values.login || ""}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          className="form__input"
          placeholder="Пароль"
          value={values.password || ""}
          onChange={handleChange}
          required
        />
      </Form>
    </section>
  );
}

export default Login;
