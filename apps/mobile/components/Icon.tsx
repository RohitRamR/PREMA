import React from 'react';
import { Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type IconProps = {
  name: string;
  size?: number;
  color?: string;
  className?: string;
};

// Comprehensive map of material-symbols/custom names to MaterialIcons names
const iconMap: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  // Navigation
  arrow_back: 'arrow-back',
  arrow_forward: 'arrow-forward',
  arrow_back_ios_new: 'arrow-back-ios',
  arrow_forward_ios: 'arrow-forward-ios',
  chevron_left: 'chevron-left',
  chevron_right: 'chevron-right',
  expand_more: 'expand-more',
  expand_less: 'expand-less',
  menu: 'menu',
  close: 'close',
  more_vert: 'more-vert',
  more_horiz: 'more-horiz',

  // People & Profile
  person: 'person',
  people: 'people',
  account_circle: 'account-circle',
  contacts: 'contacts',
  group: 'group',

  // Verification & Trust
  verified: 'verified',
  verified_user: 'verified-user',
  enhanced_encryption: 'enhanced-encryption',
  lock: 'lock',
  lock_open: 'lock-open',
  lock_open_right: 'lock-open',
  shield: 'shield',
  check: 'check',
  check_circle: 'check-circle',
  done_all: 'done-all',

  // Love & Relationship
  favorite: 'favorite',
  favorite_border: 'favorite-border',
  heart_broken: 'heart-broken',

  // Stars & Awards
  stars: 'stars',
  star: 'star',
  auto_awesome: 'auto-awesome',
  workspace_premium: 'workspace-premium',
  insights: 'insights',
  psychology: 'psychology',

  // Location & Map
  location_on: 'location-on',
  map: 'map',
  directions: 'directions',
  add_location_alt: 'add-location-alt',

  // Time & Schedule
  schedule: 'schedule',
  calendar_today: 'calendar-today',
  event_available: 'event-available',
  timer: 'timer',
  access_time: 'access-time',

  // Communication
  chat: 'chat',
  chat_bubble: 'chat-bubble',
  forum: 'forum',
  message: 'message',
  mark_chat_unread: 'mark-chat-unread',
  send: 'send',
  reply: 'reply',
  mic: 'mic',
  mic_off: 'mic-off',
  notifications: 'notifications',
  notifications_none: 'notifications-none',
  phone: 'phone',

  // Actions
  add: 'add',
  add_circle: 'add-circle-outline',
  edit: 'edit',
  edit_note: 'edit-note',
  delete: 'delete',
  share: 'share',
  bookmark_border: 'bookmark-border',
  bookmark: 'bookmark',
  info: 'info',
  help: 'help',
  flag: 'flag',
  report: 'report',
  search: 'search',
  tune: 'tune',
  settings: 'settings',
  filter_list: 'filter-list',
  sort: 'sort',
  refresh: 'refresh',
  upload: 'upload',
  download: 'download',

  // Photos & Media
  photo_camera: 'photo-camera',
  camera: 'camera-alt',
  image: 'image',
  play_arrow: 'play-arrow',
  pause: 'pause',
  stop: 'stop',
  volume_down: 'volume-down',
  volume_up: 'volume-up',
  volume_off: 'volume-off',
  headphones: 'headphones',

  // Nature & Lifestyle
  wb_sunny: 'wb-sunny',
  sunny: 'wb-sunny',
  eco: 'eco',
  spa: 'spa',
  yard: 'deck',
  park: 'park',
  local_cafe: 'local-cafe',
  coffee: 'local-cafe',
  restaurant: 'restaurant',
  hotel: 'hotel',
  bed: 'bed',

  // Symbols
  balance: 'scale',
  bedtime: 'nights-stay',
  routine: 'access-time',
  filter_vintage: 'filter-vintage',
  format_quote: 'format-quote',
  all_inclusive: 'all-inclusive',
  hub: 'hub',
  sync_problem: 'sync-problem',
  handshake: 'handshake',

  // Status & Indicators
  hourglass_top: 'hourglass-top',
  hourglass_bottom: 'hourglass-bottom',
  circle: 'circle',
  radio_button_checked: 'radio-button-checked',
  radio_button_unchecked: 'radio-button-unchecked',

  // Navigation arrows (alternate)
  arrow_upward: 'arrow-upward',
  arrow_downward: 'arrow-downward',

  // Misc
  wb_twilight: 'wb-twilight',
  nutrition: 'restaurant',
  architecture: 'architecture',
  spark: 'auto-awesome',
  'format_image_left': 'image',
  visibility_off: 'visibility-off',
  add_location: 'add-location',
  work: 'work',
};

export default function Icon({ name, size = 20, color = '#172b3a', className }: IconProps) {
  const iconName = iconMap[name] || iconMap[name.replace(/_/g, '-')] || (name.replace(/_/g, '-') as keyof typeof MaterialIcons.glyphMap);

  try {
    return <MaterialIcons name={iconName} size={size} color={color} />;
  } catch (e) {
    return <Text style={{ fontSize: size, color }}>•</Text>;
  }
}
