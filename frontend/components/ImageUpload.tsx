import React, { useState } from 'react';
import { Upload, X, Loader } from 'lucide-react';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label = "Image" }) => {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('http://192.168.1.171:8080/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                onChange(data.url);
            }
        } catch (err) {
            console.error("Upload failed", err);
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <label className="text-xs text-gray-400">{label}</label>

            <div className="border border-gray-700 rounded-lg p-2 bg-midnight-black">
                {value ? (
                    <div className="relative group">
                        <img src={value} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                        <button
                            type="button"
                            onClick={() => onChange('')}
                            className="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-emerald-energy hover:bg-gray-800/50 transition-all">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {uploading ? (
                                <Loader className="animate-spin text-emerald-energy mb-2" />
                            ) : (
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            )}
                            <p className="text-sm text-gray-500">
                                {uploading ? 'Uploading...' : 'Click to Upload Image'}
                            </p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                    </label>
                )}
            </div>
            {/* Fallback Manual URL Input */}
            <input
                type="text"
                placeholder="Or enter image URL manually..."
                className="w-full bg-transparent border-b border-gray-800 text-xs text-gray-500 py-1 focus:border-emerald-energy outline-none"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

export default ImageUpload;

