const page = ({ params }: { params: { id: string } }) => {
    return (
        <div>
            <h1>Sửa thông tin khóa học {params.id}</h1>
        </div>
    )
}

export default page;
