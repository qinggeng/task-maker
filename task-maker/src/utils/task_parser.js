let parseTask = (tstr) => {
  let terminals = /^(-+)\s*([^\s].*)$/;
  let match = terminals.exec(tstr);
  let indent = match[1].replace('\t', '  ');
  let task_body = match[2];
  let props = task_body.split(';');
  let title = props[0];
  props = props.slice(1);
  let dict = {};
  for (const prop of props)
  {
    let kv = prop.split(':');
    let k = kv[0].trim();
    let v = kv[1].trim();
    if (k === 'tags')
    {
      v = v.split(',').map(x=>x.trim());
    }
    dict[k] = v;
  }
  return {
    indent,
    task           : title,
    assigned       : '',
    status         : 'Open',
    priority       : 'Needs Triage',
    severity       : '不是bug',
    deadline       : '',
    deadline_local : '',
    deadline_date  : '',
    deadline_time  : '',
    tags           : [],
    riskAssessment : '',
    tid            : '',
    points         : '',
    ...dict,
  };
};

let generateTasks = (tasks, stack, task) =>
{
  let subTasks = [];
  while(tasks.length > 0)
  {
    let cachedTask = tasks[tasks.length - 1];
    
    if (cachedTask.indent.length <= task.indent.length)
    {
      break;
    }
    subTasks.push(cachedTask);
    tasks.pop();
  }
  if (subTasks.length > 0)
  {
    task.subTasks = subTasks;
  }
  tasks.push(task);
  if (stack.length === 0)
  {
    return tasks.reverse();
  }
  return generateTasks(tasks, stack.slice(0, -1), stack[Math.max(0, stack.length - 1)]);
}


let parseTasks = (tstr) => {
  let lines = tstr.split('\n').filter(x=>x.trim().length > 0);
  let stack = [];
  for (const line of lines)
  {
    let task = parseTask(line);
    stack.push(task);
  }
  let tasks = 
    generateTasks(
      [], 
      stack.slice(0, -1), 
      stack[Math.max(0, stack.length - 1)]);
  return tasks;
};

/*
const test_str = `
- [单应用运维脚本]BI数据平台运维脚本; assigned: 范雪越; priority: High; tags: DOGFOOD, 运营数据分析和采集
`.trim();
console.log(JSON.stringify(parseTasks(test_str)));
*/

export {
  parseTasks,
}
