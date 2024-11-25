import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs';
import { Rotas } from 'src/app/services/enum.rotas';

@Injectable({
  providedIn: 'root', // Ou no módulo específico se for modularizado
})
export class AutorProvider {
  constructor(private api: ApiService) {}
  enums = Rotas;
  getAutor(): Observable<any> {
    return this.api.get('autor');
  }

  createAutor(autor: any): Observable<any> {
    return this.api.post('autor', autor,this.enums.autor);
  }

  deleteAutor(idAutor:number): Observable<any> {
    return this.api.delete('autor', idAutor);
  }

  searchAutor(nomeAutor:string): Observable<any> {
    return this.api.search('autor/search?nome=', nomeAutor);
  }

  putAutor(objetoAutor:any):Observable<any> {
    return this.api.put('autor', objetoAutor.codAu, objetoAutor.nome,this.enums.autor);
  }

}
