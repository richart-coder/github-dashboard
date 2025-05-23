import ReactMarkdown from "react-markdown";
import { MarkdownComponents } from "./MarkdownComponents";
import Spinner from "@/components/client/ui/Spinner";
import { notificationDetailQueryOptions } from "@/data/query-options/notifications";
import { useQuery } from "@tanstack/react-query";

const OverlayModalContent = ({ id }: { id: string | null }) => {
  const { data, status } = useQuery<{ body: string }>(
    notificationDetailQueryOptions(id)
  );

  return status === "pending" ? (
    <Spinner />
  ) : status === "error" ? (
    <div className="text-red-500">載入失敗，請稍後再試。</div>
  ) : (
    <ReactMarkdown components={MarkdownComponents}>
      {data?.body ?? "無詳細內容"}
    </ReactMarkdown>
  );
};
export default OverlayModalContent;
