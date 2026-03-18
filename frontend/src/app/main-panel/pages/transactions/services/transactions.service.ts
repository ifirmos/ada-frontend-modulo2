import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})

export class TransactionsService {

  // A URL da nossa API do json-server
  private apiUrl = 'http://localhost:3000/transactions';

  constructor(private http: HttpClient) {}

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}`);
  }

  getTransactionById(id: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  createTransaction(
    transaction: Omit<Transaction, 'id'>
  ): Observable<Transaction> {

  const headers = new HttpHeaders({
    Authorization: 'Bearer token-secreto-banco-123',
    'Content-Type': 'application/json'
  });
    // POST: Precisa de URL, Corpo da requisição e das Opções (Headers)
    return this.http.post<Transaction>(`${this.apiUrl}`, transaction, { headers });
  }

  updateTransaction(transaction: Transaction, id: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, transaction);
  }

  deleteTransaction(id: string): Observable<void> {
    // Exemplo para enviar um motivo de cancelamento junto com a requisição de DELETE
    const params = new HttpParams().set('motivo', 'cancelamento');
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { params });
  }
}
