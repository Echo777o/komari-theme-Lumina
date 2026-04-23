import { useMemo } from "react";
import { useVisibleNodeUuids } from "@/hooks/useNode";
import { useHomepagePingOverview } from "@/hooks/usePingMini";
import { usePublicConfig } from "@/hooks/usePublicConfig";
import { NodeCard } from "./NodeCard";

function orderNodeUuids(uuids: string[], preferredOrder: string[] | undefined) {
  if (!preferredOrder || preferredOrder.length === 0) return uuids;
  const rank = new Map(preferredOrder.map((uuid, index) => [uuid, index]));
  return [...uuids].sort((left, right) => {
    const leftRank = rank.get(left);
    const rightRank = rank.get(right);
    if (leftRank == null && rightRank == null) return 0;
    if (leftRank == null) return 1;
    if (rightRank == null) return -1;
    return leftRank - rightRank;
  });
}

export function NodeGrid() {
  const uuids = useVisibleNodeUuids();
  const { data: config } = usePublicConfig();
  useHomepagePingOverview();
  const orderedUuids = useMemo(
    () => orderNodeUuids(uuids, config?.theme_settings?.homepageNodeOrder as string[] | undefined),
    [uuids, config?.theme_settings?.homepageNodeOrder],
  );

  if (uuids.length === 0) {
    return (
      <div className="flex h-[40vh] flex-col items-center justify-center gap-2 text-[var(--text-tertiary)]">
        <span className="text-[15px]">尚未连接到任何节点</span>
        <span className="text-[12px]">等待后端推送或前往管理后台添加</span>
      </div>
    );
  }

  return (
    <div
      className="grid gap-4 xl:gap-5"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 360px), 1fr))" }}
    >
      {orderedUuids.map((uuid) => (
        <div key={uuid}>
          <NodeCard uuid={uuid} />
        </div>
      ))}
    </div>
  );
}
