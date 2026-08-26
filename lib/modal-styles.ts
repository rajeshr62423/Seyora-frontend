import type { ModalProps } from "antd";

/**
 * Shared antd Modal `styles` for a fixed header, fixed footer, and a body
 * that's the only scrollable region — bounded to the viewport so a long
 * form/detail view never grows the modal taller than the screen (which
 * would otherwise scroll the mask/page instead of just the content).
 *
 * Apply to every antd <Modal> in the app (with `centered`) for consistent
 * behavior — see CreateProjectModal for the original fix this was lifted
 * from.
 */
export const scrollableModalStyles: NonNullable<ModalProps["styles"]> = {
  container: {
    display: "flex",
    flexDirection: "column",
    maxHeight: "min(85vh, 760px)",
    overflow: "hidden",
  },
  header: { flex: "0 0 auto" },
  body: {
    flex: "1 1 auto",
    minHeight: 0,
    overflowY: "auto",
    overflowX: "hidden",
  },
  footer: { flex: "0 0 auto" },
};
