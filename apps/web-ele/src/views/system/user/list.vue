<script setup lang="ts">
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { Page, useVbenModal } from '@vben/common-ui';
import { preferences } from '@vben/preferences';

import { ElAvatar, ElButton } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { userList } from '#/api';

import { useColumns, useGridFormSchema } from './data';
import AddForm from './modules/addForm.vue';

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
  columns: useColumns(),
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

const [Grid] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});
const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: AddForm,
});
const handleAdd = async () => {
  formModalApi.open();
};
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="用户列表">
      <template #toolbar-tools>
        <Space>
          <ElButton v-access:code="['system:user:delete']" type="primary">
            {{ $t('pages.common.delete') }}
          </ElButton>
          <ElButton
            v-access:code="['system:user:add']"
            type="primary"
            @click="handleAdd"
          >
            {{ $t('pages.common.add') }}
          </ElButton>
        </Space>
      </template>
      <template #avatar="{ row }">
        <ElAvatar :src="row.avatar || preferences.app.defaultAvatar" />
      </template>
    </Grid>
    <FormModal />
  </Page>
</template>
