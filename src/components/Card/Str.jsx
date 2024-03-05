import React, { useState, useEffect } from 'react';
import Post from '/Users/nickfox/Desktop/Coding/CodeAcademy/Reddit Project/reddit/src/features/Post/Post.jsx';
import Comment from '/Users/nickfox/Desktop/Coding/CodeAcademy/Reddit Project/reddit/src/features/Comment/Comment.jsx';
import { FaRegTrashCan } from "react-icons/fa6";
import { TiEdit } from 'react-icons/ti';
import { TbArrowBigDown } from "react-icons/tb";
import { TbArrowBigUp } from "react-icons/tb";
import { RiReplyFill } from "react-icons/ri";
import { FaRegComment } from "react-icons/fa";

const Str = ({ content, completeStr, removeStr, updateStr, increment, decrement }) => {
  const [edit, setEdit] = useState({
    id: null,
    value: ''
  });
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [replyingToStrId, setReplyingToStrId] = useState(null);
  const [showComments, setShowComments] = useState(content.map(() => true)); // State to track individual show/hide comments
  const [numberOfComments, setNumberOfComments] = useState({}); // State to store the number of comments for each str.id
  const [showAddCommentInput, setShowAddCommentInput] = useState(false);

  // Function to toggle comments visibility
  const toggleComments = (index) => {
    setShowComments(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  // Function to handle adding a comment
  const handleAddComment = (postId) => {
    if (newComment.trim() === '') return; // Prevent adding empty comments
    setComments(prevComments => ({
      ...prevComments,
      [postId]: [...(prevComments[postId] || []), { text: newComment, count: 0 }]
    }));
    setNewComment(''); // Clear the input field after adding the comment
    setReplyingToStrId(null); // Reset replyingToStrId
    setShowAddCommentInput(false); // Hide the input field for adding a comment
  };

  // Function to handle removing a comment
  const handleRemoveComment = (postId, commentIndex) => {
    setComments(prevComments => ({
      ...prevComments,
      [postId]: prevComments[postId].filter((_, index) => index !== commentIndex)
    }));
  };

  // Function to handle editing a comment
  const handleEditComment = (postId, commentIndex, editedComment) => {
    setComments(prevComments => ({
      ...prevComments,
      [postId]: prevComments[postId].map((comment, index) => {
        if (index === commentIndex) {
          return editedComment;
        }
        return comment;
      })
    }));
  };

  useEffect(() => {
    const calculateTotalComments = () => {
      const totalComments = {};
      Object.keys(comments).forEach(strId => {
        totalComments[strId] = comments[strId].length;
      });
      return totalComments;
    };

    setNumberOfComments(calculateTotalComments());
  }, [comments]);

  const submitUpdate = value => {
    const strToUpdate = content.find(str => str.id === edit.id);
    updateStr(edit.id, { ...value, count: strToUpdate.count });
    setEdit({
      id: null,
      value: ''
    });
  };

  if (edit.id) {
    return <Post edit={edit} onSubmit={submitUpdate} />;
  }

  return (
    <div className="str-container" >
      <div className="str-content"  >
        {content.map((str, index) => (
          <div className={str.isComplete ? 'row complete' : 'row'} key={index} >
            <div style={{ backgroundColor: '#ffff' }} onClick={() => completeStr(str.id)}>{str.text}</div>
            <div style={{ backgroundColor: '#ffff' }} className='icons'>
              <TbArrowBigUp 
                onClick={() => increment(str.id)} 
                style={{ 
                  color: 'black', 
                  fill: str.count > 0 ? '#04db37' : 'none', 
                  stroke: 'black', 
                  backgroundColor: 'white' 
                }} 
              />
              <span style={{ backgroundColor: 'white' }}>{str.count}</span>
              <TbArrowBigDown 
                onClick={() => decrement(str.id)} 
                style={{
                  color: 'black',
                  fill: str.count < 0 ? '#f03b35' : 'none',
                  stroke: 'black',
                  backgroundColor: 'white'
                }} 
              />
              
              {/* Delete */}
              <div onClick={() => removeStr(str.id)} style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', backgroundColor: 'white' }}>
                <FaRegTrashCan className='delete-icon' style={{ marginLeft: '25px', backgroundColor: 'white' }}/>
                <span style={{ marginLeft: '5px', backgroundColor: 'white' }}>Delete</span>
              </div>

              {/* Edit */}
              <div onClick={() => setEdit({ id: str.id, value: str.text })} style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', backgroundColor: 'white' }}>
                <TiEdit className='edit-icon' style={{ marginLeft: '25px', backgroundColor: 'white' }} />
                <span style={{ marginLeft: '5px', backgroundColor: 'white' }}>Edit</span>
              </div>

              {/* Reply */}
              <div onClick={() => {
                setReplyingToStrId(str.id); // Set replyingToStrId
                setShowAddCommentInput(true); // Show the input field for adding a comment
              }} style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', backgroundColor: 'white' }}>
                <RiReplyFill style={{ marginLeft: '25px', backgroundColor: 'white' }} />
                <span style={{ marginLeft: '5px', backgroundColor: 'white' }}>Reply</span>
              </div>

              {/* Comments */}
              <div onClick={() => toggleComments(index)} style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', backgroundColor: 'white' }}>
                <FaRegComment style={{ marginLeft: '25px', backgroundColor: 'white' }} />
                <span style={{ marginLeft: '5px', backgroundColor: 'white' }}>{numberOfComments[str.id] || 0} Comments</span>
              </div>
            </div>
     {/* Input for adding a comment */}
     {replyingToStrId === str.id && (
              <div style={{ backgroundColor: '#ffff', display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Add your comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button onClick={() => handleAddComment(str.id)} style={{ marginRight: '5px' }}>Add</button>
                <button onClick={() => {
                  setNewComment(''); // Clear the input field
                  setReplyingToStrId(null); // Reset replyingToStrId
                  setShowAddCommentInput(false); // Hide the input field for adding a comment
                }}>Cancel</button>
              </div>
            )}
            {/* Display comments */}
            {showComments[index] && comments[str.id] && (
              <div style={{ backgroundColor: '#ffff' }}>
                {comments[str.id]
                  .sort((a, b) => b.count - a.count)
                  .map((comment, commentIndex) => (
                    <Comment
                      key={commentIndex}
                      comment={comment.text}
                      count={comment.count}
                      increment={() => {
                        const updatedComments = [...comments[str.id]];
                        updatedComments[commentIndex] = { ...comment, count: comment.count + 1 };
                        setComments(prevComments => ({
                          ...prevComments,
                          [str.id]: updatedComments
                        }));
                      }}
                      decrement={() => {
                        const updatedComments = [...comments[str.id]];
                        updatedComments[commentIndex] = { ...comment, count: comment.count - 1 };
                        setComments(prevComments => ({
                          ...prevComments,
                          [str.id]: updatedComments
                        }));
                      }}
                      removeComment={() => handleRemoveComment(str.id, commentIndex)}
                      editComment={(editedComment) => handleEditComment(str.id, commentIndex, { text: editedComment, count: comment.count })}
                    />
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Str;
