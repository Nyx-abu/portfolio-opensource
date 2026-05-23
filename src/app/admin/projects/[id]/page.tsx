import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProjectEditor } from "@/components/admin/ProjectEditor";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (id === "new") return null; // handled by /new route
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();
  return (
    <ProjectEditor
      mode="edit"
      initial={{
        id: project.id,
        title: project.title,
        slug: project.slug,
        description: project.description,
        longDescription: project.longDescription ?? "",
        techStack: project.techStack,
        tags: project.tags,
        images: project.images,
        liveUrl: project.liveUrl ?? "",
        githubUrl: project.githubUrl ?? "",
        videoUrl: project.videoUrl ?? "",
        timeline: project.timeline ?? "",
        status: project.status,
        featured: project.featured,
        order: project.order,
      }}
    />
  );
}
