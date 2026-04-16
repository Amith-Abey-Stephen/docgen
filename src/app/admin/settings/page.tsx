"use client";

import { useState, useEffect, useRef } from "react";
import { Save, Loader2, Building2, Layout, FileText, BadgeCheck, Upload, Trash2, Image as ImageIcon } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRequireAuth } from "@/hooks/use-auth";
import { useAdminOrganization, useUpdateAdminOrganization } from "@/hooks/use-admin";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettingsPage() {
  const [mounted, setMounted] = useState(false);
  const { user, isLoading: authLoading } = useRequireAuth(true);
  const { data: organization, isLoading: orgLoading, refetch } = useAdminOrganization();
  const updateOrg = useUpdateAdminOrganization();
  const { toast } = useToast();
  
  const [uploadingHeader, setUploadingHeader] = useState(false);
  const [uploadingFooter, setUploadingFooter] = useState(false);
  
  const headerFileRef = useRef<HTMLInputElement>(null);
  const footerFileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    headerTitle: "",
    headerSubtitle: "",
    footerText: "",
    description: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (organization) {
      setForm({
        name: organization.name || "",
        headerTitle: organization.headerTitle || "",
        headerSubtitle: organization.headerSubtitle || "",
        footerText: organization.footerText || "",
        description: organization.description || "",
      });
    }
  }, [organization]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateOrg.mutateAsync(form);
      toast({ title: "Settings updated", description: "Organization branding and details have been saved.", variant: "success" });
    } catch (error) {
      toast({ title: "Update failed", description: "Failed to save organization settings.", variant: "destructive" });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "header" | "footer") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isHeader = type === "header";
    isHeader ? setUploadingHeader(true) : setUploadingFooter(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const res = await fetch("/api/admin/organization/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      
      toast({ title: "Upload successful", description: `${type} image has been updated.`, variant: "success" });
      refetch();
    } catch (error) {
      toast({ title: "Upload failed", description: "Could not upload image to Cloudinary.", variant: "destructive" });
    } finally {
      isHeader ? setUploadingHeader(false) : setUploadingFooter(false);
    }
  };

  const removeImage = async (type: "header" | "footer") => {
    try {
      const res = await fetch("/api/admin/organization/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      if (!res.ok) throw new Error("Delete failed");
      
      toast({ title: "Image removed", description: `${type} branding has been cleared.`, variant: "success" });
      refetch();
    } catch (error) {
      toast({ title: "Action failed", description: "Could not remove image.", variant: "destructive" });
    }
  };

  if (!mounted || authLoading || orgLoading || !user) {
    return (
      <DashboardLayout mode="admin">
        <div className="max-w-4xl mx-auto py-10 space-y-6">
          <div className="h-10 w-48 bg-slate-200 animate-pulse rounded-lg" />
          <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-2xl" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout mode="admin">
      <div className="max-w-5xl mx-auto pb-20">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Organization Settings</h1>
          <p className="text-slate-500 mt-2 text-lg">Customize your organization&apos;s identity and Cloudinary-powered branding.</p>
        </div>

        <div className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 space-y-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  General Info
                </h2>
                <p className="text-sm text-slate-500">Basic identification for your organization in the system.</p>
              </div>
              
              <Card className="md:col-span-2 border-none shadow-xl rounded-3xl overflow-hidden bg-white/50 backdrop-blur-sm">
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700 font-bold">Organization Name</Label>
                    <Input 
                      id="name" 
                      value={form.name} 
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      placeholder="e.g. Inovus Labs IEDC"
                      className="h-14 rounded-2xl border-slate-200 focus:ring-primary text-lg"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-slate-700 font-bold">Short Description</Label>
                    <Textarea 
                      id="description" 
                      value={form.description} 
                      onChange={(e) => setForm({...form, description: e.target.value})}
                      placeholder="Briefly describe your organization..."
                      className="min-h-[120px] rounded-2xl border-slate-200 focus:ring-primary"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      className="h-14 px-8 rounded-full bg-slate-900 hover:bg-slate-800 font-bold shadow-lg shadow-slate-200 transition-all active:scale-95"
                      disabled={updateOrg.isPending}
                    >
                      {updateOrg.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save General Settings"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>

          <hr className="border-slate-200" />

          {/* Document Branding Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Layout className="h-5 w-5 text-primary" />
                Document Branding
              </h2>
              <p className="text-sm text-slate-500">Cloudinary-powered image assets for official document letterheads and seals.</p>
            </div>
            
            <div className="md:col-span-2 space-y-6">
              <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white/50 backdrop-blur-sm">
                <CardHeader className="bg-slate-50 border-b border-slate-100 p-8">
                  <CardTitle className="text-slate-900 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-slate-400" />
                    Custom Header Layout
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-bold">Header Title</Label>
                      <Input 
                        value={form.headerTitle} 
                        onChange={(e) => setForm({...form, headerTitle: e.target.value})}
                        className="rounded-xl border-slate-200"
                        placeholder="e.g. COLLEGE OF ENG"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-bold">Header Subtitle</Label>
                      <Input 
                        value={form.headerSubtitle} 
                        onChange={(e) => setForm({...form, headerSubtitle: e.target.value})}
                        className="rounded-xl border-slate-200"
                        placeholder="e.g. Dept. of CSE"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <Label className="text-slate-700 font-bold block">Institution Letterhead Image</Label>
                    <div className="relative group">
                      {organization?.headerImage ? (
                        <div className="relative border-2 border-slate-100 rounded-2xl overflow-hidden h-40 bg-slate-50 flex items-center justify-center">
                          <img src={organization.headerImage} alt="Header Preview" className="h-full w-full object-contain" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                             <Button size="icon" variant="destructive" className="rounded-full shadow-xl" onClick={() => removeImage("header")}>
                               <Trash2 className="h-4 w-4" />
                             </Button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="border-2 border-dashed border-slate-200 rounded-2xl h-40 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary cursor-pointer transition-all bg-slate-50/50"
                          onClick={() => headerFileRef.current?.click()}
                        >
                          {uploadingHeader ? (
                            <Loader2 className="h-8 w-8 animate-spin" />
                          ) : (
                            <>
                              <Upload className="h-8 w-8 mb-2" />
                              <span className="text-sm font-medium">Upload Header Banner</span>
                            </>
                          )}
                        </div>
                      )}
                      <input type="file" ref={headerFileRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "header")} />
                    </div>
                    <p className="text-[10px] text-muted-foreground italic leading-relaxed">Recommended Size: 1000x200px. High resolution results in better PDF clarity.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white/50 backdrop-blur-sm">
                <CardHeader className="bg-slate-50 border-b border-slate-100 p-8">
                  <CardTitle className="text-slate-900 flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-slate-400" />
                    Footer & Seals
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold">Footer Audit / Bottom Text</Label>
                    <Input 
                      value={form.footerText} 
                      onChange={(e) => setForm({...form, footerText: e.target.value})}
                      className="rounded-xl border-slate-200"
                      placeholder="e.g. Verified by Accreditation Board"
                    />
                  </div>

                  <div className="space-y-4 pt-4">
                    <Label className="text-slate-700 font-bold block">Official Seal / QR / Stamp</Label>
                    <div className="relative group">
                      {organization?.footerImage ? (
                        <div className="relative border-2 border-slate-100 rounded-2xl overflow-hidden h-32 bg-slate-50 flex items-center justify-center">
                          <img src={organization.footerImage} alt="Footer Preview" className="h-full w-full object-contain" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <Button size="icon" variant="destructive" className="rounded-full shadow-xl" onClick={() => removeImage("footer")}>
                               <Trash2 className="h-4 w-4" />
                             </Button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="border-2 border-dashed border-slate-200 rounded-2xl h-32 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary cursor-pointer transition-all bg-slate-50/50"
                          onClick={() => footerFileRef.current?.click()}
                        >
                          {uploadingFooter ? (
                            <Loader2 className="h-8 w-8 animate-spin" />
                          ) : (
                            <>
                              <Upload className="h-8 w-8 mb-2" />
                              <span className="text-sm font-medium">Upload Seal/Stamp</span>
                            </>
                          )}
                        </div>
                      )}
                      <input type="file" ref={footerFileRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "footer")} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Card className="mt-12 overflow-hidden border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
          <CardContent className="p-10 flex items-center gap-6">
            <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
               <BadgeCheck className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Cloudinary Asset Sync</h3>
              <p className="text-slate-600 mt-1 max-w-2xl text-sm leading-relaxed">
                Images are automatically renamed to your organization slug for better asset management. 
                When an image is removed from here, it is permanently deleted from your Cloudinary cloud to keep storage clean.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
