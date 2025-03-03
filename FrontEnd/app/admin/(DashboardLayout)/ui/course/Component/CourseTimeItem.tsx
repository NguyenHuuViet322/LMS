import { HiOutlineTrash } from 'react-icons/hi';
import { Label, Select, TextInput } from 'flowbite-react';

const CourseTimeItem = ({
  courseTime,
  index,
  daysOfWeek,
  onChange,
  onRemove,
}) => {
  return (
    <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-sm shadow-sm hover:shadow-md transition duration-200">
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
      >
        <HiOutlineTrash className="w-5 h-5" />
      </button>

      <div>
        <Label className="mb-1 block">Thứ trong tuần</Label>
        <Select
          value={courseTime.day}
          onChange={(e) => onChange(index, 'day', e.target.value)}
          className="w-full"
        >
          <option value="">Chọn thứ</option>
          {daysOfWeek.map((day, index) => (
            <option key={day} value={index}>
              {day}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label className="mb-1 block">Giờ bắt đầu</Label>
        <TextInput
          type="time"
          value={courseTime.start_time}
          onChange={(e) => onChange(index, 'start_time', e.target.value)}
          className="w-full"
        />
      </div>

      <div>
        <Label className="mb-1 block">Giờ kết thúc</Label>
        <TextInput
          type="time"
          value={courseTime.end_time}
          onChange={(e) => onChange(index, 'end_time', e.target.value)}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default CourseTimeItem;
