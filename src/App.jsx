import { useState, useEffect } from 'react';
import './App.css';

const apiUrls = {
  username: 'https://playground.4geeks.com/todo/users/havli',
  todos: 'https://playground.4geeks.com/todo/todos/',
  create: 'https://playground.4geeks.com/todo/todos/havli',
};

const App = () => {
  const [username, setUsername] = useState('');
  const [usertodos, setUserTodos] = useState({});
  const [error, setError] = useState(null);
  const [newtask, setNewtask] = useState('');

  useEffect(() => {
    getListTodos();
    return () => {
      // Función de limpieza
    };
  }, []);

  const postToDo = async () => {
    try {
      const response = await fetch(apiUrls.create, {
        method: 'POST',
        body: JSON.stringify({ label: newtask, is_done: false }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      getListTodos();
      return data;
    } catch (error) {
      console.error('Error:', error);
      setError(error);
    }
  };

  const getListTodos = async () => {
    try {
      const response = await fetch(apiUrls.username);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      setUsername(data.name);
      setUserTodos(data.todos);
    } catch (error) {
      console.error('Error:', error);
      setError(error);
    }
  };

  const updateTodo = async (id, label, is_done) => {
    try {
      const response = await fetch(`${apiUrls.todos}${id}`, {
        method: 'PUT',
        body: JSON.stringify({ label, is_done }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${apiUrls.todos}${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      getListTodos();
    } catch (error) {
      console.error('Error:', error);
      setError(error);
    }
  };

  return (
    <main>
      <header className='header'>
        <h1>Todo List</h1>
      </header>
      {error ? (
        <section className="error-notice">
          <div className="oaerror danger">
            <strong>Error:</strong> {error.message}
          </div>
        </section>
      ) : (
        <>
          <section className='todo-input-section'>
            <div className='todo-input-wrapper'>
              <input type='text' id='todo-input' placeholder='Escribe la tarea' onChange={(e) => { setNewtask(e.target.value) }} />
              <button id='add-button' onClick={() => { postToDo() }}>Agregar</button>
            </div>
          </section>

          <section className='todo-list-section'>
            {usertodos && usertodos.length ?
              <ul id='todo-list'>
                {usertodos.map((todo) =>
                  <li className='todo-item' key={todo.id}>
                    {
                      !todo.is_done ?
                        <>
                          <span className='task-text'>{todo.label}</span>
                          <button className='complete-button' onClick={() => { updateTodo(todo.id, todo.label, true) }}>Marcar como hecha</button>
                        </>
                        :
                        <>
                          <span className='task-text is-done'>{todo.label}</span>
                          <button className='complete-button' onClick={() => { updateTodo(todo.id, todo.label, false) }}>Marcar como no hecha</button>
                        </>
                    }
                    <button className='delete-button' onClick={() => { deleteTodo(todo.id) }}>Eliminar</button>
                  </li>
                )}
              </ul>
              :
              <div className="dots"></div>
            }
          </section>
        </>
      )}
    </main>
  );
}

export default App;