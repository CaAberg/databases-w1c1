'use client'

import { useMutation } from '@tanstack/react-query';
import { DeletePost } from '@/../actions/delete-post';

 const DeleteButton = ({postId}:{postId: number}) => {
    const {mutate, error} = useMutation({
        mutationFn: DeletePost,
        
    })
    return <button className='bg-red-500 text-white p-2 rounded hover:bg-red-600 hover:cursor-pointer' onClick= {() => mutate(postId)}>Delete post</button>
}

export default DeleteButton;