import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useCreateReport } from "@/hooks/use-reports";
import { Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function CreateReport() {
  const { user } = useAuth();
  const { mutateAsync: createReport, isPending } = useCreateReport();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !details || !user) return;
    
    try {
      const result = await createReport({
        userId: user.id,
        title,
        details
      });
      setGeneratedOutput(result.content);
      toast({
        title: "Report Generated!",
        description: "Your comprehensive report has been created successfully.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "There was an error generating your report. Please try again.",
      });
    }
  };

  const resetForm = () => {
    setTitle("");
    setDetails("");
    setGeneratedOutput(null);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create Report</h1>
        <p className="text-muted-foreground mt-1">Use our AI engine to instantly generate comprehensive strategic documents.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Report Parameters</CardTitle>
            <CardDescription>Provide context and details for generation.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Report Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Q4 Marketing Strategy" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-lg bg-background"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="details">Context & Details</Label>
                <Textarea 
                  id="details" 
                  placeholder="Briefly describe what this report should cover, key metrics to include, or specific focus areas..." 
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="min-h-[200px] rounded-lg bg-background resize-none"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full rounded-xl h-12 text-base font-semibold shadow-md transition-all gap-2"
                disabled={isPending || !title || !details || !!generatedOutput}
              >
                {isPending ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing & Generating...</>
                ) : generatedOutput ? (
                  <><CheckCircle2 className="w-5 h-5" /> Completed</>
                ) : (
                  <><Sparkles className="w-5 h-5" /> Generate Insights</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Output Area */}
        <Card className="h-[600px] flex flex-col bg-secondary/20 border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Output Preview</span>
              {generatedOutput && (
                <Button variant="outline" size="sm" onClick={resetForm}>Start Over</Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <AnimatePresence mode="wait">
              {isPending && (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4"
                >
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="animate-pulse">Synthesizing data models...</p>
                </motion.div>
              )}

              {generatedOutput && !isPending && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card p-6 rounded-xl border shadow-sm h-full overflow-y-auto"
                >
                  <h3 className="text-xl font-bold mb-4">{title}</h3>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
                    {generatedOutput}
                  </div>
                </motion.div>
              )}

              {!isPending && !generatedOutput && (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-muted-foreground/60 text-center px-8"
                >
                  <FileText className="w-16 h-16 mb-4 opacity-50" />
                  <p>Your generated report will appear here.<br/>Fill out the parameters and hit generate.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
