import { AboutEditor } from "@/components/admin/AboutEditor";
import { getAboutContent } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminAbout() {
  const a = await getAboutContent();
  return <AboutEditor initial={{ headline: a.headline, body: a.body }} />;
}
