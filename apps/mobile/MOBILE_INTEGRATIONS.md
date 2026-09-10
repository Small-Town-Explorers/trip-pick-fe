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

## 카카오톡 공유

사용자 요청에 따라 등록 도메인 확인 및 카카오톡 전용 공유 연결은 보류했다. 기존 일반 공유 기능을 유지한다.

추후 `Kakao.Share` 연결 시 공유 링크용 웹 도메인 등록과 Android intent/iOS URL scheme 처리가 필요하다.

- https://developers.kakao.com/docs/ko/kakaotalk-share/js-link
- https://developers.kakao.com/docs/ko/javascript/hybrid

## 다음 네이티브 빌드

이번 변경에서는 요청에 따라 테스트, prebuild, 빌드, 설치를 실행하지 않았다. 현재 에뮬레이터에 설치된 APK에는 이 변경이 포함되지 않는다.

새 네이티브 의존성과 config plugin이 추가됐으므로 다음 빌드 전 `apps/mobile`에서 `npx expo prebuild`로 네이티브 설정을 갱신한다. 이전 로컬 작업의 Windows 경로 길이 우회용 Gradle init script는 생성된 Android 폴더에만 있으므로 별도로 유지해야 한다.
