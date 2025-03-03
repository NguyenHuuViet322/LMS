export interface ChildItem {
  id?: number | string;
  name?: string;
  icon?: any;
  children?: ChildItem[];
  item?: any;
  url?: any;
  color?: string;
  role?: RoleType[];
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: any;
  id?: number;
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: any;
}

import { RoleType } from '@/app/utils/constant';
import { uniqueId } from 'lodash';

const SidebarContent: MenuItem[] = [
  {
    heading: '',
    children: [
      // {
      //   name: 'Bàn làm việc',
      //   icon: 'solar:widget-add-line-duotone',
      //   id: uniqueId(),
      //   url: '/admin',
      //   role: [RoleType.ADMIN],
      // },
      {
        name: 'Trang chủ',
        icon: 'solar:home-outline',
        id: uniqueId(),
        url: '/pages',
      },
    ],
  },
  {
    heading: 'Học sinh',
    children: [
      {
        name: 'Dashboard',
        icon: 'solar:widget-add-line-duotone',
        id: uniqueId(),
        url: '/admin/ui/student/dashboard',
        role: [RoleType.STUDENT],
      },
    ]
  },
  {
    heading: 'Giáo viên',
    children: [
      {
        name: 'Dashboard',
        icon: 'solar:widget-add-line-duotone',
        id: uniqueId(),
        url: '/admin/ui/teacher/dashboard',
        role: [RoleType.TEACHER],
      },
      {
        name: 'Thông tin bản thân',
        icon: 'solar:book-bookmark-outline',
        id: uniqueId(),
        url: '/admin/ui/teacher/detail/0',
        role: [RoleType.TEACHER],
      },
    ]
  },
  {
    heading: 'Lớp học',
    children: [
      {
        name: 'Danh sách lớp học',
        icon: 'solar:book-bookmark-outline',
        id: uniqueId(),
        url: '/admin/ui/course',
        role: [RoleType.ADMIN, RoleType.TEACHER],
      },
    ],
  },
  {
    heading: 'Bài viết',
    children: [
      {
        name: 'Danh sách blog',
        icon: 'solar:hamburger-menu-line-duotone',
        id: uniqueId(),
        url: '/admin/ui/blog',
        role: [RoleType.ADMIN, RoleType.TEACHER],
      },
      {
        name: 'Phê duyệt blog',
        icon: 'solar:file-check-broken',
        id: uniqueId(),
        url: '/admin/ui/blog/approve',
        role: [RoleType.ADMIN],
      },
    ],
  },
  {
    heading: 'Quản lý giáo viên',
    children: [
      {
        name: 'Danh sách giáo viên',
        icon: 'solar:book-bookmark-outline',
        id: uniqueId(),
        url: '/admin/ui/teacher',
        role: [RoleType.ADMIN],
      }
      // {
      //   name: 'Thêm giáo viên',
      //   icon: 'solar:book-bookmark-outline',
      //   id: uniqueId(),
      //   url: '/admin/ui/teacher/add',
      //   role: [RoleType.ADMIN],
      // },
    ],
  },
  {
    heading: 'Quản lý học sinh',
    children: [
      {
        name: 'Danh sách học sinh',
        icon: 'solar:user-outline',
        id: uniqueId(),
        url: '/admin/ui/student',
        role: [RoleType.ADMIN],
      }
      // {
      //   name: 'Thêm giáo viên',
      //   icon: 'solar:book-bookmark-outline',
      //   id: uniqueId(),
      //   url: '/admin/ui/teacher/add',
      //   role: [RoleType.ADMIN],
      // },
    ],
  },
  {
    heading: 'Utilities',
    children: [
      {
        name: 'Typography',
        icon: 'solar:text-circle-outline',
        id: uniqueId(),
        url: '/admin/ui/typography',
        role: [RoleType.ADMIN],
      },
      {
        name: 'Table',
        icon: 'solar:bedside-table-3-linear',
        id: uniqueId(),
        url: '/admin/ui/table',
        role: [RoleType.ADMIN],
      },
      {
        name: 'Form',
        icon: 'solar:password-minimalistic-outline',
        id: uniqueId(),
        url: '/admin/ui/form',
        role: [RoleType.ADMIN],
      },
      {
        name: 'Shadow',
        icon: 'solar:airbuds-case-charge-outline',
        id: uniqueId(),
        url: '/admin/ui/shadow',
        role: [RoleType.ADMIN],
      },
    ],
  },
  {
    heading: 'Extra',
    children: [
      {
        name: 'Icons',
        icon: 'solar:smile-circle-outline',
        id: uniqueId(),
        url: '/admin/icons/solar',
        role: [RoleType.ADMIN],
      },
      {
        name: 'Sample Page',
        icon: 'solar:notes-minimalistic-outline',
        id: uniqueId(),
        url: '/admin/sample-page',
        role: [RoleType.ADMIN],
      },
    ],
  },
];

export default SidebarContent;
