"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Download, Loader2, Printer, Save, Sparkles } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRequireAuth } from "@/hooks/use-auth";
import { useCreateReport, usePreviewReport } from "@/hooks/use-reports";
import { useToast } from "@/hooks/use-toast";

export default function CreateReportPage() {
  const [mounted, setMounted] = useState(false);
  const { user, isLoading: authLoading } = useRequireAuth();
  const createReport = useCreateReport();
  const previewReport = usePreviewReport();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [output, setOutput] = useState("");
  const [form, setForm] = useState<Record<string, string>>({});
  
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setConfirmOpen(true);
  };

  const handleSave = async (silent = false) => {
    if (!user || isSaved) return;

    setSaving(true);
    try {
      await createReport.mutateAsync({
        userId: user.id,
        title: form.title || "Untitled report",
        details: JSON.stringify(form, null, 2),
      });
      setIsSaved(true);
      if (!silent) {
        toast({ 
          title: "Report saved", 
          description: "The report has been saved to your history.",
          variant: "success",
        });
      }
    } catch (error) {
      if (!silent) {
        toast({ 
          title: "Save failed", 
          description: error instanceof Error ? error.message : "Unable to save report", 
          variant: "destructive" 
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    
    // Automatically save if not already saved
    if (!isSaved) {
      await handleSave(true);
    }
    
    setDownloading(true);
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Report_${form.title?.replace(/\s+/g, "_") || "Document"}.pdf`);
      
      toast({ 
        title: "Download complete", 
        description: "The report has been saved as a PDF.",
        variant: "success",
      });
    } catch (error) {
      toast({ 
        title: "Download failed", 
        description: "An error occurred while generating the PDF.", 
        variant: "destructive" 
      });
    } finally {
      setDownloading(false);
    }
  };

  const processGeneration = async () => {
    if (!user) return;

    setLoading(true);
    setConfirmOpen(false);
    setIsSaved(false); // Reset saved status for new generation
    
    try {
      const response = await previewReport.mutateAsync(JSON.stringify(form, null, 2));
      setOutput(response.content);
      setGenerated(true);
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Unable to generate the report preview.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || authLoading || !user) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-5xl p-6">
          <Card>
            <CardContent className="space-y-4 p-6">
              <Skeleton className="h-9 w-48" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ))}
                <Skeleton className="h-12 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout mode={user.role === "super_admin" ? "super_admin" : user.role === "admin" ? "admin" : "member"}>
      <div className="mx-auto max-w-5xl space-y-8 p-6">
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Create Event Report</h1>
              {generated && (
                <Button variant="outline" size="sm" onClick={() => { setGenerated(false); setForm({}); setOutput(""); setIsSaved(false); }}>
                  Clear Form
                </Button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title of Activity <span className="text-red-500">*</span></Label>
                <Input id="title" name="title" value={form.title || ""} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="date">Date <span className="text-red-500">*</span></Label>
                <Input id="date" type="date" name="date" value={form.date || ""} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="department">Department / Club <span className="text-red-500">*</span></Label>
                <Input id="department" name="department" value={form.department || ""} onChange={handleChange} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="students">Participant Count <span className="text-red-500">*</span></Label>
                  <Input id="students" name="students" type="number" value={form.students || ""} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="faculties">Faculty Count <span className="text-red-500">*</span></Label>
                  <Input id="faculties" name="faculties" type="number" value={form.faculties || ""} onChange={handleChange} required />
                </div>
              </div>
              <div>
                <Label htmlFor="mode">Mode <span className="text-red-500">*</span></Label>
                <select id="mode" name="mode" value={form.mode || "Offline"} onChange={handleChange} className="h-12 w-full rounded-lg border px-3" aria-label="Mode" required>
                  <option>Offline</option>
                  <option>Online</option>
                  <option>Hybrid</option>
                </select>
              </div>
              <div>
                <Label htmlFor="report">Report Keywords <span className="text-red-500">*</span></Label>
                <Textarea id="report" name="report" value={form.report || ""} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="feedback">Feedback Keywords <span className="text-red-500">*</span></Label>
                <Textarea id="feedback" name="feedback" value={form.feedback || ""} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="outcome">Programme Outcome <span className="text-red-500">*</span></Label>
                <Textarea id="outcome" name="outcome" value={form.outcome || ""} onChange={handleChange} required />
              </div>

              <Button type="submit" className="h-12 w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" />
                    Generating Preview...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2" />
                    {generated ? "Regenerate Preview" : "Generate Preview"}
                  </>
                )}
              </Button>

              <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Generate report preview?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will create a preview of the report. It will not be saved to your history until you click Save or Download.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={processGeneration}>
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </form>
          </CardContent>
        </Card>

        {generated && (
          <div className="space-y-4 pb-20">
            <div className="flex flex-wrap justify-end gap-3">
              <Button onClick={() => window.print()} variant="outline" className="hidden md:flex">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button onClick={() => handleSave()} disabled={isSaved || saving} variant={isSaved ? "secondary" : "outline"}>
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {isSaved ? "Saved to History" : "Save to History"}
              </Button>
              <Button onClick={downloadPDF} disabled={downloading}>
                {downloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Preparing PDF...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </>
                )}
              </Button>
            </div>
            
            <div className="rounded-xl border bg-gray-300 p-4 md:p-10 shadow-inner overflow-x-auto">
              <div ref={reportRef} className="mx-auto w-full max-w-[794px] min-h-[1123px] bg-white p-8 md:p-[60px] shadow-2xl relative text-black">
                <div className="mb-6 text-center">
                  <img src="/favicon.png" className="mx-auto mb-2 h-16 md:h-20" alt="College logo" />
                  <h1 className="text-lg md:text-xl font-bold">YOUR COLLEGE NAME</h1>
                  <p className="text-sm md:text-base">Department of Computer Science</p>
                </div>

                <hr className="mb-6 border-gray-300" />
                <h2 className="mb-6 text-center text-xl md:text-2xl font-bold underline uppercase tracking-tight">{form.title}</h2>
                
                <div className="space-y-6 text-sm md:text-base">
                  <p className="text-justify leading-relaxed">
                    The {form.department} successfully organized an event titled <strong>&quot;{form.title}&quot;</strong> on <strong>{form.date}</strong> in <strong>{form.mode}</strong> mode. The programme was designed to provide valuable insights and practical knowledge to the participants.
                  </p>

                  <div>
                    <h3 className="mb-2 font-bold text-gray-900 border-b pb-1">Event Summary</h3>
                    <ul className="ml-6 list-disc space-y-1">
                      <li><strong>Department:</strong> {form.department}</li>
                      <li><strong>Mode of Conduct:</strong> {form.mode}</li>
                      <li><strong>Participants:</strong> {form.students} Students</li>
                      <li><strong>Faculties:</strong> {form.faculties} Members</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-2 font-bold text-gray-900 border-b pb-1">Detailed Report</h3>
                    <p className="whitespace-pre-wrap text-justify leading-relaxed">{output}</p>
                  </div>

                  <div>
                    <h3 className="mb-2 font-bold text-gray-900 border-b pb-1">Feedback Analysis</h3>
                    <p className="leading-relaxed">{form.feedback}</p>
                  </div>

                  <div>
                    <h3 className="mb-2 font-bold text-gray-900 border-b pb-1">Expected Programme Outcome</h3>
                    <p className="leading-relaxed">{form.outcome}</p>
                  </div>
                </div>

                <div className="mt-20 flex justify-between text-xs md:text-sm font-semibold pt-10">
                  <div className="text-center">
                    <div className="mb-1">__________________________</div>
                    <div>Event Coordinator</div>
                  </div>
                  <div className="text-center">
                    <div className="mb-1">__________________________</div>
                    <div>Head of Department</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
