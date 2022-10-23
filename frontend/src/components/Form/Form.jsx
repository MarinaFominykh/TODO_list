import "./Form.css";
import InfoTooltip from "../InfoTooltip/InfoTooltip.jsx";

function Form({ onSubmit, title, children, isDisabled, button, classForm, message }) {
  return (
    <form className={`form ${classForm}`} onSubmit={onSubmit } noValidate>
      <h2 className="form__title">{title}</h2>
      <fieldset className="form__inputs">{children}</fieldset>
      <InfoTooltip message={message} />
      <button
        type="submit"
        className="form__submit"
        value={button}
        disabled={isDisabled}
      >
        {button}
      </button>
     
    </form>
  );
}

export default Form;
