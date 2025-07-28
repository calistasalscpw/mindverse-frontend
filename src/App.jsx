import { ConfigProvider } from 'antd';
import Login from './pages/Login';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#602080',
          borderRadius: 8,
          fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
        },
      }}
    >
      <Login />
    </ConfigProvider>
  );
}

export default App;
