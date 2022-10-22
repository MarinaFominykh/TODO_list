import "./Popup.css";

function Popup({ isOpen }) {
  return <aside className={`popup ${isOpen && "popup_opened"}`}>
    <button className="popup__close"></button>
  </aside>;
}

export default Popup;
