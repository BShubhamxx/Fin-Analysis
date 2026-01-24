
import { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { CloudUpload, FileSpreadsheet, AlertCircle, CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Progress } from "../components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function UploadPage() {
    const { user } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
        setError(null);
        setSuccess(false);

        if (fileRejections.length > 0) {
            const rejection = fileRejections[0];
            if (rejection.errors[0].code === "file-invalid-type") {
                setError("Invalid file type. Please upload a CSV or Excel file.");
            } else if (rejection.errors[0].code === "file-too-large") {
                setError("File is too large. Max size is 50MB.");
            } else {
                setError(rejection.errors[0].message);
            }
            return;
        }

        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
        },
        maxSize: 50 * 1024 * 1024, // 50MB
        maxFiles: 1,
        multiple: false
    });

    const removeFile = () => {
        setFile(null);
        setError(null);
        setSuccess(false);
        setProgress(0);
    };

    const handleUpload = async () => {
        if (!file || !user) return;

        setUploading(true);
        setError(null);
        setProgress(0);

        try {
            const token = await user.getIdToken();
            const formData = new FormData();
            formData.append("file", file);

            const xhr = new XMLHttpRequest();
            xhr.open("POST", "http://localhost:8000/api/analyze/upload", true);
            xhr.setRequestHeader("Authorization", `Bearer ${token}`);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    setProgress(percentComplete);
                }
            };

            xhr.onload = async () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        console.log("Analysis Result:", data);
                        setAnalysisResult(data);
                        setSuccess(true);
                    } catch (e) {
                        console.error("Failed to parse response", e);
                        setError("Analysis succeeded but response format was invalid.");
                    }
                } else {
                    let errorMessage = "Upload failed.";
                    try {
                        const errorData = JSON.parse(xhr.responseText);
                        errorMessage = errorData.detail || errorMessage;
                    } catch (e) {
                        // ignore json parse error
                    }
                    setError(errorMessage);
                    console.error("Upload error:", xhr.statusText);
                }
                setUploading(false);
            };

            xhr.onerror = () => {
                setError("Network error occurred during upload.");
                setUploading(false);
            };

            xhr.send(formData);

        } catch (err: any) {
            console.error("Upload error:", err);
            setError("An unexpected error occurred.");
            setUploading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="mb-8 text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Upload Financial Data</h1>
                <p className="text-muted-foreground">
                    Upload your CSV or Excel files for automatic analysis.
                </p>
            </div>

            <Card className="border-dashed border-2 shadow-sm">
                <CardHeader>
                    <CardTitle>File Upload</CardTitle>
                    <CardDescription>Drag and drop your file here, or click to browse</CardDescription>
                </CardHeader>
                <CardContent>
                    <AnimatePresence mode="wait">
                        {!file ? (
                            <div
                                {...getRootProps()}
                                className={`
                  flex flex-col items-center justify-center p-12 text-center rounded-xl cursor-pointer transition-all duration-200
                  bg-secondary/20 hover:bg-secondary/40 border-2 border-transparent
                  ${isDragActive ? "border-primary bg-primary/5 scale-[1.02]" : ""}
                  ${error ? "border-destructive/50 bg-destructive/5" : ""}
                `}
                            >
                                <motion.div
                                    key="dropzone"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <input {...getInputProps()} />
                                    <div className="size-16 rounded-full bg-background shadow-sm flex items-center justify-center mb-4 mx-auto">
                                        <CloudUpload className={`size-8 text-primary ${isDragActive ? "animate-bounce" : ""}`} />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-1">
                                        {isDragActive ? "Drop the file here" : "Click to upload or drag and drop"}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        CSV or Excel files (max 50MB)
                                    </p>
                                    {error && (
                                        <div className="flex items-center gap-2 text-destructive text-sm font-medium mt-2 justify-center">
                                            <AlertCircle className="size-4" />
                                            {error}
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                        ) : (
                            <motion.div
                                key="file-preview"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-card border rounded-xl p-6"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            <FileSpreadsheet className="size-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-foreground truncate max-w-[200px] md:max-w-md">
                                                {file.name}
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    {!uploading && !success && (
                                        <Button variant="ghost" size="icon" onClick={removeFile} className="text-muted-foreground hover:text-destructive">
                                            <X className="size-5" />
                                        </Button>
                                    )}
                                </div>

                                {uploading ? (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Uploading & Analyzing...</span>
                                            <span>{Math.round(progress)}%</span>
                                        </div>
                                        <Progress value={progress} className="h-2" />
                                    </div>
                                ) : success ? (
                                    <div className="space-y-4">
                                        <div className="bg-green-500/10 text-green-600 dark:text-green-400 p-4 rounded-lg flex items-center gap-3">
                                            <CheckCircle className="size-5" />
                                            <div>
                                                <p className="font-medium">Analysis Complete!</p>
                                                <p className="text-xs opacity-90">Your file has been processed successfully.</p>
                                            </div>
                                        </div>

                                        {analysisResult && (
                                            <div className="text-sm space-y-2 border-t pt-4">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Rows Processed:</span>
                                                    <span className="font-medium">{analysisResult.preview_rows?.length > 0 ? (analysisResult.row_count || "N/A") : 0}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Columns Mapped:</span>
                                                    <span className="font-medium">{Object.keys(analysisResult.mapped_columns || {}).length} / 4</span>
                                                </div>
                                                {analysisResult.missing_required_columns?.length > 0 && (
                                                    <div className="bg-orange-500/10 text-orange-600 dark:text-orange-400 p-3 rounded text-xs mt-2">
                                                        <span className="font-semibold">Warning:</span> Missing columns: {analysisResult.missing_required_columns.join(", ")}
                                                    </div>
                                                )}

                                                {analysisResult.analysis_report?.benford_analysis && (
                                                    <div className="mt-4 pt-4 border-t">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="font-medium text-foreground">Fraud Detection (Benford's Law)</span>
                                                            <span className={`px-2 py-1 rounded text-xs font-bold ${analysisResult.analysis_report.benford_analysis.verdict === 'Pass' ? 'bg-green-100 text-green-700' :
                                                                    analysisResult.analysis_report.benford_analysis.verdict === 'Fail' ? 'bg-red-100 text-red-700' :
                                                                        'bg-yellow-100 text-yellow-700'
                                                                }`}>
                                                                {analysisResult.analysis_report.benford_analysis.verdict.toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground grid grid-cols-2 gap-2">
                                                            <div>
                                                                <span className="block opacity-70">MAD Score</span>
                                                                {analysisResult.analysis_report.benford_analysis.mad_score}
                                                            </div>
                                                            <div>
                                                                <span className="block opacity-70">Analyzed Rows</span>
                                                                {analysisResult.analysis_report.benford_analysis.total_rows_analyzed}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex justify-end gap-2 pt-2">
                                            <Button variant="outline" onClick={removeFile}>Upload Another</Button>
                                            <Button>View Dashboard</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-end gap-3 mt-4">
                                        <Button variant="outline" onClick={removeFile}>Cancel</Button>
                                        <Button onClick={handleUpload} className="shadow-lg shadow-primary/20">
                                            Upload and Analyze
                                        </Button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>

            {/* Recent Uploads Section (Placeholder for now) */}
            <div className="mt-12">
                <h2 className="text-xl font-semibold mb-4">Recent Analyses</h2>
                <div className="grid gap-4">
                    <Card className="bg-muted/30 border-dashed">
                        <CardContent className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                            <p>No files uploaded yet.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
