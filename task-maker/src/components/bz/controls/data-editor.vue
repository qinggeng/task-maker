<template>
  <component 
    :is           = 'current_view'
    :display_data = 'formatVal(raw_data, data_traits)'
    @request-edit = 'onRequestEdit'
    @edited       = 'onEdited'
    :raw_data     = 'raw_data'
    :data_traits  = 'data_traits'
  />
</template>

<script>
'use strict';
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

export default {
  props: {
    'raw_data'     : {},
    'initial_view' : {
      type: String,
      default: ()=>'raw',
    },
    'data_traits'  : {},
  }, // end of props

  data: function()
  {
    return {
      current_view: 'raw',
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
        this.current_view = this.data_traits.edit_type;
      }
    },
    onEdited: function(args) {
      this.$emit('edited', {current: args, orig: this.raw_data});
      var val = args;
      // this.raw_data = val;
      this.display_data = this.formatVal(val, this.data_traits);
      this.current_view = 'raw';
    },
  },// end of methods
  components: {
    raw: {
      props: ['display_data'],
      template: `<span @click='clicked'>{{display_data}}</span>`,
      methods: {
        clicked: function(ev) {
          this.$emit('request-edit');
        }
      },
    },
    highlighted: {
      props: ['display_data'],
      template: `<span style='color: #FF0000'>{{display_data}}</span>`,
    },
    textEdit: {
      props: ['display_data'],
      mounted: function(el) {
        this.$el.focus();
        this.$el.select();
      },
      methods: {
        onBlur: function(ev) {
          this.$emit('edited', this.$el.value);
        },
      },
      template: `<input type = "text" :value='display_data' @blur='onBlur'/>`,
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
            var dt = strptime(this.$el.value, '%Y-%m-%d %H').toUTCString();
            this.$emit('edited', dt);
          }
          catch(ex)
          {
            this.$el.style.borderStyle='solid';
            this.$el.style.borderColor='#FF0000';
            this.$el.style.backgroundColor='#FFE0E0';
            this.$el.focus();
          }
        },
      },
      template: `<input type = "text" :value='display_data' @blur='onBlur'/>`,
    },
  }, // end fo components

  created: function()
  {
  },
}

</script>
<style scoped>
</style>