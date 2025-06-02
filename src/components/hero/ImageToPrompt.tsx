"use client";

import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import DynamicLogo from "@/components/logo/DynamicLogo";
import { PromptContext } from "@/app/ClientBody";
import ImageGenerator from "./ImageGenerator";
import { analyzeImage } from "@/lib/api";
import { toast } from "sonner";

const ImageToPrompt = () => {
  const { prompt, setPrompt } = useContext(PromptContext);
  const [dragging, setDragging] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);

    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      handleFileChange(file);
    }
  };

  const handleFileChange = async (file: File) => {
    if (file.type.startsWith("image/")) {
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          if (e.target?.result) {
            // Set the image preview
            setImage(e.target.result as string);
            setIsGenerating(true);
            setShowGenerator(false);

            try {
              // Get base64 string without the data URL prefix
              const base64String = (e.target.result as string).split(',')[1];

              // Call API to analyze image
              const result = await analyzeImage(base64String);

              if (result) {
                setGeneratedPrompt(result);
                toast.success("Image analyzed successfully!");
              } else {
                setGeneratedPrompt("Failed to analyze image. Please try a different image.");
                toast.error("Failed to analyze image");
              }
            } catch (error) {
              console.error("Error analyzing image:", error);
              setGeneratedPrompt("An error occurred while analyzing the image.");
              toast.error("Error analyzing image");
            } finally {
              setIsGenerating(false);
            }
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error reading file:", error);
        toast.error("Error reading file");
      }
    } else {
      toast.error("Please upload an image file (JPEG, PNG, etc.)");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const useGeneratedPrompt = () => {
    setPrompt(generatedPrompt);
    setShowGenerator(true);
  };

  const resetImage = () => {
    setImage(null);
    setGeneratedPrompt("");
    setShowGenerator(false);
  };

  return (
    <div className="p-6 space-y-6">
      {!showGenerator ? (
        <>
          <div className="flex justify-center mb-4">
            <DynamicLogo />
          </div>

          <div
            className={`border-2 border-dashed rounded-lg ${
              dragging ? "border-primary border-solid bg-primary/5" : "border-border"
            } p-6 flex flex-col items-center justify-center h-48 transition-colors cursor-pointer`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />

            {!image ? (
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-foreground/50">
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                    <line x1="16" y1="5" x2="22" y2="5" />
                    <line x1="19" y1="2" x2="19" y2="8" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
                <p className="text-foreground/70 text-sm mb-1">Drag and drop an image here or click to upload</p>
                <p className="text-foreground/50 text-xs">Supports JPG, PNG, GIF formats</p>
              </div>
            ) : (
              <div className="w-full h-full relative">
                <img src={image} alt="Uploaded" className="w-full h-full object-contain" />
              </div>
            )}
          </div>

          {image && (
            <div className="space-y-4">
              <div className="p-4 bg-card/30 border border-border rounded-lg">
                {isGenerating ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mr-2" />
                    <span className="text-foreground/70">Analyzing image...</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-foreground/90">Generated Prompt</h3>
                    <div className="p-3 rounded-md bg-background border border-border">
                      <p className="text-sm">{generatedPrompt}</p>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-sm rounded-full border-primary text-primary hover:bg-primary/10"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedPrompt);
                          toast.success("Prompt copied to clipboard");
                        }}
                      >
                        Copy Prompt
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <Button
                  variant="ghost"
                  className="text-sm text-foreground/80 hover:text-foreground cursor-glow"
                  onClick={resetImage}
                >
                  Clear
                </Button>
                <Button
                  className="gradient-button text-white font-medium shadow-md rounded-full px-6"
                  onClick={useGeneratedPrompt}
                  disabled={isGenerating || !generatedPrompt}
                >
                  Generate Image From This Prompt
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Generate Image From Prompt</h2>
            <Button
              variant="outline"
              className="rounded-full text-sm"
              onClick={resetImage}
            >
              Back to Image Upload
            </Button>
          </div>

          <div className="bg-card/10 rounded-lg border border-border mb-4">
            <ImageGenerator />
          </div>
        </>
      )}
    </div>
  );
};

export default ImageToPrompt;
