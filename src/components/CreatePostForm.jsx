import React from 'react';
import { TextField, Button, Select, MenuItem } from '@mui/material';

const CreatePostForm = ({ handleCreatePost }) => {
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [privacy, setPrivacy] = React.useState(0);
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
    formData.append('title', title);
    formData.append('content', content);
    formData.append('privacy', privacy);
    if (image) {
      formData.append('image', image);
    }
    handleCreatePost(formData);
    setTitle('');
    setContent('');
    setPrivacy(0);
    setImage(null);
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <h2>Create a New Post</h2>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        label="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        multiline
      />
      <Select
        label="Privacy"
        value={privacy}
        onChange={(e) => setPrivacy(parseInt(e.target.value))}
      >
        <MenuItem value={0}>Private</MenuItem>
        <MenuItem value={1}>Public</MenuItem>
        <MenuItem value={2}>Semi-Private</MenuItem>
      </Select>
      {privacy === 2 && <div>Liste à faire</div>}
      <h2>Add Image:</h2>
      <input type="file" onChange={handleImageChange} />
      {image && (
        <div>
          <img src={URL.createObjectURL(image)} alt="Uploaded" />
          <Button variant="contained" onClick={handleRemoveImage}>
            Remove Image
          </Button>
        </div>
      )}
      <Button type="submit" variant="contained">
        Create Post
      </Button>
    </form>
  );
};

export default CreatePostForm;
