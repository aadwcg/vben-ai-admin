<script lang="ts" setup>
import type { Role } from '#/api/system/user/model';

import { h, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElTag } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { findUserInfo } from '#/api/system/user';

import { useFormSchema } from '../data';

const isUpdate = ref(false);

/**
 * authScopeOptions user也会用到
 */
const authScopeOptions = [
  { color: 'green', label: '全部数据权限', value: '1' },
  { color: 'default', label: '自定数据权限', value: '2' },
  { color: 'orange', label: '本部门数据权限', value: '3' },
  { color: 'cyan', label: '本部门及以下数据权限', value: '4' },
  { color: 'error', label: '仅本人数据权限', value: '5' },
  { color: 'default', label: '部门及以下或本人数据权限', value: '6' },
];

/**
 * 生成角色的自定义label
 * 也可以用option插槽来做
 * renderComponentContent: () => ({
    option: ({value, label, [disabled, key, title]}) => '',
  }),
 */
function genRoleOptionlabel(role: Role) {
  const found = authScopeOptions.find((item) => item.value === role.dataScope);
  if (!found) {
    return role.roleName;
  }
  return h('div', { class: 'flex items-center gap-[6px]' }, [
    h('span', null, role.roleName),
    h(ElTag, { color: found.color }, () => found.label),
  ]);
}
const onSubmit = () => {};

const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
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
      label: genRoleOptionlabel(item),
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
</script>
<template>
  <Modal>
    <Form />
  </Modal>
</template>
