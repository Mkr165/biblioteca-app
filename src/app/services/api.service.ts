import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rotas } from './enum.rotas';

@Injectable({
  providedIn: 'root', // Disponível em toda a aplicação
})
export class ApiService {
  private baseUrl = 'http://localhost:5000/api/v1'; // URL base do backend

  constructor(private http: HttpClient) {}

  enums = Rotas;

  getPayload(
    action: 'POST' | 'PUT',
    rota: number,
    body: any,
    id?: number
  ): any {
    const payloadConfig: { [key: number]: { POST: any; PUT: any } } = {
      [this.enums.autor]: {
        POST: { nome: body },
        PUT: { codAu: id, nome: body },
      },
      [this.enums.assunto]: {
        POST: { descricao: body },
        PUT: { codAs: id, descricao: body },
      },
      [this.enums.livro]: {
        POST: {
          titulo: body.titulo,
          editora: body.editora,
          anoPublicacao: body.anoPublicacao,
          preco: +body.preco,
          formaCompra: body.formaCompra,
        },
        PUT: {
          codL: id,
          titulo: body.titulo,
          editora: body.editora,
          anoPublicacao: body.anoPublicacao,
          preco: +body.preco,
          formaCompra: body.formaCompra,
        },
      },

      [this.enums.livroAutor]: {
        POST: {
          livro_Codl: body.livro_Codl,
          autor_CodAu: body.autor_CodAu,
        },
        PUT: {
          livro_Codl: body.livro_Codl,
          autor_CodAu: body.autor_CodAu,
        },
      },
      [this.enums.livroAssunto]: {
        POST: {
          livro_Codl: body.livro_Codl,
          assunto_CodAs: body.assunto_CodAs,
        },
        PUT: {
          livro_Codl: body.livro_Codl,
          assunto_CodAs: body.assunto_CodAs,
        },
      },
    };

    // Verifica se a rota existe no mapeamento
    const config = payloadConfig[rota];
    if (!config) {
      throw new Error('Rota não suportada.');
    }

    // Retorna o payload correspondente
    const payload = config[action];
    if (!payload) {
      throw new Error(`${action} não suportado para a rota ${rota}.`);
    }

    return payload;
  }

  // Método genérico para obter dados
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`);
  }

  search<T>(endpoint: string, nome: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}${nome}`);
  }
  // Método genérico para enviar dados (POST)
  post<T>(endpoint: string, body: any, rota: Rotas): Observable<T> {
    const payload = this.getPayload('POST', rota, body);
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, payload);
  }

  // Outros métodos (PUT, DELETE) conforme necessário
  put<T>(endpoint: string, id: number, body: any, rota: Rotas): Observable<T> {
    const payload = this.getPayload('PUT', rota, body, id);
    return this.http.put<T>(`${this.baseUrl}/${endpoint}/${id}`, payload);
  }

  delete<T>(endpoint: string, id: number): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}/${id}`);
  }
}
