import { AppShell } from './components/layout/AppShell';
import { useTheme } from './hooks/useTheme';

export default function App() {
  useTheme();
  return <AppShell />;
}
