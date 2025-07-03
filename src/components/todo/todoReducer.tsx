export function todoReducer(tasks, action) {
    switch (action.type) {
        case 'add_task':
            return [...tasks, action.payload];
        case 'delete_task':
            return tasks.filter(task => task.id !== action.payload);
        case 'check_task':
            return tasks.map(task => 
                task.id === action.payload ? {...task, done: !task.done} : task
            );
        default:
            return tasks;
    }
}