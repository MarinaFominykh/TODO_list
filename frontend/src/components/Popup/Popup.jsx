import { Children } from "react";
import "./Popup.css";

function Popup({ isOpen, children }) {
  return (
    <aside className={`popup ${isOpen && "popup_opened"}`}>
      
      <>{children}</>
    </aside>
  );
}

export default Popup;
