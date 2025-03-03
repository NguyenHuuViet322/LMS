'use client';
import React, { useEffect, useState } from 'react';
import { Button, Label, TextInput, Select, Card } from 'flowbite-react';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';
import useForm from '@/app/hooks/useForm';
import { notify } from '@/components/Alert/Alert';
import { callApi } from '@/app/utils/api';
import RequiredStar from '@/app/admin/components/dashboard/RequiredStar';
import Header from '@/app/admin/components/dashboard/Header';
import { TagType } from '@/app/utils/constant';
import CourseSchedule from '../Component/CourseSchedule';

export type SelectOption = {
  value: string;
  label: string;
};

const daysOfWeek = [
  'Chủ Nhật',
  'Thứ 2',
  'Thứ 3',
  'Thứ 4',
  'Thứ 5',
  'Thứ 6',
  'Thứ 7',
];

const CreateClassForm = () => {
  const [isLoading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const { values, handleChange, resetForm, setValues } = useForm({
    name: '',
    start_date: '',
    end_date: '',
    fee: '',
    tags: [],
    course_times: [],
  });

  const handleTagChange = (e, type) => {
    const updatedTags = [...values.tags];

    if (type === TagType.GRADE) {
      updatedTags[0] = e.target.value;
    } else {
      updatedTags[1] = e.target.value;
    }

    setValues((prev) => ({
      ...prev,
      tags: updatedTags,
    }));
    console.log(values.tags);
  };

  const handleAddCourseTime = () => {
    setValues((prev) => ({
      ...prev,
      course_times: [
        ...prev.course_times,
        { day: '', start_time: '', end_time: '' },
      ],
    }));
  };

  const handleRemoveCourseTime = (index) => {
    const updatedCourseTimes = [...values.course_times];
    updatedCourseTimes.splice(index, 1);
    setValues((prev) => ({
      ...prev,
      course_times: updatedCourseTimes,
    }));
  };

  const handleCourseTimeChange = (index, field, value) => {
    const updatedCourseTimes = [...values.course_times];
    updatedCourseTimes[index][field] = value;
    setValues((prev) => ({
      ...prev,
      course_times: updatedCourseTimes,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!values.name.trim() || !values.start_date || !values.end_date) {
      notify('Vui lòng điền đầy đủ thông tin!', 'warning');
      return;
    }

    const body = {
      name: values.name.trim(),
      start_date: values.start_date,
      end_date: values.end_date,
      fee: parseFloat(values.fee),
      course_times: values.course_times,
      tags: values.tags,
    };

    try {
      setLoading(true);
      await callApi('classes', 'POST', body);
      notify('Tạo lớp học thành công!', 'success');
      resetForm();
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await callApi('tags');
        const tags = response.data;

        setSubjects(tags.filter((p) => p.type === 'SUBJECT'));
        setGrades(tags.filter((p) => p.type === 'GRADE'));
      } catch (error) {
        notify(error.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg shadow-md bg-white dark:bg-gray-900 p-6 w-full space-y-6"
    >
      <Header
        icon="solar:document-bold"
        title="Tạo mới lớp học"
        showButton={false}
        buttonIcon={undefined}
        buttonText={undefined}
        buttonLink={undefined}
      />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-6 space-y-4">
          <div>
            <div className="mb-1 block">
              <Label htmlFor="name" value="Tên lớp học">
                <RequiredStar />
              </Label>
            </div>
            <TextInput
              id="name"
              name="name"
              type="text"
              placeholder="Nhập tên lớp học"
              value={values.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <div className="mb-1 block">
              <Label htmlFor="start_date" value="Ngày bắt đầu">
                <RequiredStar />
              </Label>
            </div>
            <TextInput
              id="start_date"
              name="start_date"
              type="date"
              value={values.start_date}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <div className="mb-1 block">
              <Label htmlFor="end_date" value="Ngày kết thúc">
                <RequiredStar />
              </Label>
            </div>
            <TextInput
              id="end_date"
              name="end_date"
              type="date"
              value={values.end_date}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <div className="mb-1 block">
              <Label htmlFor="fee" value="Học phí (VND)">
                <RequiredStar />
              </Label>
            </div>
            <TextInput
              id="fee"
              name="fee"
              type="number"
              placeholder="Nhập học phí"
              value={values.fee}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="col-span-12 md:col-span-6 space-y-4">
          <div>
            <div className="mb-1 block">
              <Label htmlFor="tags" value="Môn học" />
            </div>
            <Select
              id="tags"
              onChange={(e) => handleTagChange(e, TagType.SUBJECT)}
              className="rounded-md"
            >
              {subjects.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <div className="mb-1 block">
              <Label htmlFor="tags" value="Khối học" />
            </div>
            <Select
              id="tags"
              onChange={(e) => handleTagChange(e, TagType.GRADE)}
              className="rounded-md"
            >
              {grades.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="col-span-12 space-y-4 relative">
          <CourseSchedule
            values={values}
            daysOfWeek={daysOfWeek}
            handleAddCourseTime={handleAddCourseTime}
            handleCourseTimeChange={handleCourseTimeChange}
            handleRemoveCourseTime={handleRemoveCourseTime}
          />
        </div>

        <div className="col-span-12 flex gap-3 mt-4">
          <Button color="primary" type="submit" isProcessing={isLoading}>
            Tạo lớp học
          </Button>
          <Button color="gray" type="button" onClick={resetForm}>
            Xoá form
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CreateClassForm;
