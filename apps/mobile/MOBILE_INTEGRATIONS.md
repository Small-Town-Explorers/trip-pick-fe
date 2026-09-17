# 모바일 연결 설정

## 알림 권한

`expo-notifications`로 Android 알림 채널(`travel`)을 먼저 만들고 시스템 권한을 요청한다. 처음 실행할 때 아직 선택하지 않은 경우만 요청하고, 거절 후 자동으로 반복 요청하지 않는다.

마이페이지 → 알림 설정에서 시스템 권한을 확인하고 다시 요청하거나 기기 설정을 열 수 있다. OS 권한을 허용하지 않으면 수신 설정을 켜는 서버 요청과 낙관적 갱신을 중단한다. 기기 설정에서 돌아오면 권한을 다시 읽는다. 서버의 수신 설정과 OS 권한은 별개로 표시한다.

이 변경은 권한 처리 범위다. FCM/APNs 자격 증명, 푸시 토큰 등록 API, 서버의 실제 발송 파이프라인은 추가하지 않는다.

공식 문서: https://docs.expo.dev/versions/v57.0.0/sdk/notifications/

## 카카오 지도

기존 지도는 웹 DOM을 사용하므로 React Native에서 직접 렌더링할 수 없다. 모바일은 `react-native-webview` 안에 공식 **Kakao Maps JavaScript SDK**를 로드한다. Android/iOS 전용 Kakao Maps 네이티브 SDK를 붙인 방식은 아니다.

- 코스 결과 및 홈 여행: 날짜별 번호 마커, 경로 연결선, 전체 장소 자동 맞춤.
- 직접 장소 추가: 주소 검색, 지도 터치 좌표 선택, 역지오코딩.
- 로딩 실패·시간 초과 안내와 재시도, 오래된 검색 응답 무시.
- 경로 연결선은 장소 사이 직선이며 실제 도로 길찾기 결과가 아니다.

`.env.example`을 참고하여 `.env.local`에 다음 값을 지정한다.

```
EXPO_PUBLIC_KAKAO_MAP_JAVASCRIPT_KEY=카카오_JavaScript_키
EXPO_PUBLIC_KAKAO_MAP_BASE_URL=카카오에_등록한_웹_원본_URL
```

`baseUrl`은 WebView HTML의 원본을 지정하며 카카오 개발자 콘솔의 **JavaScript SDK 도메인**과 일치해야 한다. 로컬 개발에서는 기존 웹 키 및 웹 로그인 redirect URI의 origin을 재사용했다. 등록 여부·지도 서비스 활성화 여부는 확인하지 않았으므로 실제 연결은 보장하지 않는다. 출시 전 실제 서비스의 등록 도메인으로 교체한다. `EXPO_PUBLIC_*` 값은 앱에 포함되므로 관리자 키나 REST 비밀키를 넣지 않는다.

공식 문서:

- https://apis.map.kakao.com/web/guide/
- https://apis.map.kakao.com/web/documentation/
- https://docs.expo.dev/versions/v57.0.0/sdk/webview/

## 카카오 로그인

모바일 로그인은 카카오 네이티브 SDK와 서버의 `POST /api/v1/auth/kakao/mobile/login`을 사용한다.

앱이 시작될 때 `_layout.tsx`에서 `initializeKakaoSDK`를 먼저 호출한다. 로그인과 공유를 포함한 모든 카카오 API는 이 초기화가 끝난 뒤 사용한다.

1. `@react-native-kakao/user`가 카카오톡 또는 카카오 계정 로그인을 실행한다.
2. 카카오 SDK가 발급한 access token을 백엔드에 보낸다.
3. 백엔드가 카카오 토큰의 유효성과 발급 앱을 검증하고 서비스 access token을 발급한다.
4. 서비스 토큰과 만료 시각은 기기 저장소에 보관되며 이후 API 요청에 자동으로 포함된다.

`.env.local`에 다음 값을 추가한다.

```
EXPO_PUBLIC_API_BASE_URL=https://trippick.kro.kr
EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY=카카오_Native_App_키
EXPO_PUBLIC_SHARE_WEB_BASE_URL=https://sodosiro.netlify.app
```

카카오 개발자 콘솔에서 Android 패키지명 `com.jadest13.mobile`과 키 해시를 같은 카카오 앱에 등록해야 한다. iOS 빌드를 사용할 때는 Bundle ID도 등록한다. 웹의 `/mobile-auth/kakao` 중간 콜백은 더 이상 사용하지 않는다.

네이티브 모듈을 사용하므로 Expo Go에서는 테스트할 수 없다. Native App 키를 설정한 뒤 새 Development Build 또는 APK를 빌드해야 한다.

공식 문서:

- https://trippick.kro.kr/docs/index.html#auth-kakao-mobile-login
- https://rnkakao.mjstudio.net/docs/user/intro

## 카카오톡 공유

저장된 코스에서 공유를 시작하면 `POST /api/v1/my/courses/{courseId}/share`로 공유 ID를 발급하고 `https://웹주소/c/{shareId}` 링크를 만든다. 공유 화면은 로그인 없이 `GET /api/v1/shared-courses/{shareId}`를 호출해 최신 저장본을 읽기 전용으로 표시하며, 웹과 앱이 같은 경로를 처리한다. 이전 압축형 `/c?d=...`, `/shared-course?data=...`, `#data=...` 링크도 계속 열 수 있다.

모바일에서는 `@react-native-kakao/share`가 카카오톡의 친구·채팅방 선택 화면을 연다. 카카오톡이 설치되지 않은 경우에는 웹 공유 화면을 사용한다. `EXPO_PUBLIC_SHARE_WEB_BASE_URL`은 카카오 개발자 콘솔의 **제품 링크 관리 → 웹 도메인**에 등록된 주소와 일치해야 한다.

웹에서는 같은 링크를 화면에 표시하고 클립보드에 복사한다. 링크 데이터는 수정될 수 있으므로 공유 페이지에서 형식, 길이, 장소 수와 좌표를 검증하며 서버 데이터로 신뢰하지 않는다.

Android App Links를 위해 앱에는 `/c` 경로 전체(`/c/{shareId}` 포함)와 기존 `/shared-course` HTTPS intent filter가 있고 웹에는 `/.well-known/assetlinks.json`이 있다. 현재 파일에는 연결된 Development Build 인증서 지문이 등록되어 있다. 배포용 APK/AAB의 서명 인증서가 다르면 해당 SHA-256 지문도 배열에 추가해야 한다.

- https://developers.kakao.com/docs/ko/kakaotalk-share/android-link
- https://developers.kakao.com/docs/ko/kakaotalk-share/ios-link
- https://rnkakao.mjstudio.net/docs/share/share-default-text

## 다음 네이티브 빌드

정적 타입 검사, 린트, Expo 설정 검사와 Android JavaScript 번들 생성까지 확인했다. 네이티브 `prebuild`, APK 빌드와 기기 설치는 실행하지 않았으므로 현재 에뮬레이터에 설치된 APK에는 이 변경이 포함되지 않는다.

새 네이티브 의존성과 config plugin이 추가됐으므로 다음 빌드 전 `apps/mobile`에서 `npx expo prebuild`로 네이티브 설정을 갱신한다. 이전 로컬 작업의 Windows 경로 길이 우회용 Gradle init script는 생성된 Android 폴더에만 있으므로 별도로 유지해야 한다.
