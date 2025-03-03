'use client'

import { RoleType } from "@/app/utils/constant";
import { getRole, getUserData } from "@/app/utils/utils";
import { Box, Typography, Skeleton } from "@mui/material";
import { Card } from "flowbite-react";
import { useEffect, useState } from "react";
import CourseDetailData from "./CourseDetailData";
import { callApi } from "@/app/utils/api";
import Image from "next/image";
import { SubjectData } from "@/app/utils/constant";
import InfoIcon from '@mui/icons-material/Info';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import DescriptionIcon from '@mui/icons-material/Description';
import EventIcon from '@mui/icons-material/Event';
import TabPanel from '@/app/admin/components/dashboard/TabPanel';
import CourseMember from "./CourseMember";
import Assignment from "./Assignment";
import CourseRoom from "./CourseRoom";
import CourseDocument from "./CourseDocument";
import CourseLesson from "./CourseLesson";

const CourseDetail = (props: any) => {
    const { id } = props;
    const [activeTab, setActiveTab] = useState('info');
    const role = getRole(getUserData());
    const [isLoading, setIsLoading] = useState(false);
    const [course, setCourse] = useState<any>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await callApi(`courses/${id}`, 'GET');
            setCourse(res);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [id, role]) // eslint-disable-line react-hooks/exhaustive-deps

    /**
     * @TODO Phân quyền lại
     */
    const tabs = [
        { key: 'info', title: 'Thông tin', icon: <InfoIcon fontSize="small" />, component: <CourseDetailData course={course} role={role} />, role: [RoleType.ADMIN, RoleType.TEACHER, RoleType.STUDENT] },
        { key: 'students', title: 'Danh sách học sinh', icon: <PeopleIcon fontSize="small" />, component: <CourseMember role={role} />, role: [RoleType.ADMIN, RoleType.TEACHER] },
        { key: 'assignments', title: 'Bài tập', icon: <AssignmentIcon fontSize="small" />, component: <Assignment />, role: [RoleType.ADMIN, RoleType.TEACHER, RoleType.STUDENT] },
        { key: 'rooms', title: 'Gán phòng', icon: <MeetingRoomIcon fontSize="small" />, component: <CourseRoom  course={course}/>, role: [RoleType.ADMIN, RoleType.TEACHER] },
        { key: 'documents', title: 'Tài liệu', icon: <DescriptionIcon fontSize="small" />, component: <CourseDocument />, role: [RoleType.ADMIN, RoleType.TEACHER] },
        { key: 'sessions', title: 'Danh sách buổi học', icon: <EventIcon fontSize="small" />, component: <CourseLesson course={course} />, role: [RoleType.ADMIN, RoleType.TEACHER] },
    ].filter(tab => tab.role.includes(role));

    if (isLoading) {
        return (
            <Card>
                <Box sx={{ width: '100%' }}>
                    <div className="flex items-center gap-4 mb-4">
                        <Skeleton variant="rectangular" width={80} height={80} />
                        <div className="flex-1">
                            <Skeleton variant="text" width="75%" height={32} />
                            <Skeleton variant="text" width="50%" height={16} />
                        </div>
                    </div>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Skeleton variant="rectangular" width="100%" height={40} />
                    </Box>
                </Box>
            </Card>
        );
    }

    return (
        <Card className="border border-blue-200  shadow-sm shadow-blue-200">
            <Box sx={{ width: '100%' }}>
                {course && SubjectData.map((subject) => {
                    if (course.code.substring(0, 2) === subject.code_fragment) {
                        return (
                            <div key={subject.id} className="flex items-center gap-4 mb-4">
                                <Image src={subject.image} alt={subject.name} className="w-20 h-20" width={64} height={64} />
                                <div>
                                    <Typography variant="h4" className="font-bold">{course.name}</Typography>
                                    <Typography variant="body1" className="text-gray-600">{course.code}</Typography>
                                </div>
                            </div>
                        )
                    }
                    return null;
                })}

                <TabPanel
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                <div className="bg-white p-6 rounded-lg">
                    {tabs.find(tab => tab.key === activeTab)?.component}
                </div>
            </Box>
        </Card>
    )
}

export default CourseDetail;
