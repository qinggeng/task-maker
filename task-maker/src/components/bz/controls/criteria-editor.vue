<template>
  <div :style='applied_styles.container'>
    <mu-raised-button 
      secondary
      icon = 'add'
      @click = 'onNewCriteria'
    />
    <criteria-field
      v-for = 'criteria in criterias' 
      :criteria='criteria' 
      @operated-field-changed='(v)=>{operateOnChanged(criteria, v);}'
      :key = 'criterias.indexOf(criteria)'
      @delete-criteria='((idx, v)=>{deleteCriteria(idx, v);}).bind(undefined, criterias.indexOf(criteria))'
    />
  </div>
</template>

<script>
"use strict";

import defines       from '@/consts/bz/criteria_defines.js'
import CriteriaField from '@/components/bz/controls/criteria-field'
const criteriaDefines = defines.criteriaDefines;

const default_styles = {
  container: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
};

export default {
	props: {
		styles: {
			type: Object,
		},
		criteria: {
			type: Object,
		},
		definitions: {
			type: Object,
			default: ()=>criteriaDefines,
		},
	},
	components: {
    'criteria-field': CriteriaField,
	},
	filters: {
	},
  data: function() 
  {
    return {
      criterias: [
        {operator: 'belongs_to', operate_on: 'status', operand: ['open', 'start']},
        {operator: 'higher_than', operate_on: 'priority', operand: '90'},
        // {operator: '', operate_on: '', operand: },
      ],
    };
  },
	methods: {
    deleteCriteria: function(idx, cri)
    {
      console.log(idx);
      console.log(cri);
      this.criterias = this.criterias.filter(x=> x !== this.criterias[idx])
    },
    operateOnChanged: function(cri, val)
    {
      cri.operate_on = val.operate_on;
      cri.operator   = val.operator;
      cri.operand    = val.operand;
    },
		fieldDisplay: function (val) 
		{
			try
			{
				return this.field_map[val].display;
			}
			catch(ex)
			{
				console.log(ex);return '未知字段: '+ val;
			}
		},

		operatorDisplay: function (val) 
		{
			try
			{
				return this.definitions.predicts[val].display;
			}
			catch(ex)
			{
				return '不支持的操作符';
			}
		},


		requestRemoveCriteria: function (ev) 
    {
			this.$emit('request-remove-criteria', this.criteria);
		},

    onNewCriteria: function() 
    {
      let newCriterias = [...this.criterias];
      newCriterias.splice(0, 0, {operator: 'higher_than', operand:90, operate_on: 'priority'});
      this.criterias = newCriterias;
      
    },
	},// end of methods

	computed: {
    applied_styles: {
      get() {
        return {...default_styles};
      },
    },
	}, // end of computed

	created: function() {
		const fields = this.definitions.fields;
		this.field_map = {};
		for (const f of fields)
		{
			this.field_map[f.name] = f;
		}
	},
}
</script>

<style scoped>
</style>
