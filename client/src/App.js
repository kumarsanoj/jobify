
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing, Register, Error} from './pages'
import {
  AddJob,
  AllJobs,
  Profile,
  Stats,
  SharedLayout
} from './pages/dashboard';
import {ProtectedRoute} from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<SharedLayout />}>
          <Route index element={<ProtectedRoute>
            <Stats />
            </ProtectedRoute>}/>         
          <Route path="add-job" element={<AddJob />}/>         
          <Route path="profile" element={<Profile />}/>         
          <Route path="all-jobs" element={<AllJobs />}/>         
        </Route>
        <Route path={'/register'} element={< Register />}/>
        <Route path={'/landing'} element={<Landing />}/>
        <Route path={'*'} element={<Error />}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
