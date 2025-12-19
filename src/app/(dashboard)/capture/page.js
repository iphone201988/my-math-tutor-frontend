'use client';

import { useState } from 'react';
import Link from 'next/link';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import MathRenderer from '@/components/chat/MathRenderer';
import { ocrSampleResults } from '@/data/sessions';

export default function CapturePage() {
  const [uploadState, setUploadState] = useState('idle'); // idle, uploading, processing, done, error
  const [ocrResult, setOcrResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = async () => {
    setUploadState('uploading');
    setProgress(0);
    
    // Simulate upload
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 100));
      setProgress(i);
    }

    setUploadState('processing');
    
    // Simulate processing
    await new Promise(r => setTimeout(r, 2000));
    
    setOcrResult(ocrSampleResults.success);
    setUploadState('done');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleUpload();
  };

  const reset = () => {
    setUploadState('idle');
    setOcrResult(null);
    setProgress(0);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 min-h-screen">
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
              className={`border-2 border-dashed transition-all cursor-pointer ${
                dragActive 
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
                  <Button onClick={handleUpload}>
                    📁 Choose File
                  </Button>
                  <Button variant="secondary" onClick={handleUpload}>
                    📷 Take Photo
                  </Button>
                </div>
                <p className="text-xs text-foreground-secondary mt-4">
                  Supports JPG, PNG, HEIC • Max 10MB
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
                <p className="text-foreground-secondary text-sm mb-6">
                  Your math problem has been converted to digital format
                </p>
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
                  {ocrResult.blocks.map((block, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-lg ${
                        block.type === 'formula'
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
                        <div className="py-2">
                          <MathRenderer latex={block.latex} display />
                        </div>
                      ) : (
                        <p className="text-foreground">{block.content}</p>
                      )}
                    </div>
                  ))}

                  {/* Full Markdown Preview */}
                  <div className="mt-6 p-4 bg-neutral-900 rounded-lg text-white">
                    <p className="text-xs text-neutral-400 mb-2">Generated Markdown:</p>
                    <pre className="text-sm whitespace-pre-wrap font-mono">
                      {ocrResult.layoutMarkdown}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
