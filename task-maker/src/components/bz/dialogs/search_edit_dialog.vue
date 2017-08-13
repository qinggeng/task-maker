<template>
  <mu-dialog 
    :open       = 'opening'
    title       = '搜索任务'
    data-name   = 'search-edit-dialog'
    dialogClass = 'search-edit-dialog-class'
    bodyClass   = 'search-edit-dialog-body-class'
    @close      = 'closeHandler'
  >
    <criteria-editor/>
  </mu-dialog>
</template>

<script>
"use strict";
import CriteriaEditor from '@/components/bz/controls/criteria-editor'
export default {
  components: {
    'criteria-editor': CriteriaEditor,
  },
  props:{
    opening: {
      required : true,
      default  : true,
    },
  },// end of props
  data: function() 
  {
    return {};
  },// end of data
  methods: {
    closeHandler: function ()
    {
      this.$emit('request-close', {});
    },
  },// end of methods
  computed: {
  },// end of computed
  mounted: function() 
  {
  },
};// end of SearchEditDialog
</script>

<style>
/**
 * 这里的内容需要同一放到一个文件里
 */
.search-edit-dialog-class {
  width: 90vw;
  height: 90vh;
  max-width: none;
  display: flex;
  flex-direction: column;
}
.search-edit-dialog-body-class {
  display: flex;
  flex-direction: column;
}
</style>
