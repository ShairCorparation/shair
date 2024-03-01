import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage";
import RequestCreate from "./pages/Requests/forms/create_form/RequestCreate";
import Login from "./pages/Registration/Login/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainPage />} path="/"/>
        <Route element={<Login />} path="/login"/>

        <Route element={<RequestCreate />} path="/create_request"/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
