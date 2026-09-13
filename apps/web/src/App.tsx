import {
  ColorSystemScreen,
  ComponentSystemScreen,
  configureApiAccessToken,
  configureApiBaseUrl,
  CourseCreateScreen,
  CourseResultScreen,
  HomeScreen,
  LoginScreen,
  MyPageScreen,
  MyPageNoticeDetailScreen,
  MyPageSectionScreen,
  MyTripFolderScreen,
  MyTripsScreen,
  NavigationProvider,
  PlaceDetailScreen,
  TripDetailScreen,
  TypographySystemScreen,
  type AppRoute,
  type MyPageSectionRoute as MyPageSectionRouteName,
} from '@trip-pick/app';
import { useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ApiError, createKakaoAuthorizeUrl, getAccessToken, loginWithKakaoCode } from './auth';

configureApiBaseUrl(import.meta.env.VITE_API_BASE_URL ?? 'https://trippick.kro.kr');
configureApiAccessToken(getAccessToken);

function LoginRoute() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(() =>
    searchParams.get('error') ? '카카오 로그인이 취소되었어요. 다시 시도해 주세요.' : undefined,
  );
  const exchangedCode = useRef<string | null>(null);
  const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI ?? `${window.location.origin}/login`;

  useEffect(() => {
    const code = searchParams.get('code');

    if (!code || exchangedCode.current === code) return;
    exchangedCode.current = code;
    setIsLoading(true);

    loginWithKakaoCode(code, redirectUri)
      .then(() => navigate('/', { replace: true }))
      .catch((error: unknown) => {
        setIsLoading(false);

        if (error instanceof ApiError && error.code === 'KAKAO_UNAVAILABLE') {
          setErrorMessage('카카오 연결이 원활하지 않아요. 잠시 후 다시 시도해 주세요.');
        } else if (error instanceof ApiError && error.code === 'KAKAO_AUTH_FAILED') {
          setErrorMessage('인증 시간이 지났거나 유효하지 않아요. 다시 로그인해 주세요.');
        } else {
          setErrorMessage(error instanceof Error ? error.message : '로그인을 완료하지 못했어요.');
        }
      });
  }, [navigate, redirectUri, searchParams]);

  const startKakaoLogin = () => {
    const authorizeUrl = createKakaoAuthorizeUrl();

    if (!authorizeUrl) {
      setErrorMessage(
        '카카오 앱 키가 아직 설정되지 않았어요. VITE_KAKAO_REST_API_KEY를 확인해 주세요.',
      );
      return;
    }

    window.location.assign(authorizeUrl);
  };

  return (
    <LoginScreen
      isLoading={isLoading}
      errorMessage={errorMessage}
      onKakaoLogin={startKakaoLogin}
      onGuestContinue={() => navigate('/', { replace: true })}
    />
  );
}

function TripDetailRoute() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <Navigate to="/" replace />;
  }

  return <TripDetailScreen tripId={id} />;
}

function PlaceDetailRoute() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  if (!id) {
    return <Navigate to="/" replace />;
  }

  return (
    <PlaceDetailScreen
      placeId={id}
      discoveryTitle={searchParams.get('discoveryTitle') ?? undefined}
    />
  );
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

function MyPageNoticeDetailRoute() {
  const { id } = useParams<{ id: string }>();
  return id ? (
    <MyPageNoticeDetailScreen noticeId={id} />
  ) : (
    <Navigate to="/my-page/notices" replace />
  );
}

function MyPageSectionRoute() {
  const { section } = useParams<{ section: MyPageSectionRouteName }>();
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
        <Route path="/login" element={<LoginRoute />} />
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
        <Route path="/my-page/notices/:id" element={<MyPageNoticeDetailRoute />} />
        <Route path="/my-page/:section" element={<MyPageSectionRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </NavigationProvider>
  );
}

export default App;
