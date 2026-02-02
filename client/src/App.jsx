import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import Accountability from './pages/Accountability';
import ChaloTirthyatra from './pages/ChaloTirthyatra';
import Login from './pages/Login';
import GaurangaVidhyapitha from './pages/GaurangaVidhyapitha';
import AdminDashboard from './pages/AdminDashboard';
import CounselorDashboard from './pages/CounselorDashboard';
import UserDashboard from './pages/UserDashboard';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="blog" element={<Blog />} />
          <Route
            path="accountability"
            element={
              <PrivateRoute>
                <Accountability />
              </PrivateRoute>
            }
          />
          <Route path="chalo-tirthyatra" element={<ChaloTirthyatra />} />
          <Route path="gauranga-vidhyapitha" element={<GaurangaVidhyapitha />} />
          <Route path="login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="admin/dashboard"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="counselor/dashboard"
            element={
              <PrivateRoute roles={['counselor']}>
                <CounselorDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <PrivateRoute roles={['user']}>
                <UserDashboard />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;

