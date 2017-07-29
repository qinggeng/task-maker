import Vue        from 'vue'
import Router     from 'vue-router'
import Hello      from '@/components/Hello'
import TaskEditor from '@/components/bz/task-editor'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path      : '/',
      name      : 'TaskEditor',
      component : TaskEditor,
      /* name: 'Hello', */
      /* component: Hello */
    }
  ]
})
