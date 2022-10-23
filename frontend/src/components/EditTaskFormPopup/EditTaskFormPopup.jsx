import { useEffect } from "react";
import "./EditTaskFormPopup.css";
import Form from "../Form/Form.jsx";
import Popup from "../Popup/Popup.jsx";
import InfoTooltip from "../InfoTooltip/InfoTooltip.jsx";
import { useFormWithValidation } from "../../hooks/useFormValidation.js";
import {FORBIDDEN_ERROR_MESSAGE} from "../../utils/errorMessages.js"

function EditTaskFormPopup({ isOpen, onEditTask, users, onClick, message, isDisabled, checkRight }) {
  const { values, handleChange, errors, isValid, resetForm } =
    useFormWithValidation();

   
  useEffect(() => {
    resetForm();
  }, [isOpen, resetForm]);
  function handleSubmit(e) {
    e.preventDefault();
    onEditTask(values);
  }
  return (
    <Popup isOpen={isOpen}>
      <Form
        onSubmit={handleSubmit}
        button="Редактировать"
        title="Редактировать задачу"
        classForm="add-task__form"
        isDisabled={!isValid}
        message={message}
      >
        <div className="form__unputs-text">
          <label className="form__label" htmlFor="title">
            Наименование задачи
          </label>
          <input
            name="title"
            id="title"
            className="form__input"
            value={values.title || ""}
            onChange={handleChange}
            required ={!checkRight}
            disabled={isDisabled}
          />
          <InfoTooltip message={!checkRight ? (errors.title || "") : FORBIDDEN_ERROR_MESSAGE}></InfoTooltip>
          <label className="form__label" htmlFor="description">
            Описание задачи
          </label>
          <input
            name="description"
            id="description"
            className="form__input"
            value={values.description || ""}
            onChange={handleChange}
            disabled={isDisabled}
            required ={!checkRight}
          />
          <InfoTooltip message={!checkRight ? (errors.description || "") : FORBIDDEN_ERROR_MESSAGE}></InfoTooltip>
          <label className="form__label" htmlFor="priority">
            Приоритет
          </label>
          <select
            name="priority"
            id="priority"
            className="form__input"
            placeholder="Приоритет"
            value={values.priority || ""}
            onChange={handleChange}
            disabled={isDisabled}
            required ={!checkRight}
          >
            <option value=""></option>
            <option value="высокий">высокий</option>
            <option value="средний">средний</option>
            <option value="низкий">низкий</option>
          </select>
          <InfoTooltip message={!checkRight ? (errors.priority || "") : FORBIDDEN_ERROR_MESSAGE}></InfoTooltip>
          <label className="form__label" htmlFor="executor">
            Исполнитель
          </label>
          <select
            name="executor"
            id="executor"
            className="form__input"
            value={values.executor}
            onChange={handleChange}
            disabled={isDisabled}
            required ={!checkRight}
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
          <InfoTooltip message={!checkRight ? (errors.executor || "") : FORBIDDEN_ERROR_MESSAGE}></InfoTooltip>
          <label className="form__label" htmlFor="status">
            Статус
          </label>
          <select
            name="status"
            id="status"
            className="form__input"
            placeholder="Статус"
            value={values.status || ""}
            onChange={handleChange}
            required
          >
            <option value=""></option>
            <option value="к выполнению">к выполнению</option>
            <option value="выполняется">выполняется</option>
            <option value="выполнена">выполнена</option>
            <option value="отменена">отменена</option>
          </select>
          <InfoTooltip message={errors.status || ""}></InfoTooltip>
          <label className="form__label" htmlFor="finish">
            Дата окончания
          </label>
          <input
            name="finish"
            id="finish"
            className="form__input"
            type="date"
            placeholder="Дата окончания"
            value={values.finish || ""}
            onChange={handleChange}
            disabled={isDisabled}
            required ={!checkRight}
          ></input>
          <InfoTooltip message={!checkRight ? (errors.finish || "") : FORBIDDEN_ERROR_MESSAGE}></InfoTooltip>
        </div>
        <button
          className="form__close"
          onClick={onClick}
          type="button"
        ></button>
       
      </Form>
    </Popup>
  );
}

export default EditTaskFormPopup;
