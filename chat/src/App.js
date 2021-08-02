import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Chat from "./pages/chat/Chat";
import {BrowserRouter as Router,Switch,Route} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {

  const {user} = useContext(AuthContext)

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {user ? <Chat /> : <Register />}
        </Route>
        <Route path="/login">
          {user ? <Chat /> : <Login />}
        </Route>
        <Route path="/register">
          {user ? <Chat /> : <Register /> }
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
