import "./Login.css";
import { useEffect } from "react";
import Form from "../Form/Form.jsx";
import { useFormWithValidation } from "../../hooks/useFormValidation.js";
import InfoTooltip from "../InfoTooltip/InfoTooltip.jsx";
function Login({ onLogin, message }) {
  const { values, handleChange, resetForm, errors, isValid } =
    useFormWithValidation();
  useEffect(() => {
    resetForm();
  }, [resetForm]);

  function handleSubmit(e) {
    e.preventDefault();
    onLogin(values);
  }
  return (
    <section className="login">
      <Form
        onSubmit={handleSubmit}
        button="Войти"
        title="Авторизация"
        classForm="login__form"
        isDisabled={!isValid}
        message={message}
      >
        <input
          name="login"
          className="form__input"
          placeholder="Логин"
          value={values.login || ""}
          onChange={handleChange}
          required
        />
        <InfoTooltip message={errors.login || ""}></InfoTooltip>
        <input
          name="password"
          type="password"
          className="form__input"
          placeholder="Пароль"
          value={values.password || ""}
          onChange={handleChange}
          required
        />
        <InfoTooltip message={errors.password || ""}></InfoTooltip>
      </Form>
    </section>
  );
}

export default Login;
