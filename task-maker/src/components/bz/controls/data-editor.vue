<template>
  <component 
    :is           = 'current_view'
    :display_data = 'formatVal(raw_data, data_traits)'
    @request-edit = 'onRequestEdit'
    @edited       = 'onEdited'
    :raw_data     = 'raw_data'
    :data_traits  = 'data_traits'
    :user_defined_editors = 'user_defined_editors'
  />
</template>

<script>
'use strict';
import utils from '@/utils';
var typedAccessors = {
  choice: (val, traits)=> {
    var choices = traits.choices;
    for (var c of choices)
    {
      if (c.val == val)
      {
        return c.display;
      }
    }
    return val;
  },

  textEdit: (val, traits)=>{return val},

  multiple_choice: (val, traits)=> {
    var choices = traits.choices.reduce((x, y)=>{x[y.val]=y.display; return x}, {});
    return val.map(x=> choices[x]).join(', ');
  },

  datetime: (val, traits) =>{
    if(val === 'TBD')
    {
      return 'TBD';
    }
    var d = new Date(val);
    const padding = (s, l, c)=>
    {
      var paddingLength = Math.max(0, l - s.length);
      for (var i = 0; i < paddingLength; i++)
      {
      s = c + s;
      }
      return s;
    };
    var str = d.toUTCString();
    var year = String(d.getFullYear());
    var mon = String(d.getMonth() + 1);
    var day = String(d.getDate());
    var h = String(d.getHours());
    var mm = String(d.getMinutes());
    var date = year + '-' + padding(mon, 2, '0') + '-' + padding(day, 2, '0');
    var time = padding(h, 2, '0') + ':' + padding(mm, 2, '0');
    return date + ' ' + time;
  },
};

const editors = {
  raw: {
    props: ['display_data'],
    template: `
      <span 
        @click = 'clicked'
        style  = '
          min-width: 20px; 
          min-height: 16px;
        '
      >
        {{resolved_display_data}}
      </span>
    `,
    methods: {
      clicked: function(ev) {
        this.$emit('request-edit');
      }
    },
    computed: {
      resolved_display_data: {
        get()
        {
          if (undefined === this.display_data)
          {
            return '';
          }
          if (typeof this.display_data !== 'string')
          {
            return String(this.display_data);
          }
          if (this.display_data.length === 0)
          {
            return '';
          }
          return this.display_data;
        },
      },
    },
  },
  highlighted: {
    props: ['display_data'],
    template: `<span style='color: #FF0000'>{{display_data}}</span>`,
  },
  textEdit: {
    props: ['display_data'],
    mounted: function(el) {
      this.value = this.display_data;
      this.$el.focus();
      const e = new XPathEvaluator();
      const expr = e.createExpression('.//input');
      try
      {
        const input = expr.evaluate(this.$el).iterateNext();
        input.select();
      }
      catch(ex)
      {
      }
      // this.$el.select();
    },
    data: function()
    {
      return {
        value: '',
      };
    },
    methods: {
      onBlur: function(ev) {
        // this.$emit('edited', this.$el.value);
        this.$emit('edited', this.value);
      },
    },
    template: `
      <mu-text-field v-model='value' @blur = 'onBlur'/>
      <!--
      <input type = "text" :value='display_data' @blur='onBlur'/>
      -->
    `,
  },
  choice: {
    props: ['display_data', 'raw_data', 'data_traits'],
    mounted: function(el) {
      this.$el.focus();
    },
    created: function()
    {
      this.selection = this.raw_data;
    },
    data: function()
    {
      return {
        selection: '',
      };
    },
    methods: {
      onChange: function(val) {
        this.$emit('edited', val);
      },
      onClose: function(val) {
        this.$emit('edited', this.selection);
      },
    },
    template: `
      <mu-select-field 
        :value  = 'raw_data'
        @close  = 'onClose'
        @change = 'onChange'
      >
        <mu-menu-item 
          v-for = 'opt of data_traits.choices'
          :value = 'opt.val'
          :title = 'opt.display'
          :key = 'opt.val'
        />
      </mu-select-field>
      `,
  },
  multiple_choice: {
    props: ['display_data', 'raw_data', 'data_traits'],
    mounted: function(el) {
      this.$el.focus();
    },
    created: function() {
      this.the_selection = [...this.raw_data];
    },
    data: function () 
    {
      return {
        the_selection: [],
      };
    },
    methods: {
      onClose: function(val) {
        this.$emit('edited', this.the_selection);
      }
    },
    template: `
      <mu-select-field 
        v-model = 'the_selection'
        @close = 'onClose'
        multiple
      >
        <mu-menu-item 
          v-for   = 'opt of data_traits.choices'
          :value  = 'opt.val'
          :title  = 'opt.display'
          :key    = 'opt.val'
        />
      </mu-select-field>
      <!--
      <select @blur='onBlur' multiple='multiple'>
      <option v-for = 'opt of data_traits.choices' :value='opt.val' :selected='raw_data.indexOf(opt.val) != -1'>{{opt.display}}</oitpion>
      </select>
      -->
      `,
  },
  datetime: {
    props: ['display_data', 'data_traits'],
    mounted: function(el) {
      this.$el.focus();
      this.$el.select();
    },
    methods: {
      onBlur: function(ev) {
        try
        {
          let rawInput = this.$el.value.trim();
          if (rawInput === '' || rawInput === this.data_traits.default_value)
          {
            this.$emit('edited', this.data_traits.default_value);
            return;
          }
          var dt = utils.strptime(this.$el.value, '%Y-%m-%d %H').toUTCString();
          this.$emit('edited', dt);
        }
        catch(ex)
        {
          this.$el.style.borderStyle='solid';
          this.$el.style.borderColor='#FF0000';
          this.$el.style.backgroundColor='#FFE0E0';
          this.$el.focus();
          console.log(ex);
        }
      },
    },
    template: `<input type = "text" :value='display_data' @blur='onBlur'/>`,
  },
};

export default {
  props: {
    'raw_data'     : {},
    'data_traits'  : {},
    user_defined_editors: {
    },
  }, // end of props

  data: function()
  {
    return {
      current_view: {},
    };
  }, // end of data

  methods: {
    formatVal(val, traits)
    {
      try
      {
        return typedAccessors[traits.edit_type](val, traits);
      }
      catch(ex)
      {
        console.log(traits.edit_type);
      }
      return val;
    },
    onRequestEdit: function(ev, args) {
      if (undefined != this.data_traits.editable 
          && this.data_traits.editable === true)
      {
        // this.current_view = this.data_traits.edit_type;
        this.current_view = this.applied_editors[this.data_traits.edit_type];
      }
    },
    onEdited: function(args) {
      this.$emit('edited', {current: args, orig: this.raw_data});
      var val = args;
      // this.raw_data = val;
      this.display_data = this.formatVal(val, this.data_traits);
      // this.current_view = 'raw';
      this.current_view = this.applied_editors['raw'];
    },
  },// end of methods
  components: {
  }, // end fo components

  computed: {
    applied_editors: {
      get () 
      {
        return {
          ...editors,
          ...this.user_defined_editors,
        };
      },
    },  
  },// end of computed

  created: function()
  {
    this.current_view = this.applied_editors['raw'];
  },
}

</script>
<style scoped>
</style>
