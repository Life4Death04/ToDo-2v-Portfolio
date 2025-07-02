import './todo.css'
import { FaRegTrashAlt } from "react-icons/fa"; //Icons import 
import { FiSun } from "react-icons/fi";
import { FiMoon } from "react-icons/fi";

import {useState} from 'react';
import {useEffect} from 'react';

<<<<<<< Updated upstream
const initialTask = [
    {id: -1, description: 'It WOOOOORKS :D', done:true},
=======
interface InitialTaskType {
    id: number;
    description: string;
    done: boolean;
}

const initialTask: InitialTaskType[] = [
    {id: -1, description: 'Implementar TypeScript', done: true},
    {id: -2, description: 'Implementar JSDoc (manera de documentar)', done: true},
    {id: -3, description: 'Crear funcion para abstraer el setFilter (manejar filtrado)', done: true}
>>>>>>> Stashed changes
]

//-------------START-------TASK COMPONENT------------START---------------//
function Task({id, description, done, onCheck, onDelete}){
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
//-------------END-------TASK COMPONENT------------END---------------//

//------------START-----------COMPONENT MODAL MESSAGE FOR EMPTY TASKS INPUTS--------START-----------//
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
//-------------END----------COMPONENT MODAL MESSAGE FOR EMPTY TASKS INPUTS--------END-----------//

/*------START-----------COMPONENT OF FILTERABLE BUTTONS-------------START--------*/
function FilterButtons({
    currentFilter,
    itemsLeft, //Prop to show how many actives task there are
    onClear, //Prop (function) to clear those completed tasks
    onChange //Prop (function) to change the value because when we click on the buttons onChange becomes setFilter
    }){  
    return(
        <section className="filterButtons-section">
            <span>{itemsLeft} {itemsLeft > 1 ? 'items' : 'item'} left</span>
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
/*------END-----------COMPONENT OF FILTERABLE BUTTONS-------------END--------*/


//------------START--------------MAIN COMPONENT (TO DO)----------START--------------//
export default function ToDo(){
<<<<<<< Updated upstream
    const [taskState, setTaskState] = useState(initialTask);
    const [inputTaskValue, setInputTaskValue] = useState('');
    const [nextId, setNextId] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false); //Code for the modal operations
=======
    //State for the list of tasks
    const [taskState, setTaskState] = useState<InitialTaskType[]>(initialTask); //Initial tasks for the to-do list
    const [inputTaskValue, setInputTaskValue] = useState<string>(''); //State for the input value of the ToDo
    const [nextId, setNextId] = useState<number>(0); //Next id for the task
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); //Code for the modal operations
    const [darkMode, setDarkMode] = useState<boolean>(false) //State for dark mode toggle
>>>>>>> Stashed changes
    
    let pendingTasks = taskState.filter(t => !t.done).length;

    useEffect(() => {
        document.body.className = darkMode ? 'dark' : ''; //Change the body class to dark or light mode
    }, [darkMode]); //This effect will run whenever darkMode changes

    //State for filterable buttons
    const [filter, setFilter] = useState('all');
    let filterList = taskState.filter(t => {
        if(filter === 'active') return !t.done;
        if(filter === 'completed') return t.done;
        return true;
    })

    //-----------START-------------ADD, DELETE, CHECK, CLEAR FUNCTIONS------------START------------
    /*I just lift up the code to let the father component to manage all the functions. Because I think is dumb
    let the child having those 3 functions by themselves, besides If I create 1000 task, then will be like 3000
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
    //-----------END-------------ADD, DELETE, CHECK, CLEAR FUNCTIONS--------------END----------

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
//------------START--------------MAIN COMPONENT (TO DO)----------START--------------//