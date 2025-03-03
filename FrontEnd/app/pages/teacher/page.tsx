import { Metadata } from 'next';
import TeacherList from './TeacherList';

export const metadata: Metadata = {
  title: 'Giáo viên Trung tâm',
  description: 'Danh sách giáo viên tại trung tâm Happy Edu Hub',
};

const page = () => {
  return (
    <>
      <TeacherList></TeacherList>
    </>
  );
};

export default page;
