import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './screens/Login';
import { Dashboard } from './screens/Dashboard';
import { NewFI } from './screens/NewFI';
import { ViewFI } from './screens/ViewFI';
import { Notifications } from './screens/Notifications';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/fi/new" element={<NewFI />} />
        <Route path="/fi/:fiNumber" element={<ViewFI />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
