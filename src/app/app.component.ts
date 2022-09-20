import {Component, OnInit} from '@angular/core';
import {Todo, TodosService} from "./todos.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  todos: Todo[] = []
  todoTitle = ''
    loading = false
    error = ''

  constructor(private todosService: TodosService) {}

  ngOnInit(): void {
      this.fetchTodos()
  }

  fetchTodos() {
      this.loading = true
      this.todosService.fetchTodos()
          .subscribe(todos => {
              console.log('Response GET: ', todos)
              this.todos = todos
              this.loading = false
          }, error => {
              this.error = error.message
              console.log(error.message)
          })
  }

  addTodo() {
      if (!this.todoTitle.trim()) {
          return
      }

      this.todosService.addTodo({
          title: this.todoTitle,
          completed: false
      }).subscribe(todo => {
              console.log('Response POST: ', todo)
              this.todos.push(todo)
              this.todoTitle = ''
        })
    }

    removeTodo(id: number | any) {
        this.todosService.removeTodo(id)
            .subscribe(() => {
                this.todos = this.todos.filter(todo => todo.id !== id)
            })
    }

    completeTodo(id: number | any) {
      this.todosService.completeTodo(id)
          .subscribe(todo => {
              console.log('Response PUT: ', todo)
              this.todos.find(t => t.id === todo.id)!.completed = true
          })
    }
}
