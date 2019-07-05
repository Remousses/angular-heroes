import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class HeroService {
  constructor(private messageService: MessageService, private http: HttpClient) { }

  private dbUrl = 'api/heroes';
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.dbUrl)
      .pipe(tap(heroes => this.add('fetched heroes')),
        catchError(this.handleError('getHeroes', []))
      );
  }
  add(message: string): void {
    this.messageService.add('Hero Service: ' + message);
  }
  getHero(id: number): Observable<Hero> {
    const url = this.dbUrl + "/" + id;

    return this.http.get<Hero>(url).pipe(
      tap(_ => this.add('fetched hero : ' + id)),
      catchError(this.handleError<Hero>("getHero id=" + id))
    );
  }
  updateHero(hero: Hero): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.put(this.dbUrl, hero, httpOptions).pipe(
      tap(_ => this.add(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }
  addHero(hero: Hero): Observable<Hero> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post<Hero>(this.dbUrl, hero, httpOptions).pipe(
      tap((hero: Hero) => this.add(`added hero w/ id ${hero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }
  deleteHero(hero: Hero | number): Observable<Hero> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.dbUrl}/${id}`;
    return this.http.delete<Hero>(url, httpOptions).pipe(
      tap(_ => this.add(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) return of([]);

    return this.http.get<Hero[]>(this.dbUrl + "/?name=" + term).pipe(
      tap(_ => this.add(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    )

  }
  /** 
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.add(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
