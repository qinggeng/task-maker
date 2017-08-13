<template>
  <mu-chip
    showDelete
    class = 'criteria-field'
  >
    <div :style='applied_styles.field'>
      {{this.criteria.operate_on}}
    </div>
    <div :style='applied_styles.predict'>
      {{this.criteria.operator}}
    </div>
    <div :style='applied_styles.param'>
      {{this.criteria.operand}}
    </div>
  </mu-chip>
</template>

<script>
const default_styles = {
  frame: {
    marginLeft: '12px',
  },
  field: {
    marginLeft: '4px',
  },
  predict: {
    marginLeft: '4px',
  },
  param: {
    marginLeft: '4px',
  },
};
export default {
  props      : {
    criteria: {
    },
  },//end of prpos
  data       : function()
  {
    return {};
  },//end of data
  computed   : {
    applied_styles: {
      get() 
      {
        return {...default_styles};
      }
    },
  },//end of computed
  methods    : {
  },//end of methods
  components : {
  },//end of components
  mounted: function()
  {
    console.log(this.criteria);
  },
}
</script>

<style>
.criteria-field {
  margin-left: 4px;
}
</style>
