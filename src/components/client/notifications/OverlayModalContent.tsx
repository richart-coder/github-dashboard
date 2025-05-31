import Spinner from "@/components/client/ui/Spinner";
import { notificationDetailQueryOptions } from "@/data/query-options/repo";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarkdownComponents } from "./MarkdownComponents";

const OverlayModalContent = ({ id }: { id: string | null }) => {
  const { data, status } = useQuery<{ body: string }>(
    notificationDetailQueryOptions(id)
  );

  return status === "pending" ? (
    <Spinner />
  ) : status === "error" ? (
    <div className="text-red-500">載入失敗，請稍後再試。</div>
  ) : (
    <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
      {data?.body ?? "無詳細內容"}
    </ReactMarkdown>
  );
};
export default OverlayModalContent;
