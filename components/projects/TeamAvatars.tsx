import { Tooltip } from "antd";
import type { User } from "@/types/user";

interface TeamAvatarsProps {
  team: User[];
  max?: number;
}

export default function TeamAvatars({ team, max = 3 }: TeamAvatarsProps) {
  const visible = team.slice(0, max);
  const overflow = team.length - visible.length;

  return (
    <span className="avatar-stack">
      {visible.map((member) => (
        <Tooltip key={member.id} title={`${member.name} · ${member.role}`}>
          <span className="avatar">{member.initials}</span>
        </Tooltip>
      ))}
      {overflow > 0 ? (
        <Tooltip title={team.slice(max).map((m) => m.name).join(", ")}>
          <span className="avatar">+{overflow}</span>
        </Tooltip>
      ) : null}
    </span>
  );
}
