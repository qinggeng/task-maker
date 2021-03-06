<template>
  <div :style='applied_styles.editor_frame' data-name='editor-frame'>
    <mu-linear-progress :mode='progress_mode' :value='0' :min='0' :max='100'/>
    <div :style='applied_styles.editor_toolbar' data-name='editor-toolbar'>
      <mu-float-button 
        mini
        data-name = 'btn-create-tasks'
        :disabled = 'inProgress'
        icon      = 'add'
        :style    = 'applied_styles.toolbar.button'
        @click    = 'batch_add_task'/>
      <mu-float-button 
        mini
        data-name = 'btn-search-tasks'
        :disabled = 'inProgress'
        icon   = 'search'
        @click = '()=>{editingSearching = true}'
        :style = 'applied_styles.toolbar.button'/>
      <mu-float-button 
        mini
        data-name = 'btn-reload-search'
        :disabled = 'inProgress || this.tasks.length == 0'
        icon   = 'refresh'
        :style = 'applied_styles.toolbar.button'/>
      <mu-float-button 
        mini
        data-name = 'btn-export-excel'
        :disabled = 'inProgress || this.tasks.length == 0'
        icon   = 'file_download'
        @click = 'export_excel'
        :style = 'applied_styles.toolbar.button'/>
      <mu-float-button 
        mini
        data-name = 'save-changes'
        :disabled = 'inProgress'
        icon   = 'save'
        :style = 'applied_styles.toolbar.button'/>
      <span style='flex-grow: 1'/>
      <mu-float-button 
        mini 
        :disabled = 'inProgress'
        icon   = 'settings'
        ref    = 'btn_setting'
        :style = 'applied_styles.toolbar.button'
        @click = 'pop_settings'/>
      <span style='width: 20px'/>
    </div>
    <div 
      :style='applied_styles.editor_content' 
      data-name='editor-content'
    >
      <mu-table
        ref = 'taskTable'
      >
        <mu-thead>
          <mu-tr
          >
            <mu-th
              v-for = 'column in column_settings'
              :key = 'column.value'
            >
              {{column.value}}
            </mu-th>
          </mu-tr>
        </mu-thead>
        <mu-tbody>
          <mu-tr
            v-for = 'task in tasks'
            key = 'tasks.indexOf(task)'
          >
            <mu-td
              v-for = 'column in column_settings'
              :key = 'column.value'
              style = '
                white-space: unset;
              '
            >
              <data-editor
                :raw_data='access(task, column)'
                :data_traits='column'
                :user_defined_editors = 'column.editors'
                @edited = '((r, c, v)=>{onEdited(r, c, v)}).bind(undefined, task, column)'
              />
            </mu-td>
          </mu-tr>
        </mu-tbody>
      </mu-table>
      <!--
      <div :style='applied_styles.task_list_frame' data-name='task_list_frame'>
      </div>
      <div :style='applied_styles.task_detail_frame' data-name='task_detail_frame'>
      </div>
      -->
    </div>
    <div
      data-name = 'status-bar-wrapper'
      style = '
        height: 24px;
        align-self: stretch;
      '
    >
      <div 
        data-name = 'status-bar'
        style = '
          display: flex;
          justify-content: flex-start;
          align-items: center;
        '
      >
        <div 
          style='width: 8px'
        />
        <span
        >
          {{statusHint}}
        </span>
      </div>
    </div>
    <!-- 
    *******************
    *                 *
    *     dialogs     *
    *                 *
    *******************
    -->
    <mu-dialog 
      :open='batchCreatingTask' 
      title='批量新建任务'
      data-name='batch_task_edit_dialog'
      :dialogClass = 'dialogClass'
      bodyClass = 'dialog-body'
      @close = 'batchCreatingTask = false'
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
      </mu-stepper>
      <mu-text-field 
        v-if = 'currentStep === 0'
        multiLine
        fullWidth
        ref = 'batchText'
      />
      <mu-list 
        v-if = 'currentStep === 1' 
        style = "
          flex-grow: 1;
          overflow-y: auto;
      ">
        <task-list-item 
          v-for         = 'task of tasks'
          :task         = 'task'
          :key          = 'task.task'
          @request-edit-task = 'edit_task'
          @editing-task = 'update_task'/>
      </mu-list>
      <mu-flat-button 
        v-if = 'currentStep < 1'
        label='下一步' 
        slot='actions' 
        primary 
        @click='nextStep'
      />
      <mu-circular-progress :size = '20' v-if = 'inProgress === true'/>
      <mu-flat-button 
        v-if = 'currentStep === 1'
        label='创建' 
        slot='actions' 
        primary 
        @click='commitCreation'
      />
      <mu-dialog 
        :open = 'editingTask'
        @close = 'finish_edit_task'
        dialogClass = 'editor-dialog'
        >
        <div style='
          display: flex;
          flex-direction: column;
          align-items: center;
        '>
          <mu-text-field label='标题' v-model='editTarget.task' fullWidth/>
          <div style='
          display: flex;
          flex-direction: row;
          flex-grow: 1;
          flex-wrap: wrap;
          justify-content: space-between;
        '>
          <mu-select-field label='负责人' v-model='editTarget.assigned'>
            <mu-menu-item 
              v-for='user of config.users'
              :value='user.realName'
              :key='user.phid'
              :title='user.realName'/>
          </mu-select-field>
          <mu-select-field label='状态' v-model='editTarget.status'>
            <mu-menu-item 
              v-for='status of config.status'
              :value='status.display'
              :key='status.val'
              :title='status.display'/>
          </mu-select-field>
          <mu-select-field label='优先级' v-model='editTarget.priority'>
            <mu-menu-item 
              v-for='priority of config.priority'
              :value='priority.display'
              :key='priority.val'
              :title='priority.display'/>
          </mu-select-field>
          <mu-select-field label='严重程度' v-model='editTarget.severity'>
            <mu-menu-item 
              v-for='severity of config.severity'
              :value='severity.display'
              :key='severity.val'
              :title='severity.display'/>
          </mu-select-field>
          <mu-select-field label='项目' v-model='editTarget.tags' multiple>
            <mu-menu-item 
              v-for='project of config.projects'
              :value='project.name'
              :key='project.phid'
              :title='project.name'/>
          </mu-select-field>
          <mu-select-field label='风险' v-model='editTarget.riskAssessment'>
            <mu-menu-item value='aa' title = 'aa'/>
          </mu-select-field>
          <mu-date-picker 
            container='inline' 
            :autoOk='true' 
            mode='landscape' 
            v-model = 'editTarget.deadline_date'
            label='截止日期'/>
          <mu-time-picker 
            container='inline' 
            mode='landscape' 
            label='截止时间' 
            v-model = 'editTarget.deadline_time'
            format='24hr'/>
          <mu-text-field 
            type = 'number'
            label = '预估工时'
            hintText = '小时数'
            v-model = 'editTarget.points'
          />
          </div>
        </div>
      </mu-dialog>
    </mu-dialog>
    <search-edit-dialog
      :opening='editingSearching'
      @request-close='()=>{editingSearching = false}'
      @request-search = 'doSearch'
      @request-search-and-save = 'doSearchAndExport'
    />
    <!-- end of dialogs -->
    <!-- 
    *********************
    *                   *
    *     pop-overs     *
    *                   *
    *********************
    -->
    <mu-popover 
      :trigger = 'btn_setting'
      :open = 'inSettingMode'
      @close = 'inSettingMode = false'>
      <mu-menu>
        <mu-menu-item style='margin-bottom: 10px'>
          <mu-text-field hintText = "站点" v-model = 'config.host' slot = 'title'/>
        </mu-menu-item>
        <mu-menu-item style='margin-bottom: 10px'>
          <mu-text-field hintText = "用户名" v-model = 'config.user' slot = 'title'/>
        </mu-menu-item>
        <mu-menu-item style='margin-bottom: 10px'>
          <mu-text-field hintText = "密码" v-model = 'config.password' slot = 'title'/>
        </mu-menu-item>
        <mu-menu-item style='margin-bottom: 10px'>
          <mu-text-field hintText = "API密钥" v-model = 'config.api_sec' slot = 'title'/>
        </mu-menu-item>
        <mu-menu-item title='刷新Phabricator设置' @click='reload_fab_settings'/>
      </mu-menu>
    </mu-popover>
    <!-- end of pop-overs -->
  </div>
</template>

<script>
"use strict";

import store           from '@/store';
import column_settings from '@/store/default_column_settings';
import DataEditor      from '@/components/bz/controls/data-editor'
import utils           from '@/utils';
import FileSaver       from 'file-saver';

const config = store.state.config;
let j2s = JSON.stringify;

import basic_styles     from '@/styles';
import NewTaskDialog    from "@/components/bz/dialogs/new-tasks-wizard"
import SearchEditDialog from "@/components/bz/dialogs/search_edit_dialog"
import {parseTasks}     from "@/utils/task_parser"

const buildConstraints = (criterias) => 
{
  let sortedPriority = 
    store.state.config.priority.sort((x, y) => { return x < y});
  let fieldConstraintMakers = {
    priority:{
      higher_than: ((priority, val)=>
      {
        return {
          key: 'priorities', 
          val: priority.filter(x => x.val > val).map(x => x.val),
        };
      }).bind(undefined, sortedPriority),
      lower_than: ((priority, val)=>
      {
        return {
          key: 'priorities', 
          val: priority.filter(x => x.val < val).map(x => x.val),
        };
      }).bind(undefined, sortedPriority),
      belongs_to: ((val)=>
      {
        return {
          key: 'priorities', 
          val: val,
        };
      }),
    },
    project: {
      belongs_to: ((val)=>
      {
        return {
          key: 'projects', 
          val: val,
        };
      }),
    },
    author: {
      belongs_to: ((val)=>
      {
        return {
          key: 'authorPHIDs', 
          val: val,
        };
      }),
    },
    assigned: {
      belongs_to: ((val)=>
      {
        return {
          key: 'assigned', 
          val: val,
        };
      }),
    },
    status: {
      belongs_to: ((val)=>
      {
        return {
          key: 'statuses', 
          val: val,
        };
      }),
    },
    modified: {
      not_later_than: (val)=>
      {
        val = new Date(val);
        return {
          key: 'modifiedEnd',
          val: val.getTime() / 1000,
        };
      },
      not_earlier_than: (val)=>
      {
        val = new Date(val);
        return {
          key: 'modifiedStart',
          val: val.getTime() / 1000,
        };
      },
    },
    created: {
      not_later_than: (val)=>
      {
        val = new Date(val);
        return {
          key: 'createdEnd',
          val: val.getTime() / 1000,
        };
      },
      not_earlier_than: (val)=>
      {
        val = new Date(val);
        return {
          key: 'createdStart',
          val: val.getTime() / 1000,
        };
      },
    },
  };

  let constraints = {};

  for (let criteria of criterias)
  {
    try
    {
      let fieldConstraint =
        fieldConstraintMakers[criteria.operate_on][criteria.operator](criteria.operand);
      constraints[fieldConstraint.key] = fieldConstraint.val;
    }
    catch(ex)
    {
      console.log(ex.message);
    }
  }
  return {constraints};
};// end of buildConstraints

/**
 *  任务列表组件
 */
let taskListItemTemplate = `
    <mu-list-item 
      :title="task.task"
      :toggleNested='task.subTasks && task.subTasks.length > 0'
    >
      <div slot='describe' 
        @click = 'editTask(task)'
        style="
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
      ">
        <span>负责人:{{task.assigned}}</span>
        <span>优先级:{{task.priority}}</span>
        <span>状态:{{task.status}}</span>
        <span>严重程度:{{task.severity}}</span>
        <span>截止期限:{{task.deadline_local}}</span>
        <span>预估工时:{{task.points}}小时</span>
        <span>项目:{{task.tags.join(', ')}}</span>
      </div>
      <task-list-item 
        v-for         = 'task of task.subTasks'
        slot = 'nested'
        @editing-task = 'sub_task_edited'
        @request-edit-task = '(v)=>{buble_event("request-edit-task", v)}'
        :task         = 'task'
        :isSubtask    = 'true'
        :key          = 'task.task'/>
    </mu-list-item>
  </mu-list>
`.trim();
let taskListItem = {
  template: taskListItemTemplate,
  name: 'task-list-item',
  props: {
    task: {
      type: Object,
      require: true,
    },
    isSubtask: {
      default: false,
    },
  },
  data: function()
  {
    return {};
  },
  computed: {
  },
  methods: {
    buble_event: function(ev, val)
    {
      this.$emit(ev, val);
    },
    editTask: function(task) 
    {
      let newTask = {...task};
      //TODO popup a editor
      let callback = ((target, task)=>
      {
        const timeStr = task.deadline_date + ' ' + task.deadline_time;
        const d = new Date(timeStr)
        task.deadline = d.toUTCString()
        task.deadline_local = timeStr;
        target.taskEdited(task);
      }).bind(undefined, this);
      this.$emit('request-edit-task', {task: newTask, on_done: callback}); 
    },
    taskEdited: function(newTask)
    {
      this.$emit('editing-task', {origin: this.task, current: newTask});
    },
    sub_task_edited: function(val)
    {
      let oldTask = val.origin;
      let newTask = val.current;
      let current = {...this.task};
      current.subTasks[this.task.subTasks.indexOf(oldTask)] = newTask;
      this.$emit('editing-task', {origin: this.task, current: current});
    },
  },
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
    alignItems: 'unset',
    justifyContent: 'flex-start',
    flexGrow: 1,
    overflow: 'auto',
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
      default_styles    : {...default_styles},
      currentState      : {},
      dialogClass       : 'dialog',
      tasks             : [],
      original_tasks    : [],
      editingTask       : false,
      config            : config,
      editTarget        : {},
      currentStep       : 0,
      batchCreatingTask : false,
      inProgress        : false,
      inSettingMode     : false,
      editingSearching  : false,
      column_settings   : column_settings,
      statusHint        : '',
    };
  },// end of data
  computed: {
    applied_styles: function() 
    {
      return this.default_styles;
    },
    progress_mode: function ()
    {
      return this.inProgress ? 'indeterminate': 'determinate';
    }
  },// end of computed
  methods: {
    onEdited: function(row, column, args)
    {
      try
      {
        column.update(row, args.current);
      }
      catch(ex)
      {
        let printVar = (x)=>
        {
          for (var key of Object.keys(x))
          {
            console.log(`${key}: ${JSON.stringify(x)}`);
          }
        }
        printVar({row, column, args});
        console.log(ex.message);
      }
    },
    access: function(row, column)
    {
      try
      {
        var accessor = column.accessor;
        if (typeof(accessor) === 'string')
        {
          return row[accessor];
        }
        if (typeof(accessor) === 'function')
        {
          return accessor(row, column);
        }
      }
      catch(ex)
      {
        console.log(column);
        console.log(row);
        return ex.message;
      }
    },

    doSearchAndExport: function(cri)
    {
      const constraints = buildConstraints(cri);
      this.editingSearching = false;
      this.inProgress = true;
      this.statusHint = "搜索中...";
      fetch('http://' + this.config.host + '/api/search', {
        method: 'POST',
        body: j2s(constraints),
        credentials: 'include',
        'content-type': 'applcation/json',
      })
      .then((resp)=>
      {
        if (resp.ok)
        {
          return resp.text();
        }
        this.statusHint = "";
        this.inProgress = false;
        throw new 'can not get search result';
      })
      .then((ids)=>
      {
        return fetch('http://' + this.config.host + '/api/t2x?ids=' + ids, {
          credentials: 'include',
        })
      })
      .then(resp=>
      {
        this.inProgress = false;
        if (resp.ok)
        {
          return resp.blob();
        }
        throw new 'export excel failed';
      })
      .then(blob=>
      {
        FileSaver.saveAs(blob, 'tasks.xlsx', true);
      })
      .catch(ex=>
      {
        this.inProgress = false;
      });
    },
    doSearch: function(cri)
    {
      const constraints = buildConstraints(cri);
      this.editingSearching = false;
      this.inProgress = true;
      this.statusHint = "搜索中...";
      fetch('http://' + this.config.host + '/api/search', {
        method: 'POST',
        body: j2s(constraints),
        credentials: 'include',
        'content-type': 'applcation/json',
      })
      .then((resp)=>
      {
        if (resp.ok)
        {
          return resp.text();
        }
        this.statusHint = "";
        this.inProgress = false;
        throw new 'can not get search result';
      })
      .then(ids=>
      {
        const recursivePromise = (idList, allTasks)=>
        {
          if (idList.length == 0)
          {
            return allTasks;
          }
          const pace = 1;
          const head = idList.slice(0, pace);
          console.log(head.join(','));
          const tail = idList.slice(pace);
          return fetch('http://' + this.config.host + '/api/id2j?ids=' + head.join(','), {
            credentials: 'include',
          })
          .then((resp)=>
          {
            return resp.json();
          })
          .then((tasks)=>
          {
            tasks.forEach(x => {allTasks.push(x);});
            this.statusHint = `获取任务细节, 剩余${tail.length}个任务...`;
            return recursivePromise(tail, allTasks);
          });
        };
        const idList = ids.trim().split(',');
        this.statusHint = `获取任务细节, 剩余${idList.length}个任务...`;;
        this.tasks = [];
        return recursivePromise(idList, this.tasks);
        return fetch('http://' + this.config.host + '/api/id2j?ids=' + ids.trim(), {
          credentials: 'include',
        });
      })
      .then(tasks=>
      {
        this.inProgress = false;
        this.tasks = tasks;
        this.original_tasks == [...tasks];
        this.statusHint = `共计${tasks.length}个任务`;
      })
      .catch(ex => 
      {
        this.statusHint = "";
        this.inProgress = false;
        console.log(ex);
      });
    },
    pop_settings: function()
    {
      this.inSettingMode = true;
    },
    batch_add_task: function() 
    {
      this.batchCreatingTask = true;
    },
    export_excel: function()
    {
      const ids = this.tasks.map(x => x.tid).join(',');
      this.inProgress = true;
      fetch('http://' + this.config.host + '/api/t2x?ids=' + ids, {
        credentials: 'include',
      })
      .then(resp=>
      {
        this.inProgress = false;
        if (resp.ok)
        {
          return resp.blob();
        }
        throw new 'export excel failed';
      })
      .then(blob=>
      {
        FileSaver.saveAs(blob, 'tasks.xlsx', true);
      })
      .catch(ex=>
      {
        this.inProgress = false;
      });

    },
    nextStep: function()
    {
      const rawInput   = this.$refs.batchText.inputValue;
      const tasks      = parseTasks(rawInput);
      this.tasks       = tasks;
      this.currentStep = this.currentStep + 1;
    },
    commitCreation: function()
    {
      this.inProgress = true;
      fetch('http://' + this.config.host + '/api/task-batch-edit-form', {
        method: 'POST',
        body: j2s(this.tasks),
        credentials: 'include',
        'content-type': 'applcation/json',
      })
      .then((resp)=>
      {
        this.inProgress = false;
        if(resp.ok)
        {
          return resp.json();
        }
      })
      .then(()=>{});
      // this.batchCreatingTask = false;
    },
    edit_task: function(payload) {
      let task = payload.task;
      let callback = payload.on_done;
      this.editingTask = true;
      this.editTarget = task;
      this.taskEditedCallback = callback;
    },
    finish_edit_task: function() {
      this.editingTask = false;
      this.taskEditedCallback(this.editTarget);
    },
    update_task: function(val) {
      let curr = [...this.tasks];
      let task = val.origin;
      curr[this.tasks.indexOf(task)] = val.current;
      this.tasks = curr;
      // row.task = task;
    },
    reload_fab_settings: function(ev) 
    {
      this.inSettingMode = false;
      this.inProgress = true;
      fetch('http://' + this.config.host + '/api/credentials', {
        method: 'PUT',
        credentials: 'include',
        body: j2s({
          user: config.user,
          password: config.password,
          api_sec: config.api_sec,
        }),
        'content-type': 'application/json',
      })
      .then(resp => 
      {
        if (resp.ok)
        {
          return fetch('http://' + this.config.host + '/api/users', {
            credentials: 'include',
          });
        }
      })
      .then((resp)=>
      {
        if (resp.ok)
        {
          return resp.json();
        }
      })
      .then((users)=>
      {
        this.config.users = users;
        return fetch('http://' + this.config.host + '/api/projects', {
            credentials: 'include',
          })
      })
      .then((resp)=>
      {
        if (resp.ok)
        {
          return resp.json();
        }
      })
      .then((projects)=>
      {
        this.config.projects = projects;
        return fetch('http://' + this.config.host + '/api/configs', {
            credentials: 'include',
          })
      })
      .then((resp)=>
      {
        if (resp.ok)
        {
          return resp.json();
        }
      })
      .then((configs)=>
      {
        this.config.severity = configs.severity;
        this.config.status   = configs.status;
        this.config.priority = configs.priority;
      })
      .then(()=>
      {
        this.inProgress = false;
      })
      .catch((ex)=>
      {
        this.inProgress = false;
        console.log(ex);
      });
    },
  },// end of methods
  mounted: function ()
  {
    this.btn_setting = this.$refs.btn_setting.$el;
  },
  components: {
    'task-list-item': taskListItem,
    'search-edit-dialog': SearchEditDialog,
    'data-editor': DataEditor,
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
  display: flex;
  flex-direction: column;
}
.dialog-body {
  display: flex;
  flex-direction: column;
}

.editor-dialog {
  max-width: none;
}
</style>
