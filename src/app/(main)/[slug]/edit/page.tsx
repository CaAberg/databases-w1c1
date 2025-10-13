import {getSinglePost} from "@/../utils/supabase/queries";
import EditForm from "./EditForm"

const EditPage = async ({params}: {params: {slug: string}}) => {
    const {slug} = await params;
    const {data} = await getSinglePost(slug);
    return (
        <div className="w-full justify-center flex p-4">
            {data &&
            <EditForm postId={data.id} initialValues={{ title: data.title, content: data.content, images: data.images}} />}
        </div>
    );
}

export default EditPage;