import { useState } from 'react';
import './App.css';

const App = () => {
  const [userName, setUserName] = useState('');
  const [taskLabel, setTaskLabel] = useState('');
  const [userTodos, setUserTodos] = useState([]);
  const [isUser, setIsUser] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const apiUrl = 'https://playground.4geeks.com/todo';

  const handleApiError = (error) => {
    console.error('Error al realizar la solicitud:', error);
    setErrorMessage('Error en la carga de datos. Intenta de nuevo.');
  };

  const createUser = async () => {
    try {
      const response = await fetch(`${apiUrl}/users/${userName}`, {
        method: 'POST',
        body: JSON.stringify({ name: userName }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Error al crear el usuario.');

      await response.json();
      setIsUser(true);
    } catch (error) {
      handleApiError(error);
    }
  };

  const createTask = async () => {
    try {
      const response = await fetch(`${apiUrl}/todos/${userName}`, {
        method: 'POST',
        body: JSON.stringify({ label: taskLabel, is_done: false }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Error al crear la tarea.');

      const taskCreated = await response.json();
      setUserTodos(prev => [...prev, taskCreated]);
      setTaskLabel('');
    } catch (error) {
      handleApiError(error);
    }
  };

  const deleteTask = async (todoId) => {
    try {
      const response = await fetch(`${apiUrl}/todos/${todoId}`, { method: 'DELETE' });

      if (!response.ok) throw new Error('Error al eliminar la tarea.');

      setUserTodos(prev => prev.filter(task => task.id !== todoId));
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <main className='app-container'>
      <header className='header'>
        <h1>Todo List with React</h1>
      </header>
      {errorMessage && (
        <section className='error-notice'>
          <div className="error-message">
            <strong>Error:</strong> {errorMessage}
          </div>
        </section>
      )}
      {!isUser ? (
        <section className='user-input-section'>
          <input
            type='text'
            placeholder='Nombre de usuario'
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className='input-field'
          />
          <button onClick={createUser} className='button green-button'>Crear Usuario</button>
        </section>
      ) : (
        <>
          <section className='task-input-section'>
            <input
              type='text'
              placeholder='Nueva tarea'
              value={taskLabel}
              onChange={(e) => setTaskLabel(e.target.value)}
              className='input-field'
            />
            <button onClick={createTask} className='button green-button'>Agregar Tarea</button>
          </section>
          <section className='todo-list-section'>
            {userTodos.length > 0 ? (
              <ul className='todo-list'>
                {userTodos.map((todo) => (
                  <li className='todo-item' key={todo.id}>
                    <span className='task-text'>{todo.label}</span>
                    <button className='button yellow-button' onClick={() => deleteTask(todo.id)}>Eliminar</button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className='empty-list'>No hay tareas en la lista.</div>
            )}
          </section>
        </>
      )}
    </main>
  );
}

export default App;
