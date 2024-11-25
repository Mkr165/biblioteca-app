import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CadastrarAutorComponent } from './cadastrar-autor/cadastrar-autor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { LayoutModule } from "../shared/layout/layout.module";
import { HttpClientModule } from '@angular/common/http';
import { CadastrarLivroComponent } from './cadastrar-livro/cadastrar-livro.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { CadastrarAssuntoComponent } from './cadastrar-assunto/cadastrar-assunto.component';


@NgModule({
  declarations: [
    CadastrarAutorComponent,
    CadastrarLivroComponent,
    CadastrarAssuntoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    LayoutModule,
    HttpClientModule,
    NgxMaskModule.forRoot()

]
})
export class PagesModule { }
