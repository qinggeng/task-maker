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
    />
    <!--
    <search_criteria 
      v-for='criteria in criterias' 
      :applied_styles='applied_styles.criteria' 
      :criteria='criteria' 
      @criteria-changed='((c, v)=>{updateCriteria(c, v)}).bind(undefined, criteria)'
      @request-remove-criteria='removeCriteria'/>
    -->
  </div>
</template>

<script>
"use strict";

import defines       from '@/consts/bz/criteria_defines.js'
import CriteriaField from '@/components/bz/controls/criteria-field'
const criteriaDefines = defines.criteriaDefines;

const default_styles = {
  container: {
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
      current_field_trait: 0,
      criterias: [],
    };
  },
	methods: {
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

		makeOperatorTraits: function (val)
		{
			return {
				edit_type: 'choice',
        editable: true,
				choices: val.map(x=>{return {val: x.key, display: x.display};}),
			};
		},


		onCriteriaChanged: function (val)
    {
      if (val.current == val.origin)
      {
        return;
      }
			const criteria = extend(this.criteria);
			//TODO send change message
			criteria.operand = val.current; 
      let payload = {
        current: criteria,
        origin: this.criteria,
      };
      this.criteria = criteria;
      this.$emit('criteria-changed', payload);
		},

		requestRemoveCriteria: function (ev) 
    {
			this.$emit('request-remove-criteria', this.criteria);
		},

    onNewCriteria: function() 
    {
      let newCriterias = [...this.criterias];
      newCriterias.splice(0, 0, {operator: 'contains', operand:'XXX', operate_on: 'title'});
      this.criterias = newCriterias;
      
    },
	},// end of methods

	computed: {
		current_field: {
			cache: false,
			get() {
				return this.field_map[this.criteria.operate_on];
			},
		},
		current_predict: {
			cache: false,
			get() {
				return this.field_map[this.criteria.operate_on].available_predicts.filter(x => x.key == this.criteria.operator)[0];
			},
		},
		operator_traits: {
			cache: false,
			get() {
				let predict = this.field_map[this.criteria.operate_on].available_predicts;
				return this.makeOperatorTraits(predict);
			},
		},
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
