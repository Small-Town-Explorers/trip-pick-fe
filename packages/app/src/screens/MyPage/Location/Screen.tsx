import { ToggleButton } from '@components/Buttons';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { useState } from 'react';
import { hasApiAccessToken } from '../../../controllers';
import {
  getLocationPreferenceSnapshot,
  saveLocationPreference,
} from '../../../storage/myPagePreferences';
import { MyPageSectionLayout } from '../SectionLayout';

export function MyPageLocationScreen() {
  const isAuthenticated = hasApiAccessToken();
  const [enabled, setEnabled] = useState(() => getLocationPreferenceSnapshot(!isAuthenticated));
  const [error, setError] = useState('');

  const toggle = async () => {
    const next = !enabled;
    try {
      await saveLocationPreference(next);
      setEnabled(next);
      setError('');
    } catch {
      setError('위치 설정을 저장하지 못했어요. 다시 시도해 주세요.');
    }
  };

  return (
    <MyPageSectionLayout title="위치 권한">
      <Content>
        <Setting>
          <Label>위치 정보 사용</Label>
          <ToggleButton value={enabled} onToggle={() => void toggle()} />
        </Setting>
        {error ? <ErrorText accessibilityLiveRegion="polite">{error}</ErrorText> : null}
      </Content>
    </MyPageSectionLayout>
  );
}
const Content = styled.View({ padding: 20, gap: 12 });
const Setting = styled.View({
  height: 60,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 16,
  backgroundColor: '#FFFFFF',
  borderRadius: 10,
});
const Label = styled.Text({ ...typography.body2.regular, color: colors.gray[800] });
const ErrorText = styled.Text({
  ...typography.caption1.regular,
  color: colors.semantic.warning,
  textAlign: 'center',
});
