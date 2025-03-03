'use client';
import React, { useEffect, useState } from 'react';
import { Dropdown, Button, TextInput } from 'flowbite-react';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { Icon } from '@iconify/react';
import { Table } from 'flowbite-react';
import { callApi } from '@/app/utils/api';
import { notify } from '@/components/Alert/Alert';
import BlogSpinner from '@/app/admin/components/dashboard/BlogSpinner';
import Header from '@/app/admin/components/dashboard/Header';
import Link from 'next/link';

const CourseList = () => {
  const [isLoading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const limit = 10;
  const [offset, setOffset] = useState(0);
  const [filter, setFilter] = useState({
    name: '',
    tag_ids: [],
    from_start_date: '',
    to_start_date: '',
    from_fee: '',
    to_fee: '',
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const params = {
          limit,
          offset,
        };
        const response = await callApi('courses', 'GET', null, params);

        setCourses(response.data);
      } catch (error) {
        notify(error.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [limit, offset, filter]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePagination = (direction) => {
    if (direction === 'next') {
      setOffset(offset + limit);
    } else if (direction === 'prev' && offset > 0) {
      setOffset(offset - limit);
    }
  };

  const tableActionData = [
    {
      icon: 'solar:pen-new-square-broken',
      listtitle: 'Sửa',
    },
    {
      icon: 'solar:trash-bin-minimalistic-outline',
      listtitle: 'Xoá',
    },
  ];

  return (
    <>
      <div className="rounded-lg dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
        <Header
          icon="solar:document-bold"
          title="Danh sách lớp học"
          showButton={true}
          buttonIcon="solar:add-circle-outline"
          buttonText="Tạo mới"
          buttonLink="/admin/ui/course/add"
        />

        <div className="mt-3">
          <BlogSpinner isLoading={isLoading}></BlogSpinner>
          <div className="flex gap-3 mb-4">
            <TextInput
              name="name"
              placeholder="Tìm kiếm theo tên"
              onChange={handleFilterChange}
              value={filter.name}
              className="w-1/4"
            />
            <TextInput
              name="from_start_date"
              type="date"
              onChange={handleFilterChange}
              value={filter.from_start_date}
              className="w-1/4"
            />
            <TextInput
              name="to_start_date"
              type="date"
              onChange={handleFilterChange}
              value={filter.to_start_date}
              className="w-1/4"
            />
            <Button onClick={() => setOffset(0)}>Lọc</Button>
          </div>

          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Mã khóa học</Table.HeadCell>
                <Table.HeadCell>Thông tin khóa học</Table.HeadCell>
                <Table.HeadCell>Giảng viên</Table.HeadCell>
                <Table.HeadCell>Ngày bắt đầu</Table.HeadCell>
                <Table.HeadCell>Thao tác</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y divide-border dark:divide-darkborder">
                {courses.map((item, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <Link href={`/admin/ui/course/${item.id}`} className="hover:text-primary">
                        <h5 className="text-sm text-wrap font-bold">{item.code}</h5>
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex gap-3 items-center">
                        <Link href={`/admin/ui/course/${item.id}`} className="hover:text-primary">
                          <h5 className="text-sm font-bold">{item.name}</h5>
                        </Link>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <h5 className="text-sm text-wrap">{item.teacher?.name ?? ''}</h5>
                    </Table.Cell>
                    <Table.Cell>
                      <h5 className="text-sm text-wrap">{new Date(item.start_date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</h5>
                    </Table.Cell>
                    <Table.Cell>
                      <Dropdown label=""
                        dismissOnClick={false}
                        renderTrigger={() => (
                          <span className="h-9 w-9 flex justify-center items-center rounded-full hover:bg-lightprimary hover:text-primary cursor-pointer">
                            <HiOutlineDotsVertical size={22} />
                          </span>
                        )}>
                        {tableActionData.map((action, index) => (
                          <Dropdown.Item key={index} className="flex gap-3">
                            <Icon icon={action.icon} height={18} />
                            <span>{action.listtitle}</span>
                          </Dropdown.Item>
                        ))}
                      </Dropdown>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>

          <div className="mt-4 flex justify-between">
            <Button
              onClick={() => handlePagination('prev')}
              disabled={offset === 0}
            >
              Trang trước
            </Button>
            <Button onClick={() => handlePagination('next')}>Trang sau</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseList;
