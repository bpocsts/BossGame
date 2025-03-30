import './App.css';
import Home from './components/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/login';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserAuthContextProvider } from './context/UserAuthContext';
import Invitepage from './components/invitepage'

const clientId = "1083350032653-pr81lhb6pd24jpl0672ga0gc91ah1ppi.apps.googleusercontent.com";

function App() {
  return (
    <div className="App itim-regular">
      {/* Wrap the app with both GoogleOAuthProvider and UserAuthContextProvider */}
      <GoogleOAuthProvider clientId={clientId}>
        <UserAuthContextProvider>
          <Router>
            <Routes>
            <Route path="/invite" element={<Invitepage />} />
              <Route exact path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </Router>
        </UserAuthContextProvider>
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;