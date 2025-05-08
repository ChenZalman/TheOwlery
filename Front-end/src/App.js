import './App.css';
import Routes from "./Routes"
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <div className="flex w-full flex-col gap-20 bg-[#b8b8b8] md:gap-[60px] sm:gap-10">
    <Router>
      {/* <TopBanner/> */}
      <Routes />
    </Router>
    </div>
  );
}

export default App;
