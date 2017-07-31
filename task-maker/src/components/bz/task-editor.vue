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
      <mu-stepper :activeStep='currentStep'>
        <mu-step>
          <mu-step-label>
            编辑标题
          </mu-step-label>
        </mu-step>
        <mu-step>
          <mu-step-label>
            编辑属性
          </mu-step-label>
        </mu-step>
        <mu-step>
          <mu-step-label>
            完成
          </mu-step-label>
        </mu-step>
      </mu-stepper>
      <task-list :tasks  = 'tasks'/>
      <mu-flat-button label='完成' slot='actions' primary @click='commitCreation'/>
    </mu-dialog>
  </div>
</template>

<script>
"use strict";
const taskStr=`
旧bug修复
  1121
  1134
重整测评和训练分类
  数据整理
  工具实现
  数据库实现
`.trim();
let j2s = JSON.stringify;

let parseTask = (tstr) => {
  let terminals = /^(\s*)([^\s].*)$/;
  let match = terminals.exec(tstr);
  let indent = match[1].replace('\t', '  ');
  let title = match[2];
  return {
    indent,
    title,
    /* assigned: '',*/
    /* priority: '',*/
    /* severity: '',*/
    /* deadline: '',*/
    /* riskAssessment: '',*/
  };
};

let generateTasks = (tasks, stack, task) =>
{
  let subTasks = [];
  while(tasks.length > 0)
  {
    let cachedTask = tasks[tasks.length - 1];
    
    if (cachedTask.indent.length <= task.indent.length)
    {
      break;
    }
    subTasks.push(cachedTask);
    tasks.pop();
  }
  if (subTasks.length > 0)
  {
    task.subTasks = subTasks;
  }
  tasks.push(task);
  if (stack.length === 0)
  {
    return tasks.reverse();
  }
  return generateTasks(tasks, stack.slice(0, -1), stack[Math.max(0, stack.length - 1)]);
}


let parseTasks = (tstr) => {
  let lines = tstr.split('\n');
  let stack = [];
  for (const line of lines)
  {
    let task = parseTask(line);
    stack.push(task);
  }
  let tasks = 
    generateTasks(
      [], 
      stack.slice(0, -1), 
      stack[Math.max(0, stack.length - 1)]);
  return tasks;
};


let taskData = parseTasks(taskStr);


import basic_styles from '@/styles';
import NewTaskDialog from "@/components/bz/dialogs/new-tasks-wizard"
/**
 *  任务列表组件
 */
let taskListTemplate = `
  <mu-list>
    <mu-list-item v-for="task of tasks" :title="task.title">
      <div slot='describe' style="
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      ">
        <span>负责人:</span>
        <span>优先级:</span>
        <span>严重程度:</span>
        <span>截止日期:</span>
      </div>
      <task-list v-if='task.subTasks !== undefined' :tasks = 'task.subTasks'/>
    </mu-list-item>
  </mu-list>
`.trim();
let taskList = {
  template: taskListTemplate,
  name: 'task-list',
  props: {
    tasks: {
      type: Array,
      require: true,
    },
  },
  data: function()
  {
    return {};
  },
  computed: {},
};
/**
 *
 *  任务批量编辑向导组件
 *
 */
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
      tasks: taskData,
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
    currentStep: function()
    {
      return 1;
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
  components: {
    'task-list': taskList,
  },//end of components
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
