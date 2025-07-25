"use client";

import { cn } from "@/lib/utils";
import { useRef, useState, createContext, useContext } from "react";
import { motion } from "motion/react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/lib/type";
import Image from "next/image";

interface UploadedImage {
  id: string;
  url: string;
  name: string;
}

interface ImageUploadContextType {
  uploadedImages: UploadedImage[];
  setUploadedImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
  isDragOver: boolean;
  setIsDragOver: React.Dispatch<React.SetStateAction<boolean>>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleImageUpload: (files: FileList | null) => void;
  removeImage: (id: string) => void;
  setError: (error: ErrorState) => void;
}

const ImageUploadContext = createContext<ImageUploadContextType | undefined>(
  undefined,
);

const useImageUpload = () => {
  const context = useContext(ImageUploadContext);
  if (!context) {
    throw new Error("useImageUpload must be used within an ImageUpload");
  }
  return context;
};

function ImageUpload({
  children,
  setError,
}: {
  children: React.ReactNode;
  setError: (error: ErrorState) => void;
}) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const maxFiles = 5;
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (uploadedImages.length + files.length > maxFiles) {
      setError({
        type: "validation",
        message: `You can only upload up to ${maxFiles} images`,
      });
      return;
    }

    Array.from(files).forEach((file, idx) => {
      if (!file.type.startsWith("image/")) {
        setError({
          type: "validation",
          message: "Please upload only image files",
        });
        return;
      }

      if (file.size > maxSize) {
        setError({
          type: "validation",
          message: "Image size must be less than 10MB",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImages((prev) => [
          ...prev,
          {
            id: `${idx}-${file.name}`,
            url: e.target?.result as string,
            name: file.name,
          },
        ]);
      };
      reader.onerror = () =>
        setError({
          type: "server",
          message: "Failed to process image, please try again",
        });
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id: string) =>
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));

  return (
    <ImageUploadContext.Provider
      value={{
        uploadedImages,
        setUploadedImages,
        isDragOver,
        setIsDragOver,
        fileInputRef,
        handleImageUpload,
        removeImage,
        setError,
      }}
    >
      {children}
    </ImageUploadContext.Provider>
  );
}

function ImageUploadTrigger({ children }: { children: React.ReactNode }) {
  const { fileInputRef } = useImageUpload();

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      className="cursor-pointer"
    >
      {children}
    </div>
  );
}

function ImageUploadPreview() {
  const { uploadedImages, removeImage } = useImageUpload();

  return (
    uploadedImages.length > 0 && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="mb-4 p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-foreground">
              {uploadedImages.length} image
              {uploadedImages.length !== 1 ? "s" : ""} attached
            </span>
          </div>
          <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
            {5 - uploadedImages.length} remaining
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          {uploadedImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              transition={{ delay: index * 0.05 }}
              className="relative group"
            >
              <div className="relative w-16 h-16 rounded-xl bg-card/50 border border-border/50 group-hover:border-border group-hover:shadow-md transition-all duration-200 overflow-hidden backdrop-blur-sm">
                <Image
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full rounded-xl object-cover"
                  fill
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removeImage(image.id)}
                className="absolute -top-2 -right-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-all duration-200 focus:opacity-100 focus:ring-2 focus:ring-destructive/20"
              >
                <X size={12} />
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  );
}

function ImageUploadContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isDragOver, setIsDragOver, handleImageUpload, fileInputRef } =
    useImageUpload();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleImageUpload(e.dataTransfer.files);
    e.dataTransfer.clearData();
  };

  return (
    <div
      className={cn(
        "relative",
        className,
        isDragOver ? "border-primary/50 bg-primary/5" : "border-border/50",
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-primary/10 border-2 border-primary/40 rounded-2xl flex items-center justify-center -z-10"
        >
          <div className="text-center">
            <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium text-primary">Drop images here</p>
          </div>
        </motion.div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          handleImageUpload(e.target.files);
          e.target.value = "";
        }}
        className="hidden"
      />
      {children}
    </div>
  );
}

export {
  ImageUpload,
  ImageUploadTrigger,
  ImageUploadPreview,
  ImageUploadContent,
};

export function ImageDragContainer({
  children,
  className,
  setError,
}: {
  children: React.ReactNode;
  className?: string;
  setError: (error: ErrorState) => void;
}) {
  return (
    <ImageUpload setError={setError}>
      <ImageUploadPreview />
      <ImageUploadContent className={className}>{children}</ImageUploadContent>
    </ImageUpload>
  );
}
