import './todo.css'
import { IoCloseSharp } from "react-icons/io5"; //Icons import 
import {useState} from 'react';

interface InitialTaskType {
    id: number;
    description: string;
    done: boolean;
}

const initialTask: InitialTaskType[] = [
    {id: -1, description: 'Implementar TypeScript', done: true},
    {id: -2, description: 'Implementar JSDoc (manera de documentar)', done: false},
    {id: -3, description: 'Crear funcion para abstraer el setFilter (manejar filtrado)', done: true}
]

//-------------START-------TASK COMPONENT------------START---------------//
type TaskItemProps = {
    id: number;
    description: string;
    done: boolean;
    onCheck: () => void; //Function to check the task
    onDelete: () => void; //Function to delete the task
}

function TaskItem({id, description, done, onCheck, onDelete}: TaskItemProps){ //Change Task for TaskItem
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
//-------------END-------TASK COMPONENT------------END---------------//

//------------START-----------COMPONENT MODAL MESSAGE FOR EMPTY TASKS INPUTS--------START-----------//
type ModalMessageProps = {    
    isOpen: boolean; //Prop to know if the modal is open or not
    onClose: () => void; //Prop to close the modal
}

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
//-------------END----------COMPONENT MODAL MESSAGE FOR EMPTY TASKS INPUTS--------END-----------//

/*------START-----------COMPONENT OF FILTERABLE BUTTONS-------------START--------*/
type currentFilterStatus = 'active' | 'all' | 'completed';

type FilterButtonsProps = {
    currentFilter: currentFilterStatus; //Prop to know which filter is active
    itemsLeft: number; //Prop to show how many active tasks there are
    onClear: () => void; //Prop (function) to clear those completed tasks
    onChange: (filter: currentFilterStatus) => void; //Prop (function) to change the value because when we click on the buttons onChange becomes setFilter
}

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
/*------END-----------COMPONENT OF FILTERABLE BUTTONS-------------END--------*/


//------------START--------------MAIN COMPONENT (TO DO)----------START--------------//
export default function ToDo(){
    const [taskState, setTaskState] = useState<InitialTaskType[]>(initialTask);
    const [inputTaskValue, setInputTaskValue] = useState<string>('');
    const [nextId, setNextId] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); //Code for the modal operations
    
    let pendingTasks:number = taskState.filter(t => !t.done).length;

    //State for filterable buttons
    const [filter, setFilter] = useState<currentFilterStatus>('all');
    let filterList = taskState.filter(t => {
        if(filter === 'active') return !t.done;
        if(filter === 'completed') return t.done;
        return true;
    })

    //-----------START-------------ADD, DELETE, CHECK, CLEAR FUNCTIONS------------START------------
    /*I just lift up the code to let the father component to manage all the functions. Because I think is dumb
    let the childs having those 3 functions by themselves, besides If I create 1000 task, then will be like 3000
    of functions and no.*/
    function addTask(): void{
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

    function checkTask(taskId: number): void{
        /*For this function, we dont have to return or copy all the element in the array, why?
        Because, .map already make an array with all the elements and same length so, we can modify
        the element that we want implementing 'taskId === t.id' in that way when we reach that 
        element, we will modify it (remebering that we have to copy their old props). Otherwise,
        we'll just return the elements that doesn't match with the condition.*/

        let newTasks = taskState.map(t => { //Change let for const & find a better way to check tasks
            if(taskId === t.id){
                return {...t, done: !t.done}
            }else{
                return t;
            }
        })
        setTaskState(newTasks);
    }
    
    function deleteTask(taskId: number): void{
       setTaskState(taskState.filter(t => t.id !== taskId));
    }

    function clearTasksCompleted(): void{
        setTaskState(taskState.filter(t => t.done !== true));
    }
    //-----------END-------------ADD, DELETE, CHECK, CLEAR FUNCTIONS--------------END----------
    function handleFilterChange(text: currentFilterStatus): void{
        setFilter(text);
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
                            <TaskItem {...t} onCheck={() => {checkTask(t.id)}} onDelete={() => {deleteTask(t.id)}}></TaskItem>
                        )
                    })}
                </ul>
                <FilterButtons 
                    currentFilter={filter}
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
//------------START--------------MAIN COMPONENT (TO DO)----------START--------------//