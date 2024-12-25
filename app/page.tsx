import ImgcardList from "@/app/ui/home/img-card-list";
import ToolcardList from "@/app/ui/home/tool-card-list";
import { getToolsTree, getTasksInHome } from "@/app/lib/api";
import { ToolTree } from "@/app/lib/apiTypes";

export default async function Home() {

  const toolTree: ToolTree = await getToolsTree();
  const tasks = await getTasksInHome(12);

  return (
    <div>
      <ToolcardList data={toolTree?.data?.tools[0]?.children || []} />
      <ImgcardList data={tasks?.tasks || []} />
    </div>
  );
}
