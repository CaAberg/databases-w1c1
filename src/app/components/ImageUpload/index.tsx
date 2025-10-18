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
    multiple?: boolean;
    maxFiles?: number;
}

const ImageUpload = ({ 
    onImageSelect, 
    error, 
    label = "Image (Optional)",
    accept = "image/*",
    maxSizeMB = 10,
    resetTrigger = false,
    multiple = false,
    maxFiles = 5
}: ImageUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleImagesSelect = (files: File[]) => {
        
        const validImages = files.filter(file => {
            if (file.size > maxSizeMB * 1024 * 1024) {
                toast.error(`${file.name} is too large. Max size is ${maxSizeMB}MB`);
                return false;
            }
            if (!file.type.startsWith('image/')) {
                toast.error(`${file.name} is not a valid image file`);
                return false;
            }
            return true;
        });

        
        const totalFiles = multiple ? selectedImages.length + validImages.length : validImages.length;
        if (totalFiles > maxFiles) {
            toast.error(`You can only upload up to ${maxFiles} images`);
            return;
        }

        const newImages = multiple ? [...selectedImages, ...validImages] : validImages.slice(0, 1);
        setSelectedImages(newImages);

        
        const newPreviews: string[] = [];
        validImages.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                newPreviews.push(e.target?.result as string);
                if (newPreviews.length === validImages.length) {
                    setImagePreviews(multiple ? [...imagePreviews, ...newPreviews] : newPreviews);
                }
            };
            reader.readAsDataURL(file);
        });

        
        const dt = new DataTransfer();
        newImages.forEach(file => dt.items.add(file));
        onImageSelect(dt.files);
    };

    const removeImage = (index: number) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        
        setSelectedImages(newImages);
        setImagePreviews(newPreviews);

        if (newImages.length === 0) {
            onImageSelect(undefined);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } else {
            const dt = new DataTransfer();
            newImages.forEach(file => dt.items.add(file));
            onImageSelect(dt.files);
        }
    };

    const clearAllImages = () => {
        setSelectedImages([]);
        setImagePreviews([]);
        onImageSelect(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    useEffect(() => {
        if (resetTrigger) {
            clearAllImages();
        }
    }, [resetTrigger]);

    useEffect(() => {
        return () => {
            imagePreviews.forEach(preview => {
                if (preview.startsWith('blob:')) {
                    URL.revokeObjectURL(preview);
                }
            });
        };
    }, [imagePreviews]);

    return (
        <fieldset>
            <label htmlFor="image-upload-input" className="text-sm font-medium text-gray-700">
                {label} {multiple && `(Max ${maxFiles})`}
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
                    const files = Array.from(e.dataTransfer.files);
                    handleImagesSelect(files);
                }}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    id="image-upload-input"
                    name="image-upload"
                    ref={fileInputRef}
                    accept={accept}
                    multiple={multiple}
                    className="hidden"
                    onChange={(e) => {
                        const files = e.target.files ? Array.from(e.target.files) : [];
                        if (files.length > 0) {
                            handleImagesSelect(files);
                        }
                    }}
                />
                
                {imagePreviews.length > 0 ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative inline-block">
                                    <img
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        className="h-32 w-full object-cover rounded-lg shadow-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeImage(index);
                                        }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                                        aria-label="Remove image"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="text-sm text-gray-600">
                            {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''} selected
                            {multiple && selectedImages.length < maxFiles && (
                                <p className="text-xs text-gray-500 mt-1">Click to add more images</p>
                            )}
                        </div>
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
                                Drop {multiple ? 'images' : 'an image'} here, or click to select
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