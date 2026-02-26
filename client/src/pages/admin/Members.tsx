import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminMembers } from "@/hooks/use-admin";
import { Search, UserPlus, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Members() {
  const { data: members, isLoading } = useAdminMembers();
  const { toast } = useToast();

  const handleAddMember = () => {
    toast({ title: "Action mock", description: "Add member dialog would open here." });
  };

  return (
    <DashboardLayout isAdmin>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Members</h1>
          <p className="text-muted-foreground mt-1">Manage users, roles, and access.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search members..." className="pl-9 bg-background" />
          </div>
          <Button className="shrink-0 rounded-xl shadow-md" onClick={handleAddMember}>
            <UserPlus className="w-4 h-4 mr-2" /> Add Member
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/50">
              <TableRow>
                <TableHead className="pl-6 py-4">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    Loading members...
                  </TableCell>
                </TableRow>
              ) : members?.map(member => (
                <TableRow key={member.id} className="hover:bg-muted/30">
                  <TableCell className="pl-6 py-4 font-medium">{member.name}</TableCell>
                  <TableCell className="text-muted-foreground">{member.email}</TableCell>
                  <TableCell>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${member.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
                      {member.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5 text-sm text-green-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Active
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
