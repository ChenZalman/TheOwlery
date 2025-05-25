import './App.css';
import Routes from "./Routes"
import TopBanner from "./components/topBanner"
import { BrowserRouter as Router } from "react-router-dom";
import HomePage from "./components/homePage";

function App() {
  return (
    <div>
    <Router>
      <TopBanner/>
      <Routes />
    </Router>
    
    </div>
  );
}

export default App;
