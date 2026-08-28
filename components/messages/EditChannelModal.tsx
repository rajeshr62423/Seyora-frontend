"use client";

import { Form, Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMessage } from "@/lib/hooks/use-message";
import { scrollableModalStyles } from "@/lib/modal-styles";
import { closeEditChannelModal, updateChannelRequest } from "@/redux/messages/action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

interface EditChannelFormFields {
  name: string;
  memberIds: string[];
}

const DEFAULT_VALUES: EditChannelFormFields = { name: "", memberIds: [] };

export default function EditChannelModal() {
  const dispatch = useAppDispatch();
  const { channels, editingChannelId, updatingChannel, updateChannelError } = useAppSelector(
    (state) => state.messages,
  );
  const organizationState = useAppSelector((state) => state.organization);
  const message = useMessage();
  const [attempted, setAttempted] = useState(false);

  const channel = channels.find((c) => c.id === editingChannelId);
  const open = !!editingChannelId && !!channel;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditChannelFormFields>({ defaultValues: DEFAULT_VALUES, mode: "onSubmit" });

  // Seed the form from the channel being edited each time a (different)
  // one opens — not on every render, since the user's in-progress edits
  // shouldn't be clobbered by an unrelated state update.
  useEffect(() => {
    if (channel) {
      reset({ name: channel.name, memberIds: channel.members.map((m) => m.id) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel?.id]);

  useEffect(() => {
    if (!attempted || updatingChannel) return;
    if (updateChannelError) {
      message.error(updateChannelError);
    } else {
      message.success("Channel updated");
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttempted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempted, updatingChannel, updateChannelError]);

  const onSubmit = (values: EditChannelFormFields) => {
    if (!editingChannelId) return;
    setAttempted(true);
    dispatch(
      updateChannelRequest(editingChannelId, {
        name: values.name,
        memberIds: values.memberIds.map((id) => Number(id)),
      }),
    );
  };

  return (
    <Modal
      title="Channel settings"
      open={open}
      onCancel={() => dispatch(closeEditChannelModal())}
      onOk={handleSubmit(onSubmit)}
      okText="Save changes"
      cancelText="Cancel"
      confirmLoading={updatingChannel}
      destroyOnHidden
      centered
      styles={scrollableModalStyles}
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className="card-pad" style={{ padding: "4px 0 0" }}>
        <Form.Item
          label="Channel name"
          required
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            rules={{ required: "Channel name is required" }}
            render={({ field }) => <Input {...field} placeholder="e.g. engineering" />}
          />
        </Form.Item>

        <Form.Item label="Members">
          <Controller
            name="memberIds"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                mode="multiple"
                placeholder="Add or remove members (you're always included)"
                loading={organizationState.membersLoading}
                options={organizationState.members.map((m) => ({ value: m.user.id, label: m.user.name }))}
              />
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
