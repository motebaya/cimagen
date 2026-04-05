import { ImageIcon, Upload } from "lucide-react";
import CreatorUploadDropzone from "../creator/CreatorUploadDropzone.jsx";

export default function EmojiEmptyState({
  isDragging,
  onDrop,
  onOpenImagePicker,
  onDragOver,
  onDragLeave,
}) {
  return (
    <CreatorUploadDropzone
      isDragging={isDragging}
      dragIcon={Upload}
      idleIcon={ImageIcon}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onOpenImagePicker={onOpenImagePicker}
      title="Click to upload or drag and drop"
      description="PNG, JPG, WEBP supported (max 20MB)"
    />
  );
}
