import {HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable, tap} from "rxjs";

export class AuthInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('Intercept request', req)

        const cloned =req.clone({
            headers: req.headers.append('Auth', 'SOME RANDOM TOKEN')
        })

        return next.handle(cloned)
            .pipe(
                tap(event => {
                    if (event.type === HttpEventType.Response) {
                        console.log('Interceptor response: ', event)
                    }
                })
            )
    }
}