import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";

// Create your page components (these are just examples - create your actual pages)
const ERatesPage = () => <div className="mainContent">E-Rates Content</div>;
const AboutPage = () => <div className="mainContent">About Content</div>;
const ContactPage = () => <div className="mainContent">Contact Content</div>;
const TransactionsPage = () => (
  <div className="mainContent">Transactions Content</div>
);

function App() {
  const drawerButtons = [
    { name: "E-Rates", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Transactions", path: "/transactions" },
  ];

  return (
    <Router>
      <div className="layout">
        <div className="mainDrawer">
          {drawerButtons.map((button) => (
            <Link to={button.path} className="drawerButton" key={button.name}>
              {button.name}
            </Link>
          ))}
        </div>
        <div className="mainContent">
          <Routes>
            <Route path="/" element={<ERatesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
