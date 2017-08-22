"use strict"
import store from '@/store';

const field_criteria_defines = (() => {

  const theStore = store;
  const predicts = {
    get contains() 
    {
      return {
        'key': 'contains',
        'display': '包含',
      }; 
    },
    get higher_than()
    {
      return {
        'key': 'higher_than',
        'display': '高于',
      }; 
    },
    get lower_than()
    {
      return {
        key: 'lower_than',
        display: '低于',
      };
    },
    get belongs_to()
    {
      return {
        key: 'belongs_to',
        display: '属于',
      };
    },
    get not_later_than()
    {
      return {
        key: 'not_later_than',
        display: '不晚于',
      };
    },
    get not_earlier_than()
    {
      return {
        key: 'not_earlier_than',
        display: '不早于',
      };
    },
  };

  let field_definition_full_text = (()=>
  {
    let field_editors = {};
    field_editors[predicts.contains.key] = 
    {
      data_traits: {
        edit_type : 'textEdit',
        editable  : true,
        update    : function(val){},
      },
      apply_value: function(val) {
        if (typeof val !== 'String')
        {
          return '';
        }
        return val;
      },
    };
    return {
      name: 'title', 
      display: '全文', 
      available_predicts: [
        predicts.contains,
        // predicts.notContains,
        // predicts.startsWith,
        // predicts.endsWith,
        // predicts.regex,
      ],
      field_editors: field_editors,
    };
  })();

  let field_definition_priority = (()=>
  {
    const store = theStore;
    let field_editors = {};
    field_editors[predicts.belongs_to.key] =
    {
      data_traits:
      {
        edit_type: 'multiple_choice',
        editable: true,
        update   : function(val){},
        get choices() 
        {
          return store.state.config.priority;
        },
      },
      apply_value: function(val) 
      {
        if (typeof val != 'Array')
        {
          val = Number(val);
          if (isNaN(val))
          {
            return [];
          }
          return [val];
        }
        return val;
      },
    };
    field_editors[predicts.higher_than.key] =
    {
      data_traits:
      {
        edit_type: 'choice',
        editable: true,
        update   : function(val){},
        get choices() 
        {
          return store.state.config.priority;
        },
      },
      apply_value: function(val) {
        if (typeof val == 'Array')
        {
          val = Number(val[0]);
        }
        var filtered = this.data_traits.choices.filter(x=> x.val === val);
        if (filtered.length == 0)
        {
          return this.data_traits.choices[0].val;
        }
        return val;
      },
    };
    field_editors[predicts.lower_than.key] =
    {
      data_traits:
      {
        edit_type: 'choice',
        editable: true,
        update   : function(val){},
        get choices() 
        {
          return store.state.config.priority;
        },
      },
      apply_value: function(val) {
        if (typeof val == 'Array')
        {
          val = Number(val[0]);
        }
        var filtered = this.data_traits.choices.filter(x=> x.val === val);
        if (filtered.length == 0)
        {
          return this.data_traits.choices[0].val;
        }
        return val;
      },
    };

    return {
      name      : 'priority',
      display   : '优先级',
      available_predicts: [
        predicts.higher_than,
        predicts.belongs_to,
        // predicts.lower_than,
        // predicts.equals,
        // predicts.higherOrEqual,
        // predicts.lowerOrEqual,
        // predicts.notContains,
        // predicts.startsWith,
        // predicts.endsWith,
        // predicts.regex,
      ],
      field_editors: field_editors,
    };
  })();

  let field_definition_project = (()=>
  {
    let field_editors = {};
    field_editors[predicts.belongs_to.key] =
    {
      data_traits: 
      {
        edit_type: 'multiple_choice',
        editable: true,
        update: function (val) {},
        get choices ()
        {
          return store.state.config.projects.map(x=> ({val: x.name, display: x.name}));
        },
      },
      apply_value: function(val)
      {
        if (typeof val != Array)
        {
          return store.state.config.projects.map(x=> (x.name)).slice(0, 3);
        }
        return val;
      },
    };
    return {
      name: 'project',
      display: '项目',
      available_predicts: [
        predicts.belongs_to,
      ],
      field_editors: field_editors,
    };
  })();
  let field_definition_author = (()=>{
    let field_editors = {};
    field_editors[predicts.belongs_to.key] =
    {
      data_traits: 
      {
        edit_type: 'multiple_choice',
        editable: true,
        update: function (val) {},
        get choices ()
        {
          return store.state.config.users.map(x=> ({val: x.phid, display: x.realName}));
        },
      },
      apply_value: function(val)
      {
        if (typeof val != Array)
        {
          return store.state.config.users.map(x=> (x.phid)).slice(0, 3);
        }
        return val;
      },
    };
    return {
      name: 'author',
      display: '作者',
      available_predicts: [
        predicts.belongs_to,
      ],
      field_editors: field_editors,
    };
  })();

  let field_definition_assigned = (()=>{
    let field_editors = {};
    field_editors[predicts.belongs_to.key] =
    {
      data_traits: 
      {
        edit_type: 'multiple_choice',
        editable: true,
        update: function (val) {},
        get choices ()
        {
          return store.state.config.users.map(x=> ({val: x.phid, display: x.realName}));
        },
      },
      apply_value: function(val)
      {
        if (typeof val != Array)
        {
          return store.state.config.users.map(x=> (x.phid)).slice(0, 3);
        }
        return val;
      },
    };
    return {
      name: 'assigned',
      display: '负责人',
      available_predicts: [
        predicts.belongs_to,
      ],
      field_editors: field_editors,
    };
  })();

  let field_definition_status = (()=>{
    let field_editors = {};
    field_editors[predicts.belongs_to.key] =
    {
      data_traits: 
      {
        edit_type: 'multiple_choice',
        editable: true,
        update: function (val) {},
        get choices ()
        {
          return store.state.config.status;
        },
      },
      apply_value: function(val)
      {
        if (typeof val != Array)
        {
          return store.state.config.status.slice(0, 3).map(x=> x.val);
        }
        return val;
      },
    };
    return {
      name: 'status',
      display: '状态',
      available_predicts: [
        predicts.belongs_to,
      ],
      field_editors: field_editors,
    };
  })();

  let field_definition_modified = (()=>
  {
    let field_editors = {};
    field_editors[predicts.not_later_than.key] = {
      data_traits: {
        edit_type: 'datetime',
        editable: true,
      },
      apply_value: function(val)
      {
        return '';
      }
    };
    field_editors[predicts.not_earlier_than.key] = {
      data_traits: {
        edit_type: 'datetime',
        editable: true,
      },
      apply_value: function(val)
      {
        return '';
      }
    };
    return {
      name: 'modified',
      display: '最后编辑时间',
      available_predicts: [
        predicts.not_later_than,
        predicts.not_earlier_than,
      ],
      field_editors,
    };
  })();

  let field_definition_created = (()=>
  {
    let field_editors = {};
    field_editors[predicts.not_later_than.key] = {
      data_traits: {
        edit_type: 'datetime',
        editable: true,
      },
      apply_value: function(val)
      {
        return '';
      }
    };
    field_editors[predicts.not_earlier_than.key] = {
      data_traits: {
        edit_type: 'datetime',
        editable: true,
      },
      apply_value: function(val)
      {
        return '';
      }
    };
    return {
      name: 'created',
      display: '创建时间',
      available_predicts: [
        predicts.not_later_than,
        predicts.not_earlier_than,
      ],
      field_editors,
    };
  })();

  const criteriaDefines = {
    predicts: predicts,
    fields: [
      field_definition_full_text,
      field_definition_priority,
      field_definition_project,
      field_definition_author,
      field_definition_assigned,
      field_definition_status,
      field_definition_modified,
      field_definition_created,
    ],
  };

  const fieldTraits = {
    edit_type: 'choice',
    editable: true,
    choices: criteriaDefines.fields.map(x => {return {val: x.name, display: x.display};}),
  };

  return {predicts, criteriaDefines, fieldTraits};
})();

export default {...field_criteria_defines}
