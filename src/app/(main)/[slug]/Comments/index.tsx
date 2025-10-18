import { getCommentsByPostId } from "@/../utils/supabase/queries";
import CommentForm from "../CommentForm";
import CommentItem from "../CommentItem";

type CommentsProps = {
  postId: number;
  userId: string | undefined;
};

const Comments = async ({ postId, userId }: CommentsProps) => {
  const { data: comments, error } = await getCommentsByPostId(postId);

  return (
    <div className="w-full max-w-xl mt-4">
      <h3 className="text-2xl font-bold mb-4 text-center">Comments</h3>
      {userId && <CommentForm postId={postId} userId={userId} />}
      
      <div className="space-y-4">
        {error && <p className="text-red-500 text-center">Error loading comments</p>}
        
        {comments && comments.length === 0 && (
          <p className="text-gray-500 text-center p-4">No comments yet. Be the first to comment!</p>
        )}
        
        {comments && comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} currentUserId={userId} />
        ))}
      </div>
    </div>
  );
};

export default Comments;
