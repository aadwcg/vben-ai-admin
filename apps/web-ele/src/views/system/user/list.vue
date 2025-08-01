<script setup lang="ts">
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { User } from '#/api/system/user/model';

import { Page, useVbenModal } from '@vben/common-ui';
import { preferences } from '@vben/preferences';

import { ElAvatar, ElButton, ElMessageBox } from 'element-plus';

import { useVbenVxeGrid, vxeCheckboxChecked } from '#/adapter/vxe-table';
import { userList, userRemove } from '#/api';

import { useGirdColumns, useGridFormSchema } from './data';
import AddForm from './modules/form.vue';

const formOptions: VbenFormProps = {
  // 日期选择格式化
  fieldMappingTime: [
    [
      'createTime',
      ['params[beginTime]', 'params[endTime]'],
      ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59'],
    ],
  ],
  commonConfig: {
    labelWidth: 80,
    componentProps: {
      allowClear: true,
    },
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  schema: useGridFormSchema(),
};

const gridOptions: VxeTableGridOptions = {
  columns: useGirdColumns(),
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        const res = await userList({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
        return res;
      },
    },
    response: {
      result: 'rows',
      total: 'total',
      message: 'msg',
    },
  },
  height: 'auto',
};

const [TableGrid, tableApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});
const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: AddForm,
});
function confirm(content: string, title = '提示'): Promise<boolean> {
  return ElMessageBox.confirm(content, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => true)
    .catch(() => false); // 用户取消，返回 false
}
/**
 * 新增
 */
async function handleAdd() {
  formModalApi.setData({});
  formModalApi.open();
}
/**
 * 批量删除
 */
async function handleMultiDelete() {
  const rows = tableApi.grid.getCheckboxRecords();
  const ids = rows.map((row: User) => row.userId);
  const ok = await confirm(`确认删除选中的${ids.length}条记录吗？`);
  if (ok) {
    await userRemove(ids);
    refreshGrid();
  }
}
/**
 * 删除
 */
async function handleDelete(row: User) {
  await userRemove([row.userId]);
  await tableApi.query();
}
function handleEdit(row: User) {
  formModalApi.setData({ id: row.userId });
  formModalApi.open();
}
/**
 * 刷新表格
 */
function refreshGrid() {
  tableApi.query();
}
</script>

<template>
  <Page auto-content-height>
    <TableGrid table-title="用户列表">
      <template #toolbar-tools>
        <ElButton
          v-access:code="['system:user:delete']"
          type="primary"
          @click="handleMultiDelete"
          :disabled="!vxeCheckboxChecked(tableApi)"
        >
          {{ $t('pages.common.delete') }}
        </ElButton>
        <ElButton
          v-access:code="['system:user:add']"
          type="primary"
          @click="handleAdd"
        >
          {{ $t('pages.common.add') }}
        </ElButton>
      </template>
      <template #avatar="{ row }">
        <ElAvatar :src="row.avatar || preferences.app.defaultAvatar" />
      </template>
      <template #action="{ row }">
        <ElButton
          v-access:code="['system:user:delete']"
          type="primary"
          link
          @click="handleEdit(row)"
        >
          {{ $t('pages.common.edit') }}
        </ElButton>
        <ElButton
          v-access:code="['system:user:delete']"
          type="danger"
          link
          @click="handleDelete(row)"
        >
          {{ $t('pages.common.delete') }}
        </ElButton>
      </template>
    </TableGrid>
    <FormModal @success="refreshGrid" />
  </Page>
</template>
