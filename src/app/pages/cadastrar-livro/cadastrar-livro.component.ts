import { LivroProvider } from './../../providers/livro/livro.provider';
import { AssuntoProvider } from './../../providers/assunto/assunto.provider';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs'; // Importação do forkJoin

import { AutorProvider } from 'src/app/providers/autor/autor.provider';
declare var bootstrap: any;

@Component({
  selector: 'app-cadastrar-livro',
  templateUrl: './cadastrar-livro.component.html',
  styleUrls: ['./cadastrar-livro.component.scss'],
})
export class CadastrarLivroComponent implements OnInit {
  livros = []; // Lista de livros cadastrados
  formularioLivro: FormGroup; // Formulário para cadastro e edição
  livroSelecionado: any = null; // Livro sendo editado
  isEdit: boolean = false; // Define se o modal está no modo de edição
  anoAtual: number = new Date().getFullYear(); // Ano atual para validação
  formasCompra: string[] = ['Balcão', 'Self-Service', 'Internet', 'Evento']; // Formas de compra disponíveis
  autores: any[] = []; // Lista de autores
  assuntos: any[] = []; // Lista de assuntos

  constructor(
    private fb: FormBuilder,
    private livroProvider: LivroProvider,
    private autorProvider: AutorProvider,
    private assuntoProvider: AssuntoProvider
  ) {
    this.formularioLivro = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(40)]],
      editora: ['', [Validators.required]],
      anoPublicacao: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{4}$/), // Apenas 4 dígitos
          Validators.min(1900),
          Validators.max(this.anoAtual),
        ],
      ],
      preco: ['', [Validators.required, Validators.min(0)]],
      formaCompra: ['', [Validators.required]],
      autores: [[], Validators.required], // Campo para múltiplos autores
      assuntos: [[], Validators.required], // Campo para múltiplos assuntos
    });
  }

  ngOnInit(): void {
    this.carregarLivros();
    this.carregarAutores();
    this.carregarAssuntos();
  }

  carregarAutores() {
    this.autorProvider.getAutor().subscribe((res) => {
      this.autores = res;
    });
  }

  carregarAssuntos() {
    this.assuntoProvider.getAssunto().subscribe((res) => {
      this.assuntos = res;
    });
  }

  abrirModal() {
    this.isEdit = false;
    this.formularioLivro.reset();

    const modalElement = document.getElementById('modalLivro');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  editarLivro(livro: any) {
    this.isEdit = true;
    this.livroSelecionado = livro;

    this.formularioLivro.setValue({
      titulo: livro.titulo,
      editora: livro.editora,
      anoPublicacao: livro.anoPublicacao,
      preco: livro.preco,
      formaCompra: livro.formaCompra,
      autores: livro.autores.map((a: any) => a.codAu),
      assuntos: livro.assuntos.map((a: any) => a.codAs),
    });

    const modalElement = document.getElementById('modalLivro');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  salvar() {
    if (this.formularioLivro.valid) {
      const livro = this.formularioLivro.value;

      if (this.isEdit) {
        // Atualizar Livro
        this.livroProvider
          .putLivro(this.livroSelecionado.codl, livro)
          .subscribe(
            () => {
              alert('Sucesso ao editar.');
              this.processarRelacionamentos(this.livroSelecionado.codl, livro);
            },
            (err) => {
              alert('Erro ao editar.');
              console.error('Erro ao atualizar livro:', err);
            }
          );
      } else {
        // Cadastrar Novo Livro
        this.livroProvider.createLivro(livro).subscribe(
          (novoLivro) => {
            alert('Sucesso ao cadastrar.');
            this.processarRelacionamentos(novoLivro.codl, livro);
          },
          (err) => {
            alert('Erro ao cadastrar.');
            console.error('Erro ao cadastrar livro:', err);
          }
        );
      }
    }
  }

  processarRelacionamentos(livroId: number, livro: any) {
    // Autores e Assuntos antigos (antes da edição)
    const autoresAnteriores =
      this.livroSelecionado?.autores?.map((a: any) => a.codAu) || [];
    const assuntosAnteriores =
      this.livroSelecionado?.assuntos?.map((a: any) => a.codAs) || [];

    // Autores e Assuntos atuais (selecionados no formulário)
    const autoresAtuais = livro.autores || [];
    const assuntosAtuais = livro.assuntos || [];

    // Detectar alterações nos autores
    const autoresAdicionar = autoresAtuais.filter(
      (autorId: number) => !autoresAnteriores.includes(autorId)
    );
    const autoresRemover = autoresAnteriores.filter(
      (autorId: number) => !autoresAtuais.includes(autorId)
    );

    // Detectar alterações nos assuntos
    const assuntosAdicionar = assuntosAtuais.filter(
      (assuntoId: number) => !assuntosAnteriores.includes(assuntoId)
    );
    const assuntosRemover = assuntosAnteriores.filter(
      (assuntoId: number) => !assuntosAtuais.includes(assuntoId)
    );

    // Requisições para adicionar autores e assuntos
    const autoresRequestsAdicionar = autoresAdicionar.map((autorId: number) =>
      this.livroProvider.addAutorToLivro(livroId, autorId)
    );
    const assuntosRequestsAdicionar = assuntosAdicionar.map(
      (assuntoId: number) =>
        this.livroProvider.addAssuntoToLivro(livroId, assuntoId)
    );

    // Requisições para remover autores e assuntos
    const autoresRequestsRemover = autoresRemover.map((autorId: number) =>
      this.livroProvider.removeAutorFromLivro(livroId, autorId)
    );
    const assuntosRequestsRemover = assuntosRemover.map((assuntoId: number) =>
      this.livroProvider.removeAssuntoFromLivro(livroId, assuntoId)
    );

    // Executar todas as requisições simultaneamente
    forkJoin([
      ...autoresRequestsAdicionar,
      ...assuntosRequestsAdicionar,
      ...autoresRequestsRemover,
      ...assuntosRequestsRemover,
    ]).subscribe(
      () => {
        console.log('Relacionamentos atualizados com sucesso!');
        this.carregarLivros();
        this.fecharModal();
      },
      (err) => console.error('Erro ao atualizar relacionamentos:', err)
    );
  }

  excluirLivro(_livroId: any) {
    // Localizar o livro pelo ID
    const livro: any = this.livros.find((livro: any) => livro.codl === _livroId);

    if (!livro) {
      console.error('Livro não encontrado para exclusão.');
      alert('Livro não encontrado.');
      return;
    }

    const livroId = livro.codl;

    // Verificar se há autores ou assuntos associados ao livro
    const possuiAutores = livro.autores && livro.autores.length > 0;
    const possuiAssuntos = livro.assuntos && livro.assuntos.length > 0;

    // Caso não existam autores nem assuntos, excluir o livro diretamente
    if (!possuiAutores && !possuiAssuntos) {
      this.livroProvider.deleteLivro(livroId).subscribe(
        (response) => {
          alert('Livro excluído com sucesso!');
          console.log('Resposta da API (sucesso):', response);
          this.carregarLivros();
        },
        (error) => {
          alert('Erro ao excluir o livro. Tente novamente.');
          console.error('Erro da API ao excluir livro:', error);
        }
      );
      return; // Encerra o método aqui
    }

    // Se houver autores ou assuntos, prosseguir com a exclusão dos relacionamentos
    let autoresRequestsRemover = [];
    let assuntosRequestsRemover = [];

    if (possuiAutores) {
      autoresRequestsRemover = livro.autores.map((autor: any) =>
        this.livroProvider.removeAutorFromLivro(livroId, autor.codAu)
      );
    }

    if (possuiAssuntos) {
      assuntosRequestsRemover = livro.assuntos.map((assunto: any) =>
        this.livroProvider.removeAssuntoFromLivro(livroId, assunto.codAs)
      );
    }

    // Executar remoção de relacionamentos e do livro
    forkJoin([...autoresRequestsRemover, ...assuntosRequestsRemover]).subscribe(
      () => {
        this.livroProvider.deleteLivro(livroId).subscribe(
          (response) => {
            alert('Livro e relacionamentos excluídos com sucesso!');
            console.log('Resposta da API (sucesso):', response);
            this.carregarLivros();
          },
          (error) => {
            alert('Erro ao excluir o livro. Tente novamente.');
            console.error('Erro da API ao excluir livro:', error);
          }
        );
      },
      (error) => {
        alert('Erro ao excluir os relacionamentos do livro. Tente novamente.');
        console.error('Erro ao excluir relacionamentos:', error);
      }
    );
  }

  filtrarLivros(nome: string) {
    if (nome == '') {
      this.carregarLivros();
    } else {
      this.livroProvider.searchLivro(nome).subscribe(
        (response) => {
          console.log('Resposta da API (sucesso):', response);
          this.livros = response;
        },
        (error) => {
          alert('Erro ao buscar livro. Tente novamente.');
          console.error('Erro da API:', error);
        }
      );
    }
  }


  carregarLivros() {
    this.livroProvider.getLivro().subscribe((res) => {
      this.livros = res;
    });
  }

  fecharModal() {
    const modalElement = document.getElementById('modalLivro');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }
}
