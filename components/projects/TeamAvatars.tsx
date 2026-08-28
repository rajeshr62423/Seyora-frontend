import { Tooltip } from "antd";
import Avatar from "@/components/common/Avatar";
import { ORG_ROLE_LABEL } from "@/lib/status";
import { useAppSelector } from "@/redux/hooks";
import type { User } from "@/types/user";

interface TeamAvatarsProps {
  team: User[];
  max?: number;
}

export default function TeamAvatars({ team, max = 3 }: TeamAvatarsProps) {
  const orgMembers = useAppSelector((state) => state.organization.members);
  const visible = team.slice(0, max);
  const overflow = team.length - visible.length;

  return (
    <span className="avatar-stack">
      {visible.map((member) => {
        const orgRole = orgMembers.find((m) => m.userId === member.id)?.role;
        return (
          <Tooltip key={member.id} title={`${member.name}${orgRole ? ` · ${ORG_ROLE_LABEL[orgRole]}` : ""}`}>
            <Avatar url={member.avatarUrl} initials={member.initials} />
          </Tooltip>
        );
      })}
      {overflow > 0 ? (
        <Tooltip title={team.slice(max).map((m) => m.name).join(", ")}>
          <span className="avatar">+{overflow}</span>
        </Tooltip>
      ) : null}
    </span>
  );
}
