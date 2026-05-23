import { ProjectEditor } from "@/components/admin/ProjectEditor";

export const dynamic = "force-dynamic";

export default function NewProjectPage() {
  return <ProjectEditor mode="create" />;
}
