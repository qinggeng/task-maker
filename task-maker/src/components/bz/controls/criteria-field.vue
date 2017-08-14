<template>
  <mu-chip
    showDelete
    class = 'criteria-field'
  >
    <data-editor
      :raw_data='criteria.operate_on'
      :data_traits='fieldTraits'
      @edited='onFieldChosen'
    />
    <data-editor
      :raw_data='criteria.operator' 
      :data_traits='operatorTraits'
      @edited='onPredictChoosen'
      :current_view='"raw"'/>
    <data-editor 
      :raw_data='criteria.operand' 
      :data_traits='current_field_trait || current_field.field_editors[criteria.operator].data_traits' 
      :current_view='"raw"' 
      @edited='onCriteriaChanged'
    />
  </mu-chip>
</template>

<script>

'use strict';

import DataEditor      from '@/components/bz/controls/data-editor'
import CriteriaDefines from '@/consts/bz/criteria_defines.js'

const fieldTraits     = CriteriaDefines.fieldTraits;
const criteriaDefines = CriteriaDefines.criteriaDefines;

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
		definitions: {
			type: Object,
			default: ()=>criteriaDefines,
		},
  },//end of prpos
  data       : function()
  {
    return {
      fieldTraits: fieldTraits,
      current_field_trait: 0,
    };
  },//end of data
  computed   : {
    applied_styles: {
      get() 
      {
        return {...default_styles};
      }
    },
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
		operatorTraits: {
			get() {
				let predict = this.field_map[this.criteria.operate_on].available_predicts;
				return this.makeOperatorTraits(predict);
			},
		},
  },//end of computed
  methods    : {
		onFieldChosen: function(val) {
      if (val.current == val.origin)
      {
        return;
      }
			const criteria = {...this.criteria};
			//TODO send change message
			criteria.operate_on = val.current;
			let fieldDefine = this.field_map[val.current];
			let available_predicts = fieldDefine.available_predicts;
			let predict = available_predicts[0];
			if (undefined === predict)
			{
				criteria.operator = '';
				return;
			}
			criteria.operator = predict.key;
      if (undefined !== fieldDefine.field_editors)
      {
        criteria.operand = 
          fieldDefine.field_editors[predict.key].apply_value(criteria.operand);
      }
      else
      {
        criteria.operand = fieldDefine.applyValue(criteria.operand);
      }
      this.$emit('operated-field-changed', criteria);
		},

		onPredictChoosen: function(val) 
    {
			this.criteria.operator = val.current;
			let fieldDefine = this.current_field;
      if (undefined !== fieldDefine.field_editors)
      {
        this.current_field_trait = fieldDefine.field_editors[val.current].data_traits;
        this.criteria.operand = 
          fieldDefine.field_editors[val.current].apply_value(this.criteria.operand);
      }
		},

		onCriteriaChanged: function (val)
    {
      if (val.current == val.origin)
      {
        return;
      }
			const criteria = {...this.criteria};
			criteria.operand = val.current; 
      let payload = {
        current: criteria,
        origin: this.criteria,
      };
      this.criteria = criteria;
      this.$emit('criteria-changed', payload);
		},

		makeOperatorTraits: function (val)
		{
			return {
				edit_type: 'choice',
        editable: true,
				choices: val.map(x=>{return {val: x.key, display: x.display};}),
			};
		},

  },//end of methods

  components : {
    'data-editor': DataEditor,
  },//end of components

  mounted: function()
  {
  },

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

<style>
.criteria-field {
  margin-left: 4px;
}
</style>
