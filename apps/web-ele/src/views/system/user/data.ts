import type { FormSchemaGetter } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { DictEnum } from '@vben/constants';

import { z } from '#/adapter/form';
import { getDictOptions } from '#/utils/dict';

export const girdColumns: VxeTableGridOptions['columns'] = [
  { type: 'checkbox', width: 60 },
  {
    field: 'userName',
    title: '用户名称',
  },
  {
    field: 'userBalance',
    title: '用户余额',
  },
  {
    field: 'avatar',
    title: '头像',
    slots: { default: 'avatar' },
    width: 80,
  },
  {
    field: 'createTime',
    title: '创建时间',
  },
  {
    field: 'loginDate',
    title: '最后登录时间',
  },
  {
    field: 'status',
    title: '状态',
    // slots: { default: 'status' },
  },
  {
    field: 'action',
    fixed: 'right',
    // slots: { default: 'action' },
    title: '操作',
    width: 180,
  },
];
export const searchFormSchemas: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'userName',
    label: '用户账号',
  },
  {
    component: 'Input',
    fieldName: 'nickName',
    label: '用户昵称',
  },
  {
    component: 'Select',
    componentProps: {
      options: getDictOptions(DictEnum.SYS_NORMAL_DISABLE),
    },
    fieldName: 'status',
    label: '用户状态',
  },
  {
    component: 'DatePicker',
    componentProps: {
      type: 'daterange',
    },
    fieldName: 'createTime',
    label: '创建时间',
  },
];
export const formSchamas: FormSchemaGetter = () => [
  {
    component: 'Input',
    dependencies: {
      show: () => false,
      triggerFields: [''],
    },
    fieldName: 'userId',
  },
  {
    component: 'Input',
    fieldName: 'userName',
    label: '用户账号',
    rules: 'required',
  },
  {
    component: 'Input',
    fieldName: 'password',
    componentProps: {
      type: 'password',
    },
    label: '用户密码',
    rules: 'required',
  },
  {
    component: 'Input',
    fieldName: 'nickName',
    label: '用户昵称',
    rules: 'required',
  },

  {
    component: 'Input',
    fieldName: 'phone',
    label: '手机号码',
    defaultValue: undefined,
    rules: z
      .string()
      .regex(/^1[3-9]\d{9}$/, '请输入正确的手机号码')
      .optional(),
  },
  {
    component: 'Input',
    fieldName: 'email',
    defaultValue: undefined,
    label: '邮箱',
    // TODO: 这里非必填未生效
    rules: z.string().email('请输入正确的邮箱').optional(),
  },
  {
    component: 'RadioGroup',
    componentProps: {
      options: getDictOptions(DictEnum.SYS_USER_SEX),
    },
    defaultValue: '0',
    fieldName: 'sex',
    formItemClass: 'col-span-2 lg:col-span-1',
    label: '性别',
  },
  {
    component: 'RadioGroup',
    componentProps: {
      options: getDictOptions(DictEnum.SYS_NORMAL_DISABLE),
    },
    defaultValue: '0',
    fieldName: 'status',
    formItemClass: 'col-span-2 lg:col-span-1',
    label: '状态',
  },
  {
    component: 'Select',
    componentProps: {
      multiple: true,
      collapseTags: true,
      placeholder: '请先选择部门',
      options: [],
    },
    fieldName: 'postIds',
    help: '选择部门后, 将自动加载该部门下所有的岗位',
    label: '岗位',
  },
  {
    component: 'Select',
    componentProps: {
      multiple: true,
      collapseTags: true,
      options: [],
    },
    fieldName: 'roleIds',
    label: '角色',
  },
  {
    component: 'Input',
    fieldName: 'remark',
    componentProps: {
      type: 'textarea',
    },
    label: '备注',
  },
];
