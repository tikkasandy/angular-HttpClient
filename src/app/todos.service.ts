import {Injectable} from "@angular/core";
import {HttpClient, HttpEventType, HttpHeaders, HttpParams} from "@angular/common/http";
import {catchError, delay, map, Observable, tap, throwError} from "rxjs";

export interface Todo {
    title: string;
    completed: boolean;
    id?: number;
}

@Injectable({providedIn: 'root'})
export class TodosService {
    constructor(private http: HttpClient) {
    }

    fetchTodos(): Observable<Todo[]> {
        let params = new HttpParams()
        params = params.append('_limit', '4')
        params = params.append('custom', 'anything')

        // @ts-ignore
        return this.http.get<Todo[]>('https://jsonplaceholder.typicode.com/todos', {
            params,
            // params: new HttpParams().set('_limit', '6')
            observe: 'response',
            })
            .pipe(
                map(response => {
                    console.log('Response: ', response)
                    return <Todo[]>response.body
                }),
                delay(1000),
                catchError(errorr => {
                    console.log('Error: ', errorr.message)
                    return throwError(errorr)
                })
            )
    }

    addTodo(todo: Todo): Observable<Todo> {
        const headers = new HttpHeaders({
            'MyCustomHeader': Math.random().toString(),
            'SecondHeader': '123',
        })

        return this.http.post<Todo>('https://jsonplaceholder.typicode.com/todos', todo, {
            headers
            // headers: new HttpHeaders({
            //     'MyCustomHeader': Math.random().toString(),
            //     'SecondHeader': '123',
            // })
        })
    }

    removeTodo(id: number | any): Observable<any> {
        return this.http.delete(`https://jsonplaceholder.typicode.com/todos/${id}`, {
            observe: "events",
        })
            .pipe(
                tap(event => {
                    console.log('Event: ', event)

                    if (event.type === HttpEventType.Sent) {
                        console.log('Sent: ', event)
                    }

                    if (event.type === HttpEventType.Response) {
                        console.log('Response: ', event)
                    }
                })
            )
    }

    completeTodo (id: number | any): Observable<any> {
        return this.http.put<Todo>(`https://jsonplaceholder.typicode.com/todos/${id}`, {
            completed: true
        }, {
            responseType: "json"
        })
    }
}
