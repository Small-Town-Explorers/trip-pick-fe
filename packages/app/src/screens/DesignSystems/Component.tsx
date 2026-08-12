import styled from '@emotion/native';
import { useState } from 'react';
import { Pressable, Switch, Text, TextInput, View } from 'react-native';
import { colors, typography } from '@styles';
import { DesignSystemLayout, DesignSystemSection } from './layout';
import { icons, type IconName, IconComponent } from '@components/Icons';

type ButtonLayout = 'horizontal' | 'vertical';
type PopupButtonType = 'single' | 'double';

function ControlLabel({ children }: { children: string }) {
  return <ControlLabelText>{children}</ControlLabelText>;
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  onChange: (value: T) => void;
  options: readonly { label: string; value: T }[];
  value: T;
}) {
  return (
    <SegmentedControlContainer>
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <SegmentButton
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            key={option.value}
            onPress={() => onChange(option.value)}
            style={isSelected ? selectedSegmentStyle : undefined}
          >
            <SegmentButtonText style={isSelected ? selectedSegmentTextStyle : undefined}>
              {option.label}
            </SegmentButtonText>
          </SegmentButton>
        );
      })}
    </SegmentedControlContainer>
  );
}

export function ComponentSystemScreen() {
  const [buttonText, setButtonText] = useState('여행 시작하기');
  const [hasIcon, setHasIcon] = useState(true);
  const [isIconMenuOpen, setIsIconMenuOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<IconName>('ai');
  const [buttonLayout, setButtonLayout] = useState<ButtonLayout>('horizontal');
  const [popupTitle, setPopupTitle] = useState('여행을 저장할까요?');
  const [popupContent, setPopupContent] = useState(
    '저장한 여행은 마이페이지에서 언제든 다시 확인할 수 있어요.',
  );
  const [popupButtonType, setPopupButtonType] = useState<PopupButtonType>('double');
  const [cancelText, setCancelText] = useState('취소');
  const [confirmText, setConfirmText] = useState('확인');
  const icon = icons[selectedIcon];

  return (
    <DesignSystemLayout
      activePage="components"
      description="공통 인터페이스 요소를 직접 편집하고, 실제 화면에서의 상태를 즉시 확인할 수 있습니다."
      summary="Interactive playground"
      title="Component system"
    >
      <DesignSystemSection
        description="문구, 아이콘, 배치를 조정해 버튼 상태를 미리 봅니다."
        title="Button"
        style={{
          position: 'relative',
          zIndex: isIconMenuOpen ? 10 : 0,
          elevation: isIconMenuOpen ? 10 : 0,
        }}
      >
        <Pressable>
          <Text>AI로 여행 코스 만들기</Text>
        </Pressable>
        <Playground>
          <ControlPanel>
            <ControlGroup>
              <ControlLabel>버튼 문구</ControlLabel>
              <Input onChangeText={setButtonText} value={buttonText} />
            </ControlGroup>

            <SwitchRow>
              <ControlLabel>아이콘 사용</ControlLabel>
              <Switch
                onValueChange={setHasIcon}
                thumbColor="#FFFFFF"
                trackColor={{ false: colors.gray[300], true: colors.primary[600] }}
                value={hasIcon}
              />
            </SwitchRow>

            {hasIcon ? (
              <ControlGroup style={{ zIndex: isIconMenuOpen ? 10 : 0 }}>
                <ControlLabel>아이콘</ControlLabel>
                <IconSelect>
                  <IconSelectButton onPress={() => setIsIconMenuOpen((isOpen) => !isOpen)}>
                    <IconTile>
                      <IconComponent name={selectedIcon} size={18} />
                    </IconTile>
                    <IconSelectText>{icon.label}</IconSelectText>
                    <SelectArrow>{isIconMenuOpen ? '⌃' : '⌄'}</SelectArrow>
                  </IconSelectButton>
                  {isIconMenuOpen ? (
                    <IconMenu>
                      {Object.entries(icons).map(([key, icon]) => (
                        <IconOption
                          key={key}
                          onPress={() => {
                            setSelectedIcon(key as IconName);
                            setIsIconMenuOpen(false);
                          }}
                          style={key === selectedIcon ? selectedIconOptionStyle : undefined}
                        >
                          <IconTile>
                            <IconComponent name={key as IconName} size={18} />
                          </IconTile>
                          <IconOptionText>{icon.label}</IconOptionText>
                        </IconOption>
                      ))}
                    </IconMenu>
                  ) : null}
                </IconSelect>
              </ControlGroup>
            ) : null}

            <ControlGroup>
              <ControlLabel>아이콘 · 텍스트 배치</ControlLabel>
              <SegmentedControl
                onChange={setButtonLayout}
                options={[
                  { value: 'horizontal', label: '가로' },
                  { value: 'vertical', label: '세로' },
                ]}
                value={buttonLayout}
              />
            </ControlGroup>
          </ControlPanel>

          <PreviewPanel>
            <PreviewLabel>Preview</PreviewLabel>
            <ButtonPreview
              style={{ flexDirection: buttonLayout === 'horizontal' ? 'row' : 'column' }}
            >
              {hasIcon ? (
                <PreviewIcon>
                  <IconComponent name={selectedIcon} size={20} />
                </PreviewIcon>
              ) : null}
              <ButtonPreviewText>{buttonText || '버튼'}</ButtonPreviewText>
            </ButtonPreview>
          </PreviewPanel>
        </Playground>
      </DesignSystemSection>

      <DesignSystemSection
        description="제목, 내용, 버튼 구성을 편집해 팝업의 상태를 확인합니다."
        title="Popup"
      >
        <Playground>
          <ControlPanel>
            <ControlGroup>
              <ControlLabel>타이틀</ControlLabel>
              <Input onChangeText={setPopupTitle} value={popupTitle} />
            </ControlGroup>
            <ControlGroup>
              <ControlLabel>내용</ControlLabel>
              <ContentInput
                multiline
                onChangeText={setPopupContent}
                textAlignVertical="top"
                value={popupContent}
              />
            </ControlGroup>
            <ControlGroup>
              <ControlLabel>버튼 구성</ControlLabel>
              <SegmentedControl
                onChange={setPopupButtonType}
                options={[
                  { value: 'single', label: '확인 버튼' },
                  { value: 'double', label: '취소 · 확인' },
                ]}
                value={popupButtonType}
              />
            </ControlGroup>
            {popupButtonType === 'double' ? (
              <ControlGroup>
                <ControlLabel>취소 버튼 문구</ControlLabel>
                <Input onChangeText={setCancelText} value={cancelText} />
              </ControlGroup>
            ) : null}
            <ControlGroup>
              <ControlLabel>확인 버튼 문구</ControlLabel>
              <Input onChangeText={setConfirmText} value={confirmText} />
            </ControlGroup>
          </ControlPanel>

          <PopupPreviewPanel>
            <PreviewLabel>Preview</PreviewLabel>
            <PopupCard>
              <PopupTitle>{popupTitle || '타이틀'}</PopupTitle>
              <PopupContent>{popupContent || '내용'}</PopupContent>
              <PopupActions>
                {popupButtonType === 'double' ? (
                  <PopupButton style={secondaryPopupButtonStyle}>
                    <SecondaryPopupButtonText>{cancelText || '취소'}</SecondaryPopupButtonText>
                  </PopupButton>
                ) : null}
                <PopupButton style={primaryPopupButtonStyle}>
                  <PrimaryPopupButtonText>{confirmText || '확인'}</PrimaryPopupButtonText>
                </PopupButton>
              </PopupActions>
            </PopupCard>
          </PopupPreviewPanel>
        </Playground>
      </DesignSystemSection>
    </DesignSystemLayout>
  );
}

const selectedSegmentStyle = { backgroundColor: '#FFFFFF', elevation: 1 } as const;
const selectedSegmentTextStyle = { color: colors.gray[1000] } as const;
const selectedIconOptionStyle = { backgroundColor: colors.primary[50] } as const;
const primaryPopupButtonStyle = { backgroundColor: colors.primary[700] } as const;
const secondaryPopupButtonStyle = {
  borderWidth: 1,
  borderColor: colors.gray[200],
  backgroundColor: '#FFFFFF',
} as const;

const Playground = styled(View)({
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 40,
});
const ControlPanel = styled(View)({
  zIndex: 10,
  elevation: 10,
  flexGrow: 1,
  flexBasis: 320,
  gap: 20,
});

const ControlGroup = styled(View)({
  position: 'relative',
  gap: 8,
});
const ControlLabelText = styled(Text)({ ...typography.body3.semibold, color: colors.gray[800] });
const Input = styled(TextInput)({
  ...typography.body3.regular,
  minHeight: 48,
  paddingHorizontal: 14,
  borderWidth: 1,
  borderColor: colors.gray[300],
  borderRadius: 10,
  color: colors.gray[1000],
  backgroundColor: '#FFFFFF',
});
const ContentInput = styled(Input)({ minHeight: 96, paddingVertical: 14 });
const SwitchRow = styled(View)({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});
const SegmentedControlContainer = styled(View)({
  flexDirection: 'row',
  alignSelf: 'flex-start',
  padding: 4,
  borderRadius: 10,
  backgroundColor: colors.gray[100],
});
const SegmentButton = styled(Pressable)({
  paddingHorizontal: 14,
  paddingVertical: 9,
  borderRadius: 7,
});
const SegmentButtonText = styled(Text)({ ...typography.caption1.medium, color: colors.gray[600] });
const IconSelect = styled(View)({
  position: 'relative',
  zIndex: 1,
});
const IconSelectButton = styled(Pressable)({
  minHeight: 48,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  paddingHorizontal: 12,
  borderWidth: 1,
  borderColor: colors.gray[300],
  borderRadius: 10,
  backgroundColor: '#FFFFFF',
});
const IconTile = styled(View)({
  width: 28,
  height: 28,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,
  backgroundColor: colors.sub[100],
});
const IconSelectText = styled(Text)({
  ...typography.body3.regular,
  flexGrow: 1,
  color: colors.gray[1000],
});
const SelectArrow = styled(Text)({ ...typography.body3.medium, color: colors.gray[600] });
const IconMenu = styled(View)({
  position: 'absolute',
  top: 54,
  right: 0,
  left: 0,
  overflow: 'hidden',
  borderWidth: 1,
  borderColor: colors.gray[200],
  borderRadius: 10,
  backgroundColor: '#FFFFFF',
  elevation: 20,
  zIndex: 20,
});
const IconOption = styled(Pressable)({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  padding: 10,
});
const IconOptionText = styled(Text)({ ...typography.body3.regular, color: colors.gray[900] });
const PreviewPanel = styled(View)({
  flexGrow: 1,
  flexBasis: 320,
  minHeight: 280,
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  borderRadius: 18,
  backgroundColor: colors.gray[50],
  padding: 24,
});
const PreviewLabel = styled(Text)({
  ...typography.caption1.medium,
  alignSelf: 'flex-start',
  color: colors.gray[500],
});
const ButtonPreview = styled(View)({
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  paddingHorizontal: 24,
  paddingVertical: 14,
  borderRadius: 12,
  backgroundColor: colors.primary[700],
  margin: 'auto',
});
const PreviewIcon = styled(View)({
  width: 20,
  height: 20,
  alignItems: 'center',
  justifyContent: 'center',
});
const ButtonPreviewText = styled(Text)({ ...typography.body3.semibold, color: '#FFFFFF' });
const PopupPreviewPanel = styled(View)({
  flexGrow: 1,
  flexBasis: 320,
  minHeight: 420,
  justifyContent: 'center',
  gap: 16,
  padding: 24,
  borderRadius: 18,
  backgroundColor: colors.gray[1000],
});
const PopupCard = styled(View)({
  gap: 16,
  padding: 24,
  borderRadius: 18,
  backgroundColor: '#FFFFFF',
});
const PopupTitle = styled(Text)({ ...typography.heading3.semibold, color: colors.gray[1000] });
const PopupContent = styled(Text)({ ...typography.body3.regular, color: colors.gray[600] });
const PopupActions = styled(View)({ flexDirection: 'row', gap: 8, marginTop: 8 });
const PopupButton = styled(Pressable)({
  flexGrow: 1,
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingVertical: 13,
  borderRadius: 10,
});
const PrimaryPopupButtonText = styled(Text)({ ...typography.body3.semibold, color: '#FFFFFF' });
const SecondaryPopupButtonText = styled(Text)({
  ...typography.body3.semibold,
  color: colors.gray[800],
});
