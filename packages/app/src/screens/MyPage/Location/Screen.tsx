import { ToggleButton } from '@components/Buttons';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { useState } from 'react';
import { MyPageSectionLayout } from '../SectionLayout';

export function MyPageLocationScreen() {
  const [enabled, setEnabled] = useState(true);
  return <MyPageSectionLayout title="위치 권한"><Setting><Label>위치 정보 사용</Label><ToggleButton value={enabled} onToggle={() => setEnabled((value) => !value)} /></Setting></MyPageSectionLayout>;
}
const Setting = styled.View({ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, backgroundColor: '#FFFFFF', borderRadius: 10 });
const Label = styled.Text({ ...typography.body2.regular, color: colors.gray[800] });
