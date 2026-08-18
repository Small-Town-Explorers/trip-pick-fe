import {
  AiIcon_24,
  PlusIcon_24,
  MountainIcon_24,
  TreeIcon_24,
  FolderIcon_28,
  ProfileIcon_28,
  CarouselLeftIcon_24,
  CarouselRightIcon_24,
  ShareIcon_24,
  PencilIcon_24,
  EditIcon_24,
  RetryIcon_24,
  CheckCircleIcon_24,
  TravelIcon_20,
} from './Icons.registry';

type IconComponent = React.ComponentType<{
  height?: number;
  width?: number;
  fill?: string;
}>;

type IconSizes = Record<number, IconComponent>;

export type IconName =
  | 'ai'
  | 'plus'
  | 'mountain'
  | 'tree'
  | 'folder'
  | 'profile'
  | 'carousel_left'
  | 'carousel_right'
  | 'share'
  | 'pencil'
  | 'edit'
  | 'retry'
  | 'check_circle'
  | 'travel';

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
  carousel_left: {
    label: 'Carousel Left',
    sizes: {
      '24': CarouselLeftIcon_24,
    },
  },
  carousel_right: {
    label: 'Carousel Right',
    sizes: {
      '24': CarouselRightIcon_24,
    },
  },
  share: {
    label: 'Share',
    sizes: {
      '24': ShareIcon_24,
    },
  },
  pencil: {
    label: 'Pencil',
    sizes: {
      '24': PencilIcon_24,
    },
  },
  edit: {
    label: 'Edit',
    sizes: {
      '24': EditIcon_24,
    },
  },
  retry: {
    label: 'Retry',
    sizes: {
      '24': RetryIcon_24,
    },
  },
  check_circle: {
    label: 'Check Circle',
    sizes: {
      '24': CheckCircleIcon_24,
    },
  },
  travel: {
    label: 'Travel',
    sizes: {
      '20': TravelIcon_20,
    },
  },
} as const;
