<template>
  <div :style='applied_styles.editor_frame' data-name='editor-frame'>
    <div :style='applied_styles.editor_toolbar' data-name='editor-toolbar'>
      <mu-float-button icon='+' mini :style = 'applied_styles.toolbar.button' @click='batch_add_task'/>
    </div>
    <div :style='applied_styles.editor_content' data-name='editor-content'>
      <div :style='applied_styles.task_list_frame' data-name='task_list_frame'>
      </div>
      <div :style='applied_styles.task_detail_frame' data-name='task_detail_frame'>
      </div>
    </div>
    <mu-dialog 
      :open='shouldOpenCreateTaskDialog' 
      title='批量新建任务'
      data-name='batch_task_edit_dialog'
      :dialogClass = 'dialogClass'
      >
      <mu-flat-button label='完成' slot='actions' primary @click='commitCreation'/>
    </mu-dialog>
  </div>
</template>

<script>

import basic_styles from '@/styles';
import NewTaskDialog from "@/components/bz/dialogs/new-tasks-wizard"
const default_styles = {
  editor_frame: {
    ...basic_styles.v_container,
    alignItems: 'stretch',
    flexGrow: 1,
  },
  editor_toolbar: {
    ...basic_styles.h_container,
    justifyContent: 'flex-start',
    padding: '12px',
  },
  editor_content: {
    ...basic_styles.h_container,
    justifyContent: 'flex-start',
    flexGrow: 1,
  },
  task_list_frame: {
    ...basic_styles.v_container,
  },
  task_detail_frame: {
    ...basic_styles.v_container,
    flexGrow: 1,
  },
  toolbar: {
    button: {
      marginRight: '12px',
    },
  },
  batchTaskDialog: {
    frame: {
      width: '90vw',
      height: '90vh',
    },
  },
};

export default {
  props: {
  },// end of props
  data: function ()
  {
    return {
      default_styles: {...default_styles},
      currentState: {},
      dialogClass: 'dialog',
    };
  },// end of data
  computed: {
    applied_styles: function() 
    {
      return this.default_styles;
    },
    shouldOpenCreateTaskDialog: function()
    {
      return true;
    },
  },// end of computed
  methods: {
    batch_add_task: function() 
    {
      console.log('will add task');
    },
    commitCreation: function()
    {
    },
  },// end of methods
}
</script>

<style>
/**
 * 这里的内容需要同一放到一个文件里
 */
.dialog {
  width: 90vw;
  height: 90vh;
  max-width: none;
}
</style>
