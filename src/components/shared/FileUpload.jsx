import React, { useState } from 'react';
import { UploadCloud, File, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function FileUpload({
  accept = '.csv, .xlsx',
  maxSizeMB = 5,
  onUploadSuccess,
  helperText = 'Spreadsheets up to 5MB'
}) {
  const { addToast } = useApp();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (fileItem) => {
    if (!fileItem) return;

    // Validate size
    if (fileItem.size > maxSizeMB * 1024 * 1024) {
      addToast(`File size exceeds limit of ${maxSizeMB}MB`, 'error');
      return;
    }

    setFile(fileItem);
    setUploading(true);
    setProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          addToast(`File "${fileItem.name}" imported successfully!`, 'success');
          if (onUploadSuccess) onUploadSuccess(fileItem);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full select-none">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all duration-200
          ${dragActive
            ? 'border-indigo-650 bg-indigo-50/20 dark:border-indigo-400 dark:bg-indigo-950/10'
            : file
              ? 'border-emerald-300 bg-emerald-50/5 dark:border-emerald-800 dark:bg-emerald-950/5'
              : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 bg-white dark:bg-slate-900/50'
          }
        `}
      >
        <input
          type="file"
          id="file-upload-input"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          disabled={uploading}
        />

        {uploading ? (
          <div className="w-full flex flex-col items-center justify-center space-y-3 py-2">
            <UploadCloud className="w-8 h-8 text-indigo-550 dark:text-indigo-400 animate-bounce" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Processing data: {progress}%
            </span>
            <div className="w-48 bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : file ? (
          <div className="flex flex-col items-center justify-center space-y-2.5 py-1">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-xs truncate">
                {file.name}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>
            <button
              onClick={() => setFile(null)}
              className="text-[10px] font-bold text-rose-600 hover:underline dark:text-rose-400 cursor-pointer"
            >
              Clear file
            </button>
          </div>
        ) : (
          <label
            htmlFor="file-upload-input"
            className="cursor-pointer flex flex-col items-center justify-center"
          >
            <UploadCloud className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-2.5" />
            <span className="text-xs font-semibold text-indigo-650 hover:underline dark:text-indigo-400">
              Click to upload
            </span>
            <span className="text-[10px] text-slate-450 dark:text-slate-500 mt-1">
              or drag and drop files here
            </span>
            <span className="text-[9px] text-slate-355 dark:text-slate-600 mt-2 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
              {helperText}
            </span>
          </label>
        )}
      </div>
    </div>
  );
}
export default FileUpload;
