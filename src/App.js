import React, { PureComponent } from 'react';
import { v4 } from 'uuid';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';

export class App extends PureComponent {
  todos = [
    {
      id: v4().substr(0, 4),
      text: 'drink a coffee',
      completed: false,
    },
    {
      id: v4().substr(0, 4),
      text: 'get the world masters',
      completed: false,
    },
  ];

  state = {
    todoList: [...this.todos],
    visibleTodos: [...this.todos],
    filterName: 'all',
  };

  componentDidMount() {
    if (localStorage.getItem('todos')) {
      this.setState({
        todoList: [
          ...JSON.parse(localStorage.getItem('todos')),
        ],
        visibleTodos: [
          ...JSON.parse(localStorage.getItem('todos')),
        ],
      });
    }
  }

  componentDidUpdate() {
    localStorage.setItem('todos', JSON.stringify(this.state.todoList));
  }

  setNewTodo = (todo) => {
    if (todo.trim()) {
      this.setState(prevState => ({
        todoList: [
          ...prevState.todoList,
          {
            id: v4().substr(0, 4),
            text: todo,
            completed: false,
          },
        ],
        visibleTodos: [
          ...prevState.todoList,
          {
            id: v4().substr(0, 4),
            text: todo,
            completed: false,
          },
        ],
      }));
    }
  };

  handleCompleted = (event) => {
    const isCompleted = event.target.checked;
    const todoId = event.target.id;

    this.setState(prevState => ({
      todoList: [...prevState.todoList
        .map((todo) => {
          if (todoId === todo.id) {
            return {
              ...todo,
              completed: isCompleted,
            };
          }

          return todo;
        })],
    }));

    this.setFilteredList(this.state.filterName);
  };

  handleDestroy = (event) => {
    const todoId = event.target.dataset.btnIndex;

    this.setState(prevState => ({
      todoList: prevState.todoList
        .filter(todo => todo.id !== todoId),
    }));

    this.setFilteredList(this.state.filterName);
  };

  setEditedValue = (value, idx) => {
    if (value.trim()) {
      this.setState(prevState => ({
        todoList: prevState.todoList
          .map((todo, id) => {
            if (todo.id === idx) {
              return {
                ...todo,
                text: value,
                completed: false,
              };
            }

            return todo;
          }),
      }));
    }

    this.setFilteredList(this.state.filterName);
  };

  handleSelectAll = (isSelectAll) => {
    this.setState(prevState => ({
      todoList: prevState.todoList
        .map(todo => ({
          ...todo,
          completed: isSelectAll,
        })),
      visibleTodos: prevState.todoList
        .map(todo => ({
          ...todo,
          completed: isSelectAll,
        })),
    }));
  };

  clearCompleted = () => {
    this.setState(prevState => ({
      todoList: prevState.todoList
        .filter(todo => !todo.completed),
    }));

    this.setFilteredList(this.state.filterName);
  };

  setFilteredList = (name) => {
    this.setState((prevState) => {
      if (name === 'active') {
        return {
          filterName: 'active',
          visibleTodos: prevState.todoList
            .filter(todo => !todo.completed),
        };
      }

      if (name === 'completed') {
        return {
          filterName: 'completed',
          visibleTodos: prevState.todoList
            .filter(todo => todo.completed),
        };
      }

      return {
        filterName: 'all',
        visibleTodos: prevState.todoList,
      };
    });
  };

  render() {
    const { visibleTodos } = this.state;

    return (
      <section className="todoapp">
        <Header
          setNewTodo={todo => this.setNewTodo(todo)}
          selectAll={this.handleSelectAll}
          isSelectAll={visibleTodos.every(todo => todo.completed)}
        />

        <section className="main">
          <TodoList
            setEditedValue={(value, id) => this.setEditedValue(value, id)}
            todos={visibleTodos}
            onCompleted={e => this.handleCompleted(e)}
            onDestroy={event => this.handleDestroy(event)}
          />
        </section>

        <Footer
          clear={this.clearCompleted}
          length={visibleTodos.length}
          sort={name => this.setFilteredList(name)}
        />
      </section>
    );
  }
}
