import {
  ColorSystemScreen,
  HomeScreen,
  NavigationProvider,
  TestOneScreen,
  TestTwoScreen,
  TypographySystemScreen,
  type AppRoute,
} from '@trip-pick/app';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  return (
    <NavigationProvider
      navigation={{
        navigate: (route: AppRoute) => navigate(route),
        back: () => navigate(-1),
      }}
    >
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/design-system/colors" element={<ColorSystemScreen />} />
        <Route path="/design-system/typography" element={<TypographySystemScreen />} />
        <Route path="/test-one" element={<TestOneScreen />} />
        <Route path="/test-two" element={<TestTwoScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </NavigationProvider>
  );
}

export default App;
