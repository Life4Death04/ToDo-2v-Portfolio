import './todo.css'
import { FaRegTrashAlt } from "react-icons/fa"; //Icons import 
import { FiSun } from "react-icons/fi";
import { FiMoon } from "react-icons/fi";

import {useState, useEffect, useReducer} from 'react';

type TaskItemProps = {
    id: number;
    description: string;
    done: boolean;
    onCheck: () => void; //Function to check the task
    onDelete: () => void; //Function to delete the task
}

/**
 * @description TaskItem component represents a single task in the to-do list.
 * @param id{string} - The unique identifier for the task
 * @param description{string} - The description of the task
 * @param done{boolean} - Indicates whether the task is completed or not
 * @param onCheck{function} - Function to handle the task check action
 * @param onDelete{function} - Function to handle the task delete action
 */
function TaskItem({id, description, done, onCheck, onDelete}: TaskItemProps){ //Change Task for TaskItem
    return(
        <li key={id} className='task-container'>
            <span className={done ? 'checkTask-btn-active' : 'checkTask-btn-false'} onClick={onCheck}></span>
            <p className={done ? 'descriptionTask-active' : 'descriptionTask-false'}>{description}</p>
            <button onClick={onDelete} className="deleteTask-btn">
                <FaRegTrashAlt size={20}/>
            </button>
        </li>
    );
}

type ModalMessageProps = {    
    isOpen: boolean; //Prop to know if the modal is open or not
    onClose: () => void; //Prop to close the modal
}

/**
 * @description Component displays a modal message when the user tries to add an empty task.
 * @param isOpen {boolean} - Indicates whether the modal is open or not
 * @param onClose {function} - Function to close the modal
 */
function ModalMessage({isOpen, onClose}:ModalMessageProps){
    if (!isOpen) return null; //It is a common React pattern used to conditionally render the component. It means: "If the modal is not supposed to be open, don't render anything."

    return(
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalContent">
                <p>You can't add empty tasks. Please type a task to add.</p>
            </div>
        </div>
    );
}

type currentFilterStatus = 'active' | 'all' | 'completed';

type FilterButtonsProps = {
    currentFilter: currentFilterStatus; //Prop to know which filter is active
    itemsLeft: number; //Prop to show how many active tasks there are
    onClear: () => void; //Prop (function) to clear those completed tasks
    onChange: (filter: currentFilterStatus) => void; //Prop (function) to change the value because when we click on the buttons onChange becomes setFilter
}

/**
 * @description This component allows the user to filter tasks based on their status and clear completed tasks
 * @param currentFilter {currentFilterStatus} - The current filter status (active, all, completed)
 * @param itemsLeft {number} - The number of active tasks left
 */
function FilterButtons({
    currentFilter,
    itemsLeft, //Prop to show how many actives task there are
    onClear, //Prop (function) to clear those completed tasks
    onChange //Prop (function) to change the value because when we click on the buttons onChange becomes setFilter
    }: FilterButtonsProps){  

    const isActive = (filter:currentFilterStatus) => `filterButtons ${currentFilter === filter ? 'active' : ''}`;

    return(
        <section className="filterButtons-section">
            <span>{itemsLeft} {itemsLeft > 1 ? 'items' : 'item'} left</span>
                <div className="filterButtons-container">
                    <button className={isActive('active')} onClick={() => 
                        //Since we are passing setFilter function to onChange, onChange works as a setFilter
                        onChange('active')}>Active</button>
                    <button className={isActive('all')}  onClick={() => onChange('all')}>All</button>
                    <button className={isActive('completed')}  onClick={() => onChange('completed')}>Completed</button>
                </div>
            <button className='filterButtons clearTask' onClick={onClear}>Clear Completed</button>
        </section>
    );
}

/**
 * @description ToDo component is the main component that manages the state of the to-do list, including adding, checking, deleting tasks, and filtering them.
 */
interface InitialTaskType {
    todos: [...{id: number; description: string; done: boolean}]; //Array of tasks
    nextId: number;
    filterValue: string;
}

const initialTask: InitialTaskType = {
    todos: [
        {id: -1, description: 'Implementar TypeScript', done: true},
        {id: -2, description: 'Implementar JSDoc (manera de documentar)', done: true},
        {id: -3, description: 'Crear funcion para abstraer el setFilter (manejar filtrado)', done: true}
    ],
    nextId: 0,
    filterValue: 'all',
}

export default function ToDo(){
    //State for the list of tasks
    /* const [taskState, setTaskState] = useState<InitialTaskType[]>(initialTask); //Initial tasks for the to-do list */

    const [taskReducerState, dispatch] = useReducer(todoReducer, initialTask); //Using useReducer to manage tasks

    const [inputTaskValue, setInputTaskValue] = useState<string>(''); //State for the input value of the ToDo
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); //Code for the modal operations
    const [darkMode, setDarkMode] = useState<boolean>(false) //State for dark mode toggle
    
    let pendingTasks:number = taskReducerState.todos.filter(t => !t.done).length; // Count how many tasks are not done

    useEffect(() => {
        document.body.className = darkMode ? 'dark' : ''; //Change the body class to dark or light mode
    }, [darkMode]); //This effect will run whenever darkMode changes

    //State for filterable buttons
    let filterList = taskReducerState.todos.filter(t => {
        if(taskReducerState.filterValue === 'active') return !t.done;
        if(taskReducerState.filterValue === 'completed') return t.done;
        return true;
    })

    /*I just lift up the code to let the father component to manage all the functions. Because I think is dumb
    let the child having those 3 functions by themselves, besides If I create 1000 task, then will be like 3000
    of functions and no.*/
    function addTask(): void{
        if(inputTaskValue !== ''){  
            dispatch({
                type: 'add_task',
                description: inputTaskValue,
            })
            setInputTaskValue('');
        }else{
            setIsModalOpen(true);
        }
    }

    function checkTask(taskId: number): void{
        /*For this function, we don't have to return or copy all the element in the array, why?
        Because, .map already make an array with all the elements and same length so, we can modify
        the element that we want implementing 'taskId === t.id' in that way when we reach that 
        element, we will modify it (remembering that we have to copy their old props). Otherwise,
        we'll just return the elements that doesn't match with the condition.*/
        dispatch({type: 'check_task', taskId: taskId}); //Using useReducer to check the task
    }
    
    function deleteTask(taskId: number): void{
       dispatch({type: 'delete_task', taskId: taskId}); //Using useReducer to delete the task
    }

    function clearTasksCompleted(): void{
        dispatch({type: 'clear_completed'}); //Using useReducer to clear completed tasks
    }

    function handleFilterChange(text: currentFilterStatus): void{
        /* setFilter(text); */
        dispatch({type: 'set_filter', filter: text}); //Using useReducer to set the filter
    }
    return(
        <div>
            <div className="todo-container">
                <header>  
                    <span className='icon'>To-Do List</span>
                    <button className='toggleTheme-btn' onClick={() => setDarkMode(mode => !mode)}>
                        {darkMode ? <FiMoon size={25}/> : <FiSun size={25} />}
                    </button>
                </header>
                <div className="input-task-container">
                    <input type="text" name="" id="input-task" placeholder="Add your task" value={inputTaskValue} onChange={(e) => {
                        setInputTaskValue(e.target.value);
                    }}/>
                    <button id="addTask-btn" onClick={addTask}>Add</button>
                </div>
                <ul className="todo-tasks-content">
                    {filterList.map((t) => {
                        return(
                            <TaskItem {...t} onCheck={() => {checkTask(t.id)}} onDelete={() => {deleteTask(t.id)}}></TaskItem> //Using key prop to avoid React warning  
                        )
                    })}
                </ul>
                <FilterButtons 
                    currentFilter={taskReducerState.filterValue} //Passing prop (variable) of the current filter
                    itemsLeft={pendingTasks} //Passing prop (variable) of how many items
                    onClear={clearTasksCompleted} //Passing prop (function) to clear items
                    onChange={handleFilterChange} //Passing prop (functions) to setFilter(value)
                > 
                </FilterButtons>
            </div>
            <ModalMessage isOpen={isModalOpen} onClose={() => {setIsModalOpen(false)}}></ModalMessage>
        </div>
    );
}

//-----------------------------USE REDUCER-----------------------------

//I know this shouldn't be here, but I want to keep the reducer in the because I got some problems
interface todoReducerProps {
    tasks: {},
    action: {
        type: string;
        description?: string;
        taskId?: number;
        filter?: currentFilterStatus;
    }
}

type TodoAction = 
    | { type: 'add_task'; description: string }
    | { type: 'delete_task'; taskId: number }
    | { type: 'check_task'; taskId: number }
    | { type: 'clear_completed' }
    | { type: 'set_filter'; filter: currentFilterStatus };


function todoReducer(tasks, action: TodoAction): todoReducerProps{
    switch(action.type) {
        case 'add_task':
            const newTask = {
                id: tasks.nextId,
                description: action.description,
                done: false
            };
            return {
                ...tasks,
                todos: [...tasks.todos, newTask],
                nextId: tasks.nextId + 1
            };
        case 'delete_task':
            return {
                ...tasks,
                todos: tasks.todos.filter(task => task.id !== action.taskId)
            }
        case 'check_task':
            return {
                ...tasks,
                todos: tasks.todos.map(task => 
                    task.id === action.taskId ? {...task, done: !task.done} : task
                )
            }
        case 'set_filter':
            return {
                ...tasks,
                filterValue: action.filter
            }
        case 'clear_completed':
            return {
                ...tasks,
                todos: tasks.todos.filter(task => !task.done),
            }
        default:
            return tasks;
    }
}