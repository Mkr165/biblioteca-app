import { AutorProvider } from './../../providers/autor/autor.provider';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-cadastrar-autor',
  templateUrl: './cadastrar-autor.component.html',
  styleUrls: ['./cadastrar-autor.component.scss'],
})
export class CadastrarAutorComponent implements OnInit {
  formulario!: FormGroup;
  autores = [];
  autorSelecionado: any;
  formularioEdicao!: FormGroup;
  constructor(
    private form: FormBuilder,
    private autorProvider: AutorProvider
  ) {}
  ngOnInit(): void {
    this.intanciarFormulario();
    this.getAutores();
  }

  intanciarFormulario() {
    this.formulario = this.form.group({
      nome: [
        '',
        [Validators.required, Validators.maxLength(40)], // Validações: obrigatório e máximo de 40 caracteres
      ],
    });

    this.formularioEdicao = this.form.group({
      nome: ['', [Validators.required, Validators.maxLength(40)]],
    });
  }

  getAutores() {
    this.autorProvider.getAutor().subscribe((data) => {
      this.autores = data;
    });
  }

  onSubmit() {
    if (this.formulario.valid) {
      const campo = this.formulario.controls.nome;
      const autor = campo.value;

      this.autorProvider.createAutor(autor).subscribe(
        (response) => {
          alert('Autor cadastrado com sucesso!');
          console.log('Resposta da API (sucesso):', response);
          this.getAutores();
          campo.reset();
        },
        (error) => {
          alert('Erro ao cadastrar o autor. Tente novamente.');
          console.error('Erro da API:', error);
        }
      );
    } else {
      alert('Por favor, corrija os erros no formulário.');
    }
  }

  excluirAutor(item: number): void {
    this.autorProvider.deleteAutor(item).subscribe(
      (response) => {
        alert('Autor excluido com sucesso!');
        console.log('Resposta da API (sucesso):', response);
        this.getAutores();
      },
      (error) => {
        alert('Erro ao excluir o autor. Tente novamente.');
        console.error('Erro da API:', error);
      }
    );
  }

  filtrarAutor(nome: string) {
    if (nome == '') {
      this.getAutores();
    } else {
      this.autorProvider.searchAutor(nome).subscribe(
        (response) => {
          console.log('Resposta da API (sucesso):', response);
          this.autores = response;
        },
        (error) => {
          alert('Erro ao excluir o autor. Tente novamente.');
          console.error('Erro da API:', error);
        }
      );
    }
  }

  editarAutor(autor: any) {
    console.log(autor);
    this.autorSelecionado = autor;
    this.formularioEdicao.setValue({ nome: autor.nome });

    // Exibe o modal de edição
    const modalElement = document.getElementById('modalEdicao');
    const modal = new bootstrap.Modal(modalElement!);
    modal.show();
  }

  salvarEdicao() {
    if (this.autorSelecionado) {
      this.autorSelecionado.nome = this.formularioEdicao.value.nome;
      this.autorProvider.putAutor(this.autorSelecionado).subscribe(
        (response) => {
          console.log('Resposta da API (sucesso):', response);
          this.getAutores();
        },
        (error) => {
          alert('Erro ao editar o autor. Tente novamente.');
          console.error('Erro da API:', error);
        }
      );

      // Fecha o modal
      const modalElement = document.getElementById('modalEdicao');
      const modal = bootstrap.Modal.getInstance(modalElement!);
      modal.hide();
    }
  }
}
