import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage";
import RequestCreate from "./pages/Requests/forms/create_form/RequestCreate";
import Login from "./pages/Registration/Login/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainPage />} path="/requests"/>
        <Route element={<MainPage />} path="/orders"/>
        <Route element={<MainPage />} path="/clients"/>
        <Route element={<MainPage />} path="/carriers"/>
        <Route element={<MainPage />} path="/reports"/>
        <Route element={<MainPage />} path="/archive"/>
        <Route element={<MainPage />} path="/profile"/>

        <Route element={<Login />} path="/login"/>

        <Route element={<RequestCreate />} path="/create_request"/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
