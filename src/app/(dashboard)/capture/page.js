'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import MathRenderer from '@/components/chat/MathRenderer';

// OCR API endpoint
const OCR_API_URL = 'http://192.168.0.148:8501/ocr';

export default function CapturePage() {
  const [uploadState, setUploadState] = useState('idle'); // idle, uploading, processing, done, error
  const [ocrResult, setOcrResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Process file and call OCR API
  const processFile = async (file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Invalid file type. Please upload JPG, PNG, HEIC, or WebP images.');
      setUploadState('error');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File too large. Maximum size is 10MB.');
      setUploadState('error');
      return;
    }

    setSelectedFile(file);
    setErrorMessage('');

    // Create image preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

    // Start upload state
    setUploadState('uploading');
    setProgress(0);

    try {
      // Simulate upload progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Create FormData for API call
      const formData = new FormData();
      formData.append('file', file);
      formData.append('strategy', 'formula_only');
      formData.append('language', 'en');

      setProgress(100);
      clearInterval(progressInterval);
      setUploadState('processing');

      // Call OCR API
      const response = await fetch(OCR_API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'OCR processing failed');
      }

      // Transform API response to match our expected format
      const result = {
        blocks: data.blocks || [],
        layoutMarkdown: data.layout_markdown || '',
        qualityScore: data.quality_score || 0,
        processingTime: data.processing_time_ms || 0,
        imageInfo: data.image_info || {},
        warnings: data.warnings || [],
      };

      setOcrResult(result);
      setUploadState('done');

    } catch (error) {
      console.error('OCR API Error:', error);
      setErrorMessage(error.message || 'Failed to process image. Please try again.');
      setUploadState('error');
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Handle choose file button
  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  // Handle take photo button
  const handleTakePhoto = () => {
    cameraInputRef.current?.click();
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Reset state
  const reset = () => {
    setUploadState('idle');
    setOcrResult(null);
    setProgress(0);
    setSelectedFile(null);
    setImagePreview(null);
    setErrorMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 min-h-screen">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/heic,image/webp"
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-display font-bold mb-2">
          Capture Math Problem 📸
        </h1>
        <p className="text-foreground-secondary">
          Snap or upload a photo of any math problem and we&apos;ll convert it to digital format
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          {uploadState === 'idle' && (
            <Card
              className={`border-2 border-dashed transition-all cursor-pointer ${dragActive
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                : 'border-[var(--card-border)] hover:border-primary-300'
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-4xl mb-6">
                  📷
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload or Drag Image</h3>
                <p className="text-foreground-secondary mb-6 max-w-sm mx-auto">
                  Take a photo of your math problem from homework, textbook, or whiteboard
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={handleChooseFile}>
                    📁 Choose File
                  </Button>
                  <Button variant="secondary" onClick={handleTakePhoto}>
                    📷 Take Photo
                  </Button>
                </div>
                <p className="text-xs text-foreground-secondary mt-4">
                  Supports JPG, PNG, HEIC, WebP • Max 10MB
                </p>
              </CardContent>
            </Card>
          )}

          {uploadState === 'uploading' && (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-3xl mb-4 animate-pulse">
                  ⬆️
                </div>
                <h3 className="text-lg font-semibold mb-4">Uploading Image...</h3>
                <div className="w-full max-w-xs mx-auto">
                  <div className="progress-bar h-3 mb-2">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-foreground-secondary">{progress}%</p>
                </div>
              </CardContent>
            </Card>
          )}

          {uploadState === 'processing' && (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-3xl mb-4">
                  <span className="animate-spin">⚙️</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Processing Image...</h3>
                <p className="text-foreground-secondary text-sm">
                  Our AI is analyzing the math content
                </p>
                <div className="flex justify-center gap-1 mt-4">
                  <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </CardContent>
            </Card>
          )}

          {uploadState === 'done' && (
            <Card>
              <CardContent className="py-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-3xl mb-4">
                  ✓
                </div>
                <h3 className="text-lg font-semibold mb-2 text-green-600">
                  Successfully Processed!
                </h3>
                <p className="text-foreground-secondary text-sm mb-2">
                  Your math problem has been converted to digital format
                </p>
                {ocrResult?.processingTime && (
                  <p className="text-xs text-foreground-secondary mb-6">
                    Processed in {ocrResult.processingTime}ms
                  </p>
                )}
                <div className="flex gap-3 justify-center">
                  <Link href="/solve">
                    <Button>Start Solving →</Button>
                  </Link>
                  <Button variant="secondary" onClick={reset}>
                    Upload Another
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {uploadState === 'error' && (
            <Card className="border-red-200 dark:border-red-800">
              <CardContent className="py-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-3xl mb-4">
                  ❌
                </div>
                <h3 className="text-lg font-semibold mb-2 text-red-600">
                  Processing Failed
                </h3>
                <p className="text-foreground-secondary text-sm mb-6">
                  {errorMessage}
                </p>
                <Button onClick={reset}>
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Image Preview (when uploading/processing/done) */}
          {imagePreview && uploadState !== 'idle' && (
            <Card>
              <CardContent>
                <h3 className="font-semibold mb-3">📷 Uploaded Image</h3>
                <div className="relative rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  <img
                    src={imagePreview}
                    alt="Uploaded math problem"
                    className="w-full h-auto max-h-64 object-contain"
                  />
                </div>
                {ocrResult?.imageInfo && (
                  <p className="text-xs text-foreground-secondary mt-2">
                    {ocrResult.imageInfo.width} × {ocrResult.imageInfo.height} • {ocrResult.imageInfo.format}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tips */}
          <Card variant="glass">
            <CardContent>
              <h3 className="font-semibold mb-3">📝 Tips for Best Results</h3>
              <ul className="space-y-2 text-sm text-foreground-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  Write clearly with good contrast
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  Ensure good lighting, avoid shadows
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  Focus on the math problem area
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  Avoid blurry or cropped images
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <Card>
            <CardContent>
              <h3 className="font-semibold mb-4">Detected Content</h3>

              {!ocrResult ? (
                <div className="py-16 text-center">
                  <div className="text-4xl mb-4 opacity-30">🔍</div>
                  <p className="text-foreground-secondary">
                    Upload an image to see the detected content
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Quality Score */}
                  {ocrResult.qualityScore > 0 && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800">
                      <span className="text-sm font-medium">Quality Score:</span>
                      <div className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${ocrResult.qualityScore >= 0.8 ? 'bg-green-500' :
                            ocrResult.qualityScore >= 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                          style={{ width: `${ocrResult.qualityScore * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-foreground-secondary">
                        {Math.round(ocrResult.qualityScore * 100)}%
                      </span>
                    </div>
                  )}

                  {/* Warnings */}
                  {ocrResult.warnings?.length > 0 && (
                    <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        ⚠️ {ocrResult.warnings.join(', ')}
                      </p>
                    </div>
                  )}

                  {/* Detected Blocks */}
                  {ocrResult.blocks.map((block, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-lg ${block.type === 'formula'
                        ? 'bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800'
                        : 'bg-neutral-50 dark:bg-neutral-800'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`badge ${block.type === 'formula' ? 'badge-primary' : 'badge-secondary'}`}>
                          {block.type === 'formula' ? '🧮 Formula' : '📝 Text'}
                        </span>
                        <span className="text-xs text-foreground-secondary">
                          {Math.round(block.confidence * 100)}% confidence
                        </span>
                      </div>
                      {block.type === 'formula' ? (
                        <div className="py-2 overflow-x-auto">
                          <MathRenderer latex={block.latex} display />
                        </div>
                      ) : (
                        <p className="text-foreground">{block.content}</p>
                      )}
                    </div>
                  ))}

                  {/* Full Markdown Preview */}
                  {ocrResult.layoutMarkdown && (
                    <div className="mt-6 p-4 bg-neutral-900 rounded-lg text-white">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-neutral-400">Generated LaTeX:</p>
                        <button
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(ocrResult.layoutMarkdown);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            } catch (err) {
                              console.error('Failed to copy:', err);
                            }
                          }}
                          className={`text-xs transition-colors ${copied ? 'text-green-400' : 'text-primary-400 hover:text-primary-300'}`}
                        >
                          {copied ? '✓ Copied!' : '📋 Copy'}
                        </button>
                      </div>
                      <pre className="text-sm whitespace-pre-wrap font-mono break-all">
                        {ocrResult.layoutMarkdown}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
