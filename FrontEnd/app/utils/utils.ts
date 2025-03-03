import { notify } from '@/components/Alert/Alert';
import { callUploadFile } from './api';
import { RoleType } from './constant';

export const getUserData = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

export const getRole = (user) => {
  const role = user?.role?.trim().toUpperCase();

  switch (role) {
    case 'STUDENT':
      return RoleType.STUDENT;
    case 'TEACHER':
      return RoleType.TEACHER;
    case 'ACADEMIC_AFFAIR':
      return RoleType.ACADEMIC_AFFAIR;
    case 'ADMIN':
      return RoleType.ADMIN;
    default:
      return RoleType.NULL;
  }
};

export const getCurrentUserRole = () => {
  const user = getUserData()
  const role = user?.role?.trim().toUpperCase();

  switch (role) {
    case 'STUDENT':
      return RoleType.STUDENT;
    case 'TEACHER':
      return RoleType.TEACHER;
    case 'ACADEMIC_AFFAIR':
      return RoleType.ACADEMIC_AFFAIR;
    case 'ADMIN':
      return RoleType.ADMIN;
    default:
      return RoleType.NULL;
  }
};

export const isLoading = (): boolean => {
  return !!localStorage.getItem('loading');
};

export const formattedDate = (dateString, format = 'dd/mm/yyyy') => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return format
    .replace('dd', day)
    .replace('mm', month)
    .replace('yyyy', String(year))
    .replace('yy', String(year).slice(-2));
};

export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await callUploadFile(file);

    if (response?.web_view_link) {
      return response;
    } else {
      notify(`Lỗi upload file: ${file.name}`, 'error');
      return null;
    }
  } catch (error) {
    notify(`Lỗi upload file: ${file.name} - ${error.message}`, 'error');
    return null;
  }
};

export const processGoogleDriveLink = (driveLink) => {
  console.log('driveLink', driveLink);

  if (typeof driveLink !== 'string') {
    console.error('Invalid Google Drive link:', driveLink);
    return '';
  }

  const match = driveLink.match(/[-\w]{25,}/);

  return match
    ? `https://drive.google.com/thumbnail?id=${match[0]}&sz=w2000`
    : driveLink;
};
