import {
  ColorSystemScreen,
  ComponentSystemScreen,
  CourseCreateScreen,
  CourseResultScreen,
  HomeScreen,
  MyPageScreen,
  MyPageSectionScreen,
  MyTripFolderScreen,
  MyTripsScreen,
  NavigationProvider,
  PlaceDetailScreen,
  TripDetailScreen,
  TypographySystemScreen,
  type AppRoute,
  type MyPageSection,
} from '@trip-pick/app';
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';

function TripDetailRoute() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <Navigate to="/" replace />;
  }

  return <TripDetailScreen tripId={id} />;
}

function PlaceDetailRoute() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <Navigate to="/" replace />;
  }

  return <PlaceDetailScreen placeId={id} />;
}

function CourseResultRoute() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <Navigate to="/" replace />;
  }

  return <CourseResultScreen courseId={id} />;
}

function MyTripFolderRoute() {
  const { id } = useParams<{ id: string }>();
  return id ? <MyTripFolderScreen folderId={id} /> : <Navigate to="/my-trips" replace />;
}

function MyPageSectionRoute() {
  const { section } = useParams<{ section: MyPageSection }>();
  return section ? <MyPageSectionScreen section={section} /> : <Navigate to="/my-page" replace />;
}

function App() {
  const navigate = useNavigate();

  return (
    <NavigationProvider
      navigation={{
        navigate: (route: AppRoute) => navigate(route),
        replace: (route: AppRoute) => navigate(route, { replace: true }),
        back: () => navigate(-1),
      }}
    >
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/design-system/colors" element={<ColorSystemScreen />} />
        <Route path="/design-system/typography" element={<TypographySystemScreen />} />
        <Route path="/design-system/components" element={<ComponentSystemScreen />} />
        <Route path="/trip-detail/:id" element={<TripDetailRoute />} />
        <Route path="/place-detail/:id" element={<PlaceDetailRoute />} />
        <Route path="/course-create" element={<CourseCreateScreen />} />
        <Route path="/course-result/:id" element={<CourseResultRoute />} />
        <Route path="/my-trips" element={<MyTripsScreen />} />
        <Route path="/my-trips/:id" element={<MyTripFolderRoute />} />
        <Route path="/my-page" element={<MyPageScreen />} />
        <Route path="/my-page/:section" element={<MyPageSectionRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </NavigationProvider>
  );
}

export default App;
