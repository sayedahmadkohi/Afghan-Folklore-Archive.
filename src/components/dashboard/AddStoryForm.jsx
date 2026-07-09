import { useEffect } from "react";
import AddStory from "../../pages/AddStory";

const AddStoryForm = ({ editingStoryId, onClearEdit }) => {
  useEffect(() => {
    if (editingStoryId) {
      // The AddStory component will handle loading the story for editing
      // We need to pass the editing ID to it somehow
      // Since AddStory uses URL params, we'll need to modify it or use a different approach
      // For now, let's modify AddStory to accept a prop for editing
    }
  }, [editingStoryId]);

  return <AddStory editingStoryId={editingStoryId} onClearEdit={onClearEdit} />;
};

export default AddStoryForm;
