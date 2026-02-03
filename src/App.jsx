import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FollowProvider } from './context/FollowContext';
import Layout from './components/Layout';
import Browse from './pages/Browse';
import Following from './pages/Following';
import Ladder from './pages/Ladder';
import Friends from './pages/Friends';
import FriendProfile from './pages/FriendProfile';
import RequestDetail from './pages/RequestDetail';
import Account from './pages/Account';
import './App.css';

// BASE_URL is set by Vite from the `base` config. Use it so routes work when deployed to a subpath (e.g. GitHub Pages).
const basename = import.meta.env.BASE_URL ?? '/';

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <FollowProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Browse />} />
            <Route path="/following" element={<Following />} />
            <Route path="/ladder" element={<Ladder />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/friend/:name" element={<FriendProfile />} />
            <Route path="/request/:id" element={<RequestDetail />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </Layout>
      </FollowProvider>
    </BrowserRouter>
  );
}
