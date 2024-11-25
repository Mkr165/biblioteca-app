import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs';
import { Rotas } from 'src/app/services/enum.rotas';

@Injectable({
  providedIn: 'root', // Ou no módulo específico se for modularizado
})
export class LivroProvider {
  constructor(private api: ApiService) {}
  enums = Rotas;
  getLivro(): Observable<any> {
    return this.api.get('livro');
  }

  createLivro(livro: any): Observable<any> {
    return this.api.post('livro', livro,this.enums.livro);
  }

  addAutorToLivro(livroId:any, autorId:any): Observable<any> {
    const body={
      "livro_Codl": livroId,
      "autor_CodAu":autorId
    }
    return this.api.post('livro-autor', body ,this.enums.livroAutor);
  }

  addAssuntoToLivro(livroId:any, assuntoId:any): Observable<any> {
    const body={
      "livro_Codl": livroId,
      "assunto_CodAs":assuntoId
    }
    return this.api.post('livro-assunto', body ,this.enums.livroAssunto);
  }

  removeAutorFromLivro(livroId: any, autorId: any): Observable<any> {
    const url = `livro-autor/${livroId}`;
    return this.api.delete(url, autorId);
  }

  removeAssuntoFromLivro(livroId: any, assuntoId: any): Observable<any> {
    const url = `livro-assunto/${livroId}`;
    return this.api.delete(url,assuntoId);
  }

  deleteLivro(idAutor:number): Observable<any> {
    return this.api.delete('livro', idAutor);
  }

  searchLivro(nomeLivro:string): Observable<any> {
    return this.api.search('livro/search?titulo=', nomeLivro);
  }

  putLivro(id:number,livro:object):Observable<any> {
    return this.api.put('livro', id, livro,this.enums.livro);
  }

}
