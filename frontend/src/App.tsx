import './App.css';
import Layout from './components/common/Layout';

export default function App({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}
