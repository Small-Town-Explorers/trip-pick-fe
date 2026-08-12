import {
  AiIcon_24,
  PlusIcon_24,
  MountainIcon_24,
  TreeIcon_24,
  FolderIcon_28,
  ProfileIcon_28,
  CarouselRightIcon_24,
} from './Icons.registry';

type IconComponent = React.ComponentType<{
  height?: number;
  width?: number;
  fill?: string;
}>;

type IconSizes = Record<number, IconComponent>;

export type IconName =
  'ai' | 'plus' | 'mountain' | 'tree' | 'folder' | 'profile' | 'carousel_right';

export const icons: Record<
  IconName,
  {
    label: string;
    sizes: IconSizes;
  }
> = {
  ai: {
    label: 'AI',
    sizes: {
      '24': AiIcon_24,
    },
  },
  plus: {
    label: 'Plus',
    sizes: {
      '24': PlusIcon_24,
    },
  },
  mountain: {
    label: 'Mountain',
    sizes: {
      '24': MountainIcon_24,
    },
  },
  tree: {
    label: 'Tree',
    sizes: {
      '24': TreeIcon_24,
    },
  },
  folder: {
    label: 'Folder',
    sizes: {
      '28': FolderIcon_28,
    },
  },
  profile: {
    label: 'Profile',
    sizes: {
      '28': ProfileIcon_28,
    },
  },
  carousel_right: {
    label: 'Carousel Right',
    sizes: {
      '24': CarouselRightIcon_24,
    },
  },
} as const;
