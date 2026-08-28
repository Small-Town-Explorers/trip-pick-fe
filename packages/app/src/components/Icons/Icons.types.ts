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
  ArrowRightIcon_24,
  WaterWaveIcon_20,
  VehicleIcon_20,
  ShuffleIcon_20,
  KayakingIcon_24,
  LocalDiningIcon_24,
  LocalMallIcon_24,
  StorefrontIcon_24,
  CastleIcon_24,
  CrossIcon_24,
  SendIcon_20,
  DragIcon_24,
  AddLocationIcon_24,
  EditLocationIcon_24,
  TravelExploreIcon_24,
  MapIcon_24,
  SearchIcon_24,
  CancelIcon_24,
  DeleteIcon_20,
  DonutMenuIcon_20,
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
  | 'travel'
  | 'arrow_right'
  | 'water_wave'
  | 'vehicle'
  | 'shuffle'
  | 'kayaking'
  | 'local_dining'
  | 'local_mall'
  | 'storefront'
  | 'castle'
  | 'cross'
  | 'send'
  | 'drag'
  | 'add_location'
  | 'edit_location'
  | 'travel_explore'
  | 'map'
  | 'search'
  | 'cancel'
  | 'delete'
  | 'donut_menu';

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
  arrow_right: {
    label: 'Arrow Right',
    sizes: {
      '24': ArrowRightIcon_24,
    },
  },
  water_wave: {
    label: 'Water Wave',
    sizes: {
      '20': WaterWaveIcon_20,
    },
  },
  vehicle: {
    label: 'Vehicle',
    sizes: {
      '20': VehicleIcon_20,
    },
  },
  shuffle: {
    label: 'Shuffle',
    sizes: {
      '20': ShuffleIcon_20,
    },
  },
  kayaking: {
    label: 'Kayaking',
    sizes: {
      '24': KayakingIcon_24,
    },
  },
  local_dining: {
    label: 'Local Dining',
    sizes: {
      '24': LocalDiningIcon_24,
    },
  },
  local_mall: {
    label: 'Local Mall',
    sizes: {
      '24': LocalMallIcon_24,
    },
  },
  storefront: {
    label: 'Storefront',
    sizes: {
      '24': StorefrontIcon_24,
    },
  },
  castle: {
    label: 'Castle',
    sizes: {
      '24': CastleIcon_24,
    },
  },
  cross: {
    label: 'Cross',
    sizes: {
      '24': CrossIcon_24,
    },
  },
  send: {
    label: 'Send',
    sizes: {
      '20': SendIcon_20,
    },
  },
  drag: {
    label: 'Drag',
    sizes: {
      '24': DragIcon_24,
    },
  },
  add_location: {
    label: 'Add Location',
    sizes: {
      '24': AddLocationIcon_24,
    },
  },
  edit_location: {
    label: 'Edit Location',
    sizes: {
      '24': EditLocationIcon_24,
    },
  },
  travel_explore: {
    label: 'Travel Explore',
    sizes: {
      '24': TravelExploreIcon_24,
    },
  },
  map: {
    label: 'Map',
    sizes: {
      '24': MapIcon_24,
    },
  },
  search: {
    label: 'Search',
    sizes: {
      '24': SearchIcon_24,
    },
  },
  cancel: {
    label: 'Cancel',
    sizes: {
      '24': CancelIcon_24,
    },
  },
  delete: {
    label: 'Delete',
    sizes: {
      '20': DeleteIcon_20,
    },
  },
  donut_menu: {
    label: 'Donut Menu',
    sizes: {
      '20': DonutMenuIcon_20,
    },
  },
} as const;
