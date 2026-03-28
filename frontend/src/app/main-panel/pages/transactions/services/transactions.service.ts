import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})

export class TransactionsService {

  // A URL da nossa API do json-server
  private apiUrl = 'http://localhost:3000/transactions';

  constructor(private http: HttpClient) {}

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}`).pipe(
      catchError((err) => {
        console.error('Erro ao buscar transações:', err);
        return throwError(() => new Error('Erro ao carregar transações.'));
      })
    );
  }

  getTransactionById(id: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`).pipe(
      catchError((err) => {
        console.error('Erro ao buscar transação:', err);
        return throwError(() => new Error('Erro ao carregar a transação.'));
      })
    );
  }

  createTransaction(
    transaction: Omit<Transaction, 'id'>
  ): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}`, transaction).pipe(
      catchError((err) => {
        console.error('Erro ao criar transação:', err);
        return throwError(() => new Error('Erro ao criar a transação.'));
      })
    );
  }

  updateTransaction(transaction: Transaction, id: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, transaction).pipe(
      catchError((err) => {
        console.error('Erro ao atualizar transação:', err);
        return throwError(() => new Error('Erro ao atualizar a transação.'));
      })
    );
  }
  
  deleteTransaction(id: string): Observable<void> {
    // Exemplo para enviar um motivo de cancelamento junto com a requisição de DELETE
    const params = new HttpParams().set('motivo', 'cancelamento');
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { params }).pipe(
      catchError((err) => {
        console.error('Erro ao excluir transação:', err);
        return throwError(() => new Error('Erro ao excluir a transação.'));
      })
    );
  }
}
