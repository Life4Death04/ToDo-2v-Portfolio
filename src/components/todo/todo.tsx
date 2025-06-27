import './todo.css'
import { IoCloseSharp } from "react-icons/io5"; //Icons import 
import {useState} from 'react';

const initialTask = [
    {id: -1, description: 'It WOOOOORKS :D', done:true},
]

function Task({id, description, done, onCheck, onDelete}){
    return(
        <li key={id} className='task-container'>
            <span className={done ? 'checkTask-btn-active' : 'checkTask-btn-false'} onClick={onCheck}></span>
            <p className={done ? 'descriptionTask-active' : 'descriptionTask-false'}>{description}</p>
            <button onClick={onDelete} className="deleteTask-btn">
                <IoCloseSharp size={25}></IoCloseSharp>
            </button>
        </li>
    );
}

function ModalMessage({isOpen, onClose}){
    if (!isOpen) return null; //It is a common React pattern used to conditionally render the component. It means: "If the modal is not supposed to be open, don't render anything."

    return(
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalContent">
                <p>You can't add empty tasks. Please type a task to add.</p>
            </div>
        </div>
    );
}

export default function ToDo(){
    const [taskState, setTaskState] = useState(initialTask);
    const [nextId, setNextId] = useState(0);
    const [inputTaskValue, setInputTaskValue] = useState('');
    //Code for the modal operations
    const [isModalOpen, setIsModalOpen] = useState(false);

    //State for filterable buttons
    const [filter, setFilter] = useState('all');
    let filterList = taskState.filter(t => {
        if(filter === 'active') return !t.done;
        if(filter === 'completed') return t.done;
        return true;
    })

    let pendingTasks = taskState.filter(t => !t.done).length;

    /*I just lift up the code to let the father component to manage all the functions. Because I think is dumb
    let the childs having those 3 functions by themselves, besides If I create 1000 task, then will be like 3000
    of functions and no.*/
    function addTask(){
        if(inputTaskValue !== ''){  
            setTaskState(
                [
                    ...taskState,
                    {id: nextId, description: inputTaskValue, done: false}
                ]
            )
            setNextId(prev => prev + 1);
            setInputTaskValue('');
        }else{
            setIsModalOpen(true);
        }
    }

    function checkTask(taskId){
        /*For this function, we dont have to return or copy all the element in the array, why?
        Because, .map already make an array with all the elements and same length so, we can modify
        the element that we want implementing 'taskId === t.id' in that way when we reach that 
        element, we will modify it (remebering that we have to copy their old props). Otherwise,
        we'll just return the elements that doesn't match with the condition.*/
        let newTasks = taskState.map(t => {
            if(taskId === t.id){
                return {...t, done: !t.done}
            }else{
                return t;
            }
        })
        setTaskState(newTasks);
    }
    
    function deleteTask(taskId){
       setTaskState(taskState.filter(t => t.id !== taskId));
    }

    function clearTasksCompleted(){
        setTaskState(taskState.filter(t => t.done !== true));
    }

    return(
        <div>
            <div className="todo-container">
                <span className='icon'>To-Do List</span>
                <div className="input-task-container">
                    <input type="text" name="" id="input-task" placeholder="Add your task" value={inputTaskValue} onChange={(e) => {
                        setInputTaskValue(e.target.value);
                    }}/>
                    <button id="addTask-btn" onClick={addTask}>Add</button>
                </div>
                <ul className="todo-tasks-content">
                    {//Here we just switched taskState for filterList because it has the logic to filter the tasks
                    filterList.map(t => {
                        return(
                            <Task {...t} onCheck={() => {checkTask(t.id)}} onDelete={() => {deleteTask(t.id)}}></Task>
                        )
                    })}
                </ul>
                <FilterButtons 
                    currentFilter={filter}
                    itemsLeft={pendingTasks} //Passing prop (variable) of how many items
                    onClear={clearTasksCompleted} //Passing prop (function) to clear items
                    onChange={setFilter} //Passing prop (functions) to setFilter(value)
                > 
                </FilterButtons>
            </div>
            
            <ModalMessage isOpen={isModalOpen} onClose={() => {setIsModalOpen(false)}}></ModalMessage>
        </div>
    );
}

/*Component of filterable buttons, with its props for the functions*/
function FilterButtons({
    currentFilter,
    itemsLeft, //Prop to show how many actives task there are
    onClear, //Prop (function) to clear those completed tasks
    onChange //Prop (function) to change the value because when we click on the buttons onChange becomes setFilter
    }){  
    return(
        <section className="filterButtons-section">
            <span>{itemsLeft} items left</span>
                <div className="filterButtons-container">
                    <button className={currentFilter === 'active' ? 'filterButtons active' : 'filterButtons'} onClick={() => 
                        //Since we are passing setFilter function to onChange, onChange works as a setFilter
                        onChange('active')}>Active</button>
                    <button className={currentFilter === 'all' ? 'filterButtons allFilter active' : 'filterButtons allFilter'}  onClick={() => onChange('all')}>All</button>
                    <button className={currentFilter === 'completed' ? 'filterButtons active' : 'filterButtons'}  onClick={() => onChange('completed')}>Completed</button>
                </div>
            <button className='filterButtons clearTask' onClick={onClear}>Clear Completed</button>
        </section>
    );
}