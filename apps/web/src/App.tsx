import {
  ColorSystemScreen,
  ComponentSystemScreen,
  HomeScreen,
  NavigationProvider,
  TestOneScreen,
  TestTwoScreen,
  TripDetailScreen,
  TypographySystemScreen,
  type AppRoute,
} from '@trip-pick/app';
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';

function TripDetailRoute() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <Navigate to="/" replace />;
  }

  return <TripDetailScreen tripId={id} />;
}

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
        <Route path="/design-system/components" element={<ComponentSystemScreen />} />
        <Route path="/test-one" element={<TestOneScreen />} />
        <Route path="/test-two" element={<TestTwoScreen />} />
        <Route path="/trip-detail/:id" element={<TripDetailRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </NavigationProvider>
  );
}

export default App;
