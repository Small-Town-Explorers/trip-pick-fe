# KakaoMap (웹 전용)

[공식 가이드](https://apis.map.kakao.com/web/guide/)처럼 `apps/web/index.html`의 script 태그에서 SDK를 로드하고 컴포넌트의 div에 지도를 생성합니다.

`apps/web/.env`에 아래 값을 추가하고 개발 서버를 재시작하세요. 개발 주소(포트 포함)와 배포 주소를 카카오 JavaScript SDK 도메인에 등록해야 합니다.

```env
VITE_KAKAO_MAP_JAVASCRIPT_KEY=발급받은_JavaScript_키
```

```tsx
import { KakaoMap } from '@components/KakaoMap';

<KakaoMap
  coordinates={[
    [ // 1일차: 진한 초록, 1·2번
      { lat: 37.5665, lng: 126.978 },
      { lat: 37.5704, lng: 126.982 },
    ],
    [ // 2일차: 밝은 초록, 3번
      { lat: 37.5796, lng: 126.977 },
    ],
  ]}
  height={300}
/>;
```

- `coordinates`: 날짜별 2차원 배열. 첫 배열부터 1일차로 간주하고 홀수 날짜는 진한 초록, 짝수 날짜는 밝은 초록 마커로 표시합니다. 마커 번호는 전체 장소 순서대로 1부터 이어집니다. 변경할 때는 새 배열을 전달하세요.

API 데이터는 `[...trip.plan].sort((a, b) => a.day - b.day).map(({ items }) => items.map(({ lat, lng }) => ({ lat, lng })))`로 변환합니다.

빈 날짜 배열도 유지해야 날짜 색상이 밀리지 않습니다. `lat` 또는 `lng`가 `null`인 장소는 지도에서 생략하지만 전체 번호에는 포함합니다. 직선은 날짜 경계를 포함해 전체 방문 순서대로 연결합니다.
- `height`: 기본 240px.
- `style`: 웹 CSS 스타일.

모든 장소가 보이도록 범위를 맞추고 좌표 변경 시 기존 마커와 선을 정리합니다. 빈 배열, 잘못된 좌표, SDK 로드 실패 시 안내를 표시합니다. 모바일 적용은 포함하지 않습니다.
