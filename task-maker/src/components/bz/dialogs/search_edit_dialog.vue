<template>
  <mu-dialog 
    scrollable
    :open       = 'opening'
    title       = '搜索任务'
    data-name   = 'search-edit-dialog'
    dialogClass = 'search-edit-dialog-class'
    bodyClass   = 'search-edit-dialog-body-class'
    @close      = 'closeHandler'
  >
   <div style="height: 20px"/>
   <div>
    <mu-float-button
      mini
      disabled
      icon = 'folder_open'
    />
    <mu-float-button
      mini
      disabled
      icon = 'save'
    />
    <mu-float-button
      mini
      disabled
      icon = 'undo'
    />
    <mu-float-button
      mini
      disabled
      icon = 'redo'
    />
   </div>
   <div style="height: 20px"/>
   <div>
    <criteria-editor 
      ref="editor"
    />
   </div>
   <mu-raised-button 
     primary 
     label="搜索" 
     slot="actions"
     @click="doSearch"
   />
   <mu-raised-button 
     primary 
     label="搜索并导出" 
     slot="actions"
     @click="doSearchAndSave"
   />
  </mu-dialog>
</template>

<script>
"use strict";
import CriteriaEditor from '@/components/bz/controls/criteria-editor';
import utils from '@/utils';
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
    doSearch: function()
    {
      this.$emit('request-search', this.$refs.editor.criterias);
    },
    doSearchAndSave: function()
    {
      this.$emit('request-search-and-save', this.$refs.editor.criterias);
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
  flex-grow: 1;
  justify-contents: flex-start;
  flex-direction: column;
}
</style>
