import { IconComponent } from '@components/Icons';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { useState } from 'react';
import { Platform } from 'react-native';

const indicators = [
  { label: '지난 여정', value: 4 },
  { label: '저장한 코스', value: 12 },
  { label: '방문한 지역', value: 3 },
];

export const MyPageProfile = () => {
  const [profileName, setProfileName] = useState('김민수');
  const [editingName, setEditingName] = useState(profileName);
  const [isNameEdit, setIsNameEdit] = useState(false);

  const handleStartNameEdit = () => {
    setEditingName(profileName);
    setIsNameEdit(true);
  };

  const handleCancelNameEdit = () => {
    setProfileName(editingName);
    setIsNameEdit(false);
  };

  return (
    <Profile>
      <ProfileHeader>
        <ProfileName>
          {!isNameEdit ? (
            <ProfileNameValue>{profileName}</ProfileNameValue>
          ) : (
            <ProfileNameEdit>
              <ProfileNameEditInput
                value={editingName}
                onChangeText={setEditingName}
                autoFocus
                returnKeyType="done"
              />

              <ProfileNameEditCancelButton onPress={handleCancelNameEdit}>
                <IconComponent name="cancel" size={24} color={colors.gray[200]} />
              </ProfileNameEditCancelButton>
            </ProfileNameEdit>
          )}
          <ProfileNameSub>님</ProfileNameSub>
          {!isNameEdit ? (
            <ProfileNameEditButton onPress={handleStartNameEdit}>
              <IconComponent name="pencil" size={20} color={colors.gray[500]} />
            </ProfileNameEditButton>
          ) : null}
        </ProfileName>
        <ProfileStreakText>
          소도시 발굴을 시작한 지 <ProfileStreakHighlight>20일</ProfileStreakHighlight>째
        </ProfileStreakText>
      </ProfileHeader>
      <ProfileIndicators>
        {indicators.map((item, index) => (
          <ProfileIndicatorItem key={index}>
            <ProfileIndicatorItemLabel>{item.label}</ProfileIndicatorItemLabel>
            <ProfileIndicatorItemValue>{item.value}</ProfileIndicatorItemValue>
          </ProfileIndicatorItem>
        ))}
      </ProfileIndicators>
    </Profile>
  );
};

const Profile = styled.View({
  paddingHorizontal: 20,
  paddingVertical: 24,
  gap: 28,
  backgroundColor: '#FFFFFF',
});

const ProfileHeader = styled.View({
  gap: 16,
});

const ProfileName = styled.View({
  flexDirection: 'row',
  gap: 8,
  alignItems: 'center',
});

const ProfileNameValue = styled.Text({
  ...typography.heading2.semibold,
  color: colors.gray[1000],
});

const ProfileNameEdit = styled.View({
  flexDirection: 'row',
  flex: 1,
  backgroundColor: colors.gray[25],
  borderRadius: 9999,
  paddingHorizontal: 16,
  paddingVertical: 10,
  height: 50,
  alignItems: 'center',
});

const ProfileNameEditInput = styled.TextInput({
  flex: 1,
  ...typography.heading3.medium,
  color: colors.gray[1000],
  ...Platform.select({ web: { outlineStyle: 'none' as never } }),
});

const ProfileNameEditCancelButton = styled.Pressable({});

const ProfileNameSub = styled.Text({
  ...typography.heading2.semibold,
  color: colors.gray[700],
});

const ProfileNameEditButton = styled.Pressable({
  width: 32,
  height: 32,
  backgroundColor: colors.gray[50],
  borderRadius: 9999,
  alignItems: 'center',
  justifyContent: 'center',
});

const ProfileStreakText = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[700],
});
const ProfileStreakHighlight = styled.Text({
  ...typography.body2.semibold,
});

const ProfileIndicators = styled.View({
  flexDirection: 'row',
  gap: 16,
});

const ProfileIndicatorItem = styled.View({
  flex: 1,
  padding: 16,
  gap: 4,
  borderRadius: 8,
  backgroundColor: colors.gray[50],
  alignItems: 'center',
  justifyContent: 'center',
});

const ProfileIndicatorItemLabel = styled.Text({
  ...typography.caption1.medium,
  color: colors.gray[700],
});
const ProfileIndicatorItemValue = styled.Text({
  ...typography.heading4.semibold,
  color: colors.primary[1000],
});
