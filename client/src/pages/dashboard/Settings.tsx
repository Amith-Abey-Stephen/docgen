import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { UserCircle, Shield, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Settings saved", description: "Your profile has been updated." });
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences and profile.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 space-y-2">
          <Button variant="secondary" className="w-full justify-start text-foreground bg-secondary/80">
            <UserCircle className="w-4 h-4 mr-2" />
            Profile
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
        </div>

        <div className="col-span-1 md:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user?.name} className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={user?.email} className="bg-background" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company / Organization</Label>
                  <Input id="company" defaultValue="Acme Corp" className="bg-background" />
                </div>
                <div className="pt-4 flex justify-end">
                  <Button type="submit" className="rounded-xl">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password to keep your account secure.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-pwd">Current Password</Label>
                  <Input id="current-pwd" type="password" className="bg-background" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-pwd">New Password</Label>
                    <Input id="new-pwd" type="password" className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-pwd">Confirm Password</Label>
                    <Input id="confirm-pwd" type="password" className="bg-background" />
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <Button type="submit" variant="secondary" className="rounded-xl">Update Password</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
