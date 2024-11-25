import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs';
import { Rotas } from 'src/app/services/enum.rotas';

@Injectable({
  providedIn: 'root', // Ou no módulo específico se for modularizado
})
export class AssuntoProvider {
  constructor(private api: ApiService) {}
  enuns = Rotas;
  getAssunto(): Observable<any> {
    return this.api.get('assunto');
  }

  createAssunto(descricao: string): Observable<any> {
    return this.api.post('assunto', descricao,this.enuns.assunto);
  }

  deleteAssunto(idAssunto:number): Observable<any> {
    return this.api.delete('assunto', idAssunto);
  }

  searchAssunto(nomeAssunto:string): Observable<any> {
    return this.api.search('assunto/search?descricao=', nomeAssunto);
  }

  putAssunto(objetoAssunto:any):Observable<any> {
    return this.api.put('assunto', objetoAssunto.codAs, objetoAssunto.descricao, this.enuns.assunto);
  }

}
