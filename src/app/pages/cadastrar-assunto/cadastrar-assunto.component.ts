import { AssuntoProvider } from './../../providers/assunto/assunto.provider';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


declare var bootstrap: any;
@Component({
  selector: 'app-cadastrar-assunto',
  templateUrl: './cadastrar-assunto.component.html',
  styleUrls: ['./cadastrar-assunto.component.scss']
})
export class CadastrarAssuntoComponent implements OnInit {

  formulario!: FormGroup;
  assunto = [];
  assuntoSelecionado: any;
  formularioEdicao!: FormGroup;
  constructor(
    private form: FormBuilder,
    private assuntoProvider: AssuntoProvider
  ) {}
  ngOnInit(): void {
    this.intanciarFormulario();
    this.getAssuntos();
  }

  intanciarFormulario() {
    this.formulario = this.form.group({
      descricao: [
        '',
        [Validators.required, Validators.maxLength(20)], // Validações: obrigatório e máximo de 40 caracteres
      ],
    });

    this.formularioEdicao = this.form.group({
      descricao: ['', [Validators.required, Validators.maxLength(20)]],
    });
  }

  getAssuntos() {
    this.assuntoProvider.getAssunto().subscribe((data) => {
      this.assunto = data;
    });
  }

  onSubmit() {
    if (this.formulario.valid) {
      const campo = this.formulario.controls.descricao;
      const assunto = campo.value;

      this.assuntoProvider.createAssunto(assunto).subscribe(
        (response) => {
          alert('Assunto cadastrado com sucesso!');
          console.log('Resposta da API (sucesso):', response);
          this.getAssuntos();
          campo.reset();
        },
        (error) => {
          alert('Erro ao cadastrar o assunto. Tente novamente.');
          console.error('Erro da API:', error);
        }
      );
    } else {
      alert('Por favor, corrija os erros no formulário.');
    }
  }

  excluirAssunto(item: number): void {
    this.assuntoProvider.deleteAssunto(item).subscribe(
      (response) => {
        alert('Assunto excluido com sucesso!');
        console.log('Resposta da API (sucesso):', response);
        this.getAssuntos();
      },
      (error) => {
        alert('Erro ao excluir o assunto. Tente novamente.');
        console.error('Erro da API:', error);
      }
    );
  }

  filtrarAssunto(descricao: string) {
    if (descricao == '') {
      this.getAssuntos();
    } else {
      this.assuntoProvider.searchAssunto(descricao).subscribe(
        (response) => {
          console.log('Resposta da API (sucesso):', response);
          this.assunto = response;
        },
        (error) => {
          alert('Erro ao buscar o assunto. Tente novamente.');
          console.error('Erro da API:', error);
        }
      );
    }
  }

  editarAssunto(assunto: any) {
    console.log(assunto);
    this.assuntoSelecionado = assunto;
    this.formularioEdicao.setValue({ descricao: assunto.descricao });

    // Exibe o modal de edição
    const modalElement = document.getElementById('modalEdicao');
    const modal = new bootstrap.Modal(modalElement!);
    modal.show();
  }

  salvarEdicao() {
    if (this.assuntoSelecionado) {
      this.assuntoSelecionado.descricao = this.formularioEdicao.value.descricao;
      this.assuntoProvider.putAssunto(this.assuntoSelecionado).subscribe(
        (response) => {
          console.log('Resposta da API (sucesso):', response);
          this.getAssuntos();
        },
        (error) => {
          alert('Erro ao editar o assunto. Tente novamente.');
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
