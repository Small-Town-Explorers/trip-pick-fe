import { IconComponent } from '@components/Icons';
import styled from '@emotion/native';
import { colors, typography } from '@styles';
import { useState } from 'react';
import { ActivityIndicator, Platform } from 'react-native';
import { ApiError } from '../../controllers';
import { useMyPageSummaryQuery, useUpdateNicknameMutation } from '../../queries';

export const MyPageProfile = () => {
  const { data: summary, error, isPending, refetch } = useMyPageSummaryQuery();
  const updateNickname = useUpdateNicknameMutation();
  const [editingName, setEditingName] = useState('');
  const [isNameEdit, setIsNameEdit] = useState(false);
  const [nameError, setNameError] = useState('');

  const handleStartNameEdit = () => {
    if (!summary) return;
    setEditingName(summary.nickname);
    setNameError('');
    setIsNameEdit(true);
  };

  const handleSaveName = async () => {
    const nickname = editingName.trim();
    if (updateNickname.isPending) return;
    if (!nickname) {
      setNameError('닉네임을 입력해 주세요.');
      return;
    }
    if (nickname === summary?.nickname) {
      setEditingName('');
      setNameError('');
      setIsNameEdit(false);
      return;
    }

    setNameError('');
    try {
      await updateNickname.mutateAsync(nickname);
      setEditingName('');
      setIsNameEdit(false);
    } catch (mutationError) {
      setNameError(
        mutationError instanceof ApiError ? mutationError.message : '닉네임을 변경하지 못했어요.',
      );
    }
  };

  if (isPending) {
    return (
      <Profile>
        <ProfileStatus accessibilityLiveRegion="polite">
          <ActivityIndicator color={colors.primary[700]} />
          <ProfileStatusText>내 정보를 불러오고 있어요.</ProfileStatusText>
        </ProfileStatus>
      </Profile>
    );
  }

  if (error || !summary) {
    return (
      <Profile>
        <ProfileStatus>
          <ProfileStatusText>
            {error instanceof Error ? error.message : '내 정보를 불러오지 못했어요.'}
          </ProfileStatusText>
          <RetryButton accessibilityRole="button" onPress={() => refetch()}>
            <RetryText>다시 시도</RetryText>
          </RetryButton>
        </ProfileStatus>
      </Profile>
    );
  }

  const indicators = [
    { label: '지난 여정', value: summary.pastTripCount },
    { label: '저장한 코스', value: summary.savedCourseCount },
    { label: '방문한 지역', value: summary.discoveredRegionCount },
  ];

  return (
    <Profile>
      <ProfileHeader>
        <ProfileName>
          {!isNameEdit ? (
            <ProfileNameValue>{summary.nickname}</ProfileNameValue>
          ) : (
            <ProfileNameEdit>
              <ProfileNameEditInput
                maxLength={15}
                value={editingName}
                onChangeText={setEditingName}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleSaveName}
              />
              <ProfileNameEditAction
                accessibilityLabel="닉네임 편집 완료"
                disabled={updateNickname.isPending}
                onPress={handleSaveName}
              >
                <IconComponent name="cancel" size={24} color={colors.gray[200]} />
              </ProfileNameEditAction>
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
          소도시 발굴을 시작한 지{' '}
          <ProfileStreakHighlight>{summary.daysSinceJoined}일</ProfileStreakHighlight>째
        </ProfileStreakText>
        {nameError ? <NameError>{nameError}</NameError> : null}
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

const ProfileNameEditAction = styled.Pressable({});

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

const ProfileStatus = styled.View({
  minHeight: 120,
  alignItems: 'center',
  justifyContent: 'center',
  gap: 12,
});
const ProfileStatusText = styled.Text({
  ...typography.body3.regular,
  color: colors.gray[600],
  textAlign: 'center',
});
const RetryButton = styled.Pressable({
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 9999,
  backgroundColor: colors.primary[50],
});
const RetryText = styled.Text({ ...typography.body3.medium, color: colors.primary[800] });
const NameError = styled.Text({ ...typography.caption1.regular, color: colors.semantic.warning });
