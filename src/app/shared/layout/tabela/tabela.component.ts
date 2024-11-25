import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-tabela',
  templateUrl: './tabela.component.html',
  styleUrls: ['./tabela.component.scss']
})
export class TabelaComponent implements OnInit {
  constructor() {}

  @Input() dados: any[] = []; // Dados dinâmicos da tabela
  @Input() cabecalho: any[] = []; // Cabeçalhos da tabela
  @Input() titulo = ''; // Título da tabela
  filtro: string = ''; // Valor do filtro
  @Output() excluir: EventEmitter<any> = new EventEmitter<any>(); // Evento de exclusão
  @Output() editar: EventEmitter<any> = new EventEmitter<any>(); // Evento de edição
  @Output() filtroTabela: EventEmitter<string> = new EventEmitter<string>(); // Evento do filtro

  private filtroSubject: Subject<string> = new Subject<string>();

  ngOnInit(): void {
    this.filtroSubject
      .pipe(debounceTime(500)) // Espera 500ms após a última entrada
      .subscribe((termoFiltro) => {
        this.filtroTabela.emit(termoFiltro);
        console.log(termoFiltro);
      });
  }

  // Método para tratar os valores dinamicamente
  getValor(item: any, chave: string): string {
    const valor = item[chave];

    if (Array.isArray(valor)) {
      // Concatena nomes ou descrições se for um array
      return valor.map((subItem: any) => subItem.nome || subItem.descricao).join(', ');
    }

    return valor || '---'; // Retorna o valor ou '---' caso esteja vazio
  }

  // Método para emitir o evento de exclusão
  emitirExcluir(item: any): void {
    const id = Object.values(item)[0]; // Pega dinamicamente o primeiro valor como ID
    this.excluir.emit(id);
  }

  // Método para emitir o evento de edição
  emitirEdicao(item: any): void {
    this.editar.emit(item); // Passa o objeto inteiro para edição
  }

  // Atualiza o filtro
  aplicarFiltro(): void {
    this.filtroSubject.next(this.filtro); // Atualiza o Subject com o novo valor
  }
}
