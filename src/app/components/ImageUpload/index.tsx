'use client'
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

interface ImageUploadProps {
    onImageSelect: (files: FileList | undefined) => void;
    error?: string;
    label?: string;
    accept?: string;
    maxSizeMB?: number;
    resetTrigger?: boolean;
}

const ImageUpload = ({ 
    onImageSelect, 
    error, 
    label = "Image (Optional)",
    accept = "image/*",
    maxSizeMB = 10,
    resetTrigger = false
}: ImageUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleImageSelect = (file: File) => {
        if (file.size > maxSizeMB * 1024 * 1024) {
            toast.error(`Image must be smaller than ${maxSizeMB}MB`);
            return;
        }

        if (!file.type.startsWith('image/')) {
            toast.error("Please select a valid image file");
            return;
        }

        setSelectedImage(file);
        

        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        const dt = new DataTransfer();
        dt.items.add(file);
        onImageSelect(dt.files);
    };

    const clearImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        onImageSelect(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    useEffect(() => {
        if (resetTrigger) {
            clearImage();
        }
    }, [resetTrigger]);

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    return (
        <fieldset>
            <label htmlFor="image-upload-input" className="text-sm font-medium text-gray-700">
                {label}
            </label>
            
            <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                    isDragOver 
                        ? 'border-violet-400 bg-violet-50' 
                        : 'border-gray-300 hover:border-violet-400 hover:bg-gray-50'
                }`}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                }}
                onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                }}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    const files = e.dataTransfer.files;
                    if (files[0] && files[0].type.startsWith('image/')) {
                        handleImageSelect(files[0]);
                    }
                }}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    id="image-upload-input"
                    name="image-upload"
                    ref={fileInputRef}
                    accept={accept}
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            handleImageSelect(file);
                        }
                    }}
                />
                
                {imagePreview ? (
                    <div className="space-y-4">
                        <div className="relative inline-block">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="max-h-48 max-w-full rounded-lg shadow-md"
                            />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    clearImage();
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                                aria-label="Remove image"
                            >
                                ×
                            </button>
                        </div>
                        <p className="text-sm text-gray-600">
                            {selectedImage?.name} ({((selectedImage?.size ?? 0) / 1024 / 1024).toFixed(2)} MB)
                        </p>
                        <p className="text-xs text-gray-500">Click to replace image</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-gray-100 rounded-full">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">
                                Drop an image here, or click to select
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                PNG, JPG, GIF up to {maxSizeMB}MB
                            </p>
                        </div>
                    </div>
                )}
            </div>
            
            {error && (
                <div className="mt-2 text-sm text-red-600">
                    {error}
                </div>
            )}
        </fieldset>
    );
};

export default ImageUpload;