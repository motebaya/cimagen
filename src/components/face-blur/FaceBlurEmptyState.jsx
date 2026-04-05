import { Upload } from "lucide-react";
import CreatorUploadDropzone from "../creator/CreatorUploadDropzone.jsx";

export default function FaceBlurEmptyState({
  isDragging,
  onDragLeave,
  onDragOver,
  onDrop,
  onOpenImagePicker,
}) {
  return (
    <CreatorUploadDropzone
      isDragging={isDragging}
      desktopMinHeightClass="sm:min-h-[620px]"
      dragIcon={Upload}
      idleIcon={Upload}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onOpenImagePicker={onOpenImagePicker}
      title="Click to upload or drag and drop"
      description="PNG, JPG, WEBP supported (max 20MB)"
    />
  );
}
