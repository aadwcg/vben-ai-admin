<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { cloneDeep } from '@vben/utils';

import { useVbenForm } from '#/adapter/form';
import { findUserInfo, userAdd, userUpdate } from '#/api/system/user';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);
const isUpdate = ref(false);
const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel: handleCancel,
  onConfirm: handleConfirm,
  async onOpenChange(isOpen) {
    if (!isOpen) {
      // 关闭时清空岗位选项
      formApi.updateSchema([
        {
          fieldName: 'postIds',
          componentProps: {
            options: [],
            placeholder: '请先选择部门',
          },
        },
      ]);
      return;
    }

    const { id } = modalApi.getData<{ id?: number | string }>() || {};
    isUpdate.value = !!id;

    // 控制字段禁用和显隐
    formApi.updateSchema([
      {
        fieldName: 'userName',
        componentProps: { disabled: isUpdate.value },
      },
      {
        fieldName: 'password',
        dependencies: {
          show: () => !isUpdate.value,
          triggerFields: ['id'],
        },
      },
    ]);

    // 查询用户详情
    const { postIds, posts, roleIds, roles, user } = await findUserInfo(id);

    // 生成岗位和角色选项
    const postOptions = (posts ?? []).map((item) => ({
      label: item.postName,
      value: item.postId,
    }));
    const roleOptions = (roles ?? []).map((item) => ({
      label: item.roleName,
      title: item.roleName, // 用于显示回填
      value: item.roleId,
    }));

    // 更新选项
    formApi.updateSchema([
      {
        fieldName: 'postIds',
        componentProps: {
          options: postOptions,
        },
      },
      {
        fieldName: 'roleIds',
        componentProps: {
          optionLabelProp: 'title',
          options: roleOptions,
        },
      },
    ]);

    // 表单赋值
    if (user) {
      await Promise.all([
        formApi.setValues(user),
        formApi.setFieldValue('postIds', postIds),
        formApi.setFieldValue('roleIds', roleIds),
      ]);
    }
  },
});
async function handleConfirm() {
  const { valid } = await formApi.validate();
  if (!valid) {
    return;
  }
  modalApi.setState({ loading: true, confirmLoading: true });
  try {
    const data = cloneDeep(await formApi.getValues());
    await (isUpdate.value ? userUpdate(data) : userAdd(data));
    emit('success');
    await modalApi.close();
  } finally {
    modalApi.setState({ loading: false, confirmLoading: false });
  }
}
async function handleCancel() {
  modalApi.close();
  await formApi.resetForm();
}
</script>
<template>
  <Modal title="新增用户">
    <Form />
  </Modal>
</template>
