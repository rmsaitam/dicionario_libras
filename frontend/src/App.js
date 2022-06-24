import './App.css';
import './components/Home/Home';
import Home from "./components/Home/Home";
import Cadastrar from "./components/Cadastro/Cadastrar";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./components/Login/Login";
import Painel from "./components/Painel/Painel";

function App() {
  return (
      <BrowserRouter>
          <Switch>
              <Route exact path="/" component={Home}/>
              <Route path="/cadastrar" component={Cadastrar}/>
              <Route path="/login" component={Login}/>
              <Route path="/painel" component={Painel}/>

          </Switch>
      </BrowserRouter>
  );
}

export default App;
