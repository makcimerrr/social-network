import React from 'react';
import { TextField, Button } from '@mui/material';

const CreateCommentForm = ({ handleCreateComment, Post_id }) => {
  const [content, setContent] = React.useState('');
  const [image, setImage] = React.useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('content', content);
    formData.append('post_id', Post_id)
    if (image) {
      formData.append('image', image);
    }
    console.log('Form Data:', formData);
    handleCreateComment(formData);
    setContent('');
    setImage(null);
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div className='commentInputContainer'>
      <input
placeholder='Write a comment...'
      className='inputBox commentinput'
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input id='file' className={'inputBox file-input'} type="file" onChange={handleImageChange}/>
      <label className="input-file-label" for="file"></label>
      {image && (
        <div>
          <img src={URL.createObjectURL(image)} alt="Uploaded" />
          <div variant="contained" onClick={handleRemoveImage}>
            Remove Image
          </div>
        </div>
      )}
      <Button className='commentbtn' type="submit" variant="contained">
      </Button>
      </div>
    </form>
  );
};

export default CreateCommentForm;
