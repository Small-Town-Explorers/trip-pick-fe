import Landscape1 from '@assets/images/mock/landscape/landscape1.png';
import Landscape2 from '@assets/images/mock/landscape/landscape2.png';
import { IconComponent } from '@components/Icons';
import styled from '@emotion/native';
import { colors, createShadow, shadows, typography, withAlpha } from '@styles';
import { useState } from 'react';
import { type ImageSourcePropType } from 'react-native';
import { appRoutes, useAppNavigation } from '../../navigation';
import { ConfirmModal } from '@components/Modal';
import { Header } from '@components/Header';

const initialFolders = [
  { id: 'upcoming', name: '다가오는 여행', image: Landscape1, count: 4 },
  { id: 'saved', name: '저장한 코스', image: Landscape2, count: 12 },
  { id: 'past', name: '지난 여행', image: Landscape1, count: 3 },
];

interface MyTripDeleteModalModalProps {
  visible: boolean;
  name: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const Description = styled.Text({
  ...typography.body2.regular,
  color: colors.gray[600],
  textAlign: 'center',
});

const MyTripDeleteModal = ({ visible, name, onCancel, onConfirm }: MyTripDeleteModalModalProps) => {
  return (
    <ConfirmModal
      visible={visible}
      title="여행 코스 삭제"
      onCancel={onCancel}
      onConfirm={onConfirm}
    >
      <Description>
        &apos;{name}&apos;코스를{`\n`}삭제하시겠습니까?
      </Description>
    </ConfirmModal>
  );
};

export function MyTripsScreen() {
  const { navigate } = useAppNavigation();
  const [folders, setFolders] = useState(initialFolders);
  const [opendMenuId, setOpenedMenuId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const deleteFolder = () => {
    setFolders((current) => current.filter((folder) => folder.id !== selectedId));
    setSelectedId('');
    setIsDeleteModalVisible(false);
  };

  return (
    <Screen>
      <Header title="내 여행" />
      <Scroll contentContainerStyle={contentStyle}>
        <SectionTitle>내 여행 보관함</SectionTitle>
        <Grid>
          <NewFolder accessibilityRole="button">
            <IconComponent name="plus" color={colors.primary[700]} size={40} />
            <NewFolderText>새 보관함</NewFolderText>
          </NewFolder>
          {folders.map((folder) => (
            <Folder
              key={folder.id}
              accessibilityRole="button"
              onPress={() => {
                if (opendMenuId) {
                  setOpenedMenuId(null);
                  return;
                }
                navigate(appRoutes.myTripFolder(folder.id));
              }}
            >
              <FolderImage
                source={folder.image as unknown as ImageSourcePropType}
                resizeMode="cover"
              />
              <FolderInfo>
                <FolderInfoHeader>
                  <FolderName>{folder.name}</FolderName>
                  <FolderEditButton
                    accessibilityRole="button"
                    accessibilityLabel={`${folder.name} 메뉴`}
                    onPress={(event) => {
                      event.stopPropagation();
                      setOpenedMenuId((current) => (current === folder.id ? null : folder.id));
                    }}
                  >
                    <IconComponent name="donut_menu" />
                  </FolderEditButton>
                </FolderInfoHeader>
                <Count>{folder.count}개의 코스</Count>
              </FolderInfo>
              {opendMenuId === folder.id && (
                <DeleteButton
                  accessibilityRole="button"
                  accessibilityLabel={`${folder.name} 삭제`}
                  onPress={(event) => {
                    event.stopPropagation();
                    setOpenedMenuId(null);
                    setIsDeleteModalVisible(true);
                    setSelectedId(folder.id);
                    setSelectedName(folder.name);
                  }}
                >
                  <DeleteText>삭제</DeleteText>
                  <IconComponent name="delete" color="#F04438" size={20} />
                </DeleteButton>
              )}
            </Folder>
          ))}
        </Grid>
        <MyTripDeleteModal
          visible={isDeleteModalVisible}
          name={selectedName}
          onConfirm={deleteFolder}
          onCancel={() => {
            setIsDeleteModalVisible(false);
          }}
        />
      </Scroll>
    </Screen>
  );
}

const Screen = styled.View({ flex: 1, width: '100%', backgroundColor: '#FFFFFF' });
const Scroll = styled.ScrollView({ position: 'relative', flex: 1 });
const contentStyle = { padding: 20, gap: 20 } as const;
const SectionTitle = styled.Text({ ...typography.heading2.medium, color: colors.gray[1000] });
const Grid = styled.View({ flexDirection: 'row', flexWrap: 'wrap', gap: 12 });
const NewFolder = styled.Pressable({
  width: '48%',
  height: 190,
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  backgroundColor: 'white',
  borderRadius: 12,
  ...shadows[2],
});
const NewFolderText = styled.Text({ ...typography.body1.medium, color: colors.gray[800] });
const Folder = styled.Pressable({
  width: '48%',
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  borderWidth: 1,
  borderColor: colors.gray[100],
  ...shadows[2],
});
const FolderImage = styled.Image({
  width: '100%',
  height: 130,
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
});
const FolderInfo = styled.View({ padding: 12, gap: 4 });
const FolderInfoHeader = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
});
const FolderName = styled.Text({ ...typography.body2.medium, color: colors.gray[1000] });
const FolderEditButton = styled.Pressable({ padding: 2 });
const Count = styled.Text({ ...typography.caption3.regular, color: colors.gray[600] });
const DeleteButton = styled.Pressable({
  position: 'absolute',
  right: -10,
  bottom: -14,
  zIndex: 30,
  height: 44,
  paddingHorizontal: 14,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  backgroundColor: '#FFFFFF',
  borderRadius: 10,
  ...createShadow(0, 4, 20, 0, withAlpha(colors.gray[1000], 0.12)),
});
const DeleteText = styled.Text({ ...typography.body2.medium, color: colors.gray[600] });
