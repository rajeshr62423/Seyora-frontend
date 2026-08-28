"use client";

import { Form, Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMessage } from "@/lib/hooks/use-message";
import { scrollableModalStyles } from "@/lib/modal-styles";
import { closeCreateChannelModal, createChannelRequest } from "@/redux/messages/action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

interface CreateChannelFormFields {
  name: string;
  memberIds: string[];
}

const DEFAULT_VALUES: CreateChannelFormFields = { name: "", memberIds: [] };

export default function CreateChannelModal() {
  const dispatch = useAppDispatch();
  const { isCreateChannelModalOpen, creatingChannel, createChannelError } = useAppSelector(
    (state) => state.messages,
  );
  const organizationState = useAppSelector((state) => state.organization);
  const message = useMessage();
  const [attempted, setAttempted] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateChannelFormFields>({ defaultValues: DEFAULT_VALUES, mode: "onSubmit" });

  useEffect(() => {
    if (!isCreateChannelModalOpen) reset(DEFAULT_VALUES);
  }, [isCreateChannelModalOpen, reset]);

  useEffect(() => {
    if (!attempted || creatingChannel) return;
    if (createChannelError) {
      message.error(createChannelError);
    } else {
      message.success("Channel created");
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttempted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempted, creatingChannel, createChannelError]);

  const onSubmit = (values: CreateChannelFormFields) => {
    setAttempted(true);
    dispatch(
      createChannelRequest({
        name: values.name,
        memberIds: values.memberIds.map((id) => Number(id)),
      }),
    );
  };

  return (
    <Modal
      title="Create channel"
      open={isCreateChannelModalOpen}
      onCancel={() => dispatch(closeCreateChannelModal())}
      onOk={handleSubmit(onSubmit)}
      okText="Create channel"
      cancelText="Cancel"
      confirmLoading={creatingChannel}
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
                placeholder="Add members (you're always included)"
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
