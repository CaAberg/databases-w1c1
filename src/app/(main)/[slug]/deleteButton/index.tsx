'use client'
import { DeletePost } from '../../../../../actions/deletePost';

 const DeleteButton = ({postId}:{postId: number}) => {
    return <button onClick={ () => DeletePost(postId) }>delete post</button>
}

export default DeleteButton;