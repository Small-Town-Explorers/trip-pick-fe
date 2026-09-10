# 로컬 데이터 저장소

웹은 localStorage, Android/iOS는 AsyncStorage를 사용한다. 플랫폼별 구현은 Metro가 `.native.ts` 파일로 선택한다. 기존 웹 저장 키를 유지한다.

```ts
import { loadLocalData, saveLocalData, removeLocalData } from '@trip-pick/app';

type Draft = { title: string; places: string[] };
await saveLocalData<Draft>('trip-pick:draft', { title: '하동 여행', places: [] });
const draft = await loadLocalData<Draft>('trip-pick:draft'); // 없으면 null
await removeLocalData('trip-pick:draft');
```

- `localDataStorage.getItem/setItem/removeItem`: 문자열 저장·조회·삭제. 모두 Promise를 반환하며 실패 시 reject한다.
- `loadLocalData/saveLocalData/removeLocalData`: JSON 저장·조회·삭제. 타입 매개변수는 런타임 검증을 대신하지 않는다. 잘못된 JSON은 reject한다.
- `localDataStorage.initialize()`: 앱 시작 시 저장 데이터를 메모리에 복원한다. 실패 시 다시 호출할 수 있다.
- `getItemSnapshot()`: 초기화 완료 후 동기 읽기가 필요한 기존 화면에서 사용한다. 일반 기능은 비동기 `getItem` 또는 `loadLocalData`를 우선 사용한다.
- 모바일 루트의 `LocalStorageGate`가 복원을 기다린 뒤 하위 화면을 렌더링한다. 초기화 실패 화면에서 재시도할 수 있다.
- 모바일 쓰기는 순서대로 처리한다. 중요한 저장은 반드시 `await`하고 오류를 사용자에게 안내한다.

연결된 데이터: 생성한 여행 코스, 챗봇 대화, 코스 저장 완료 안내, 기존 위치 설정값. 메모리에만 있던 예전 모바일 데이터는 앱 종료 후 복구할 수 없으며, 새 저장부터 기기에 유지된다. 위치 설정값 저장은 OS 위치 권한 부여와 별개다.

AsyncStorage는 암호화된 비밀 저장소가 아니다. 새 로그인 기능의 토큰이나 비밀번호 저장은 SecureStore 같은 별도 자격 증명 저장소를 사용해야 한다.
