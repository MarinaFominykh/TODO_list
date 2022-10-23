import "./Header.css"

function Header({ signOut }) {
    return (
      <header className="header">
       <button className="header__signout" onClick={signOut}>Выйти</button>
      </header>
    );
  }
  
  export default Header;
