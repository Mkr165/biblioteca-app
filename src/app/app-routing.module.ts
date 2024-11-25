import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadastrarAutorComponent } from './pages/cadastrar-autor/cadastrar-autor.component';
import { CadastrarLivroComponent } from './pages/cadastrar-livro/cadastrar-livro.component';
import { CadastrarAssuntoComponent } from './pages/cadastrar-assunto/cadastrar-assunto.component';

const routes: Routes = [

  { path: 'cadastrar-autor', component: CadastrarAutorComponent, data: { name: 'Cadastrar Autor' } },
  { path: 'cadastrar-livro', component: CadastrarLivroComponent, data: { name: 'Cadastrar Livro' } },
  { path: 'cadastrar-assunto', component: CadastrarAssuntoComponent, data: { name: 'Cadastrar Assunto' } },

  {
    path: '',
    redirectTo: '/cadastrar-autor',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/cadastrar-autor'
  }

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
