import styled from '@emotion/native';
import { type PropsWithChildren } from 'react';
import { Platform, type StyleProp, type ViewStyle } from 'react-native';

interface HeaderProps {
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  paddingBottom?: number;
}

export const ContentScroll = ({
  style,
  contentContainerStyle,
  paddingBottom = 0,
  children,
}: PropsWithChildren<HeaderProps>) => {
  return (
    <Scroll
      contentContainerStyle={{
        ...contentContainerStyle,
        ...Platform.select({
          android: {
            paddingBottom: 72 + paddingBottom,
          },
          web: {
            paddingBottom: paddingBottom,
          },
        }),
      }}
      style={style}
    >
      {children}
    </Scroll>
  );
};

const Scroll = styled.ScrollView({
  flex: 1,
  width: '100%',
});
