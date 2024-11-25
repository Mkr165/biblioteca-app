import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConteudoComponent } from './conteudo/conteudo.component';
import { TabelaComponent } from './tabela/tabela.component';
import { FormsModule } from '@angular/forms';
import { MenuLateralComponent } from './menu-lateral/menu-lateral.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ConteudoComponent,
    TabelaComponent,
    MenuLateralComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports:[ConteudoComponent,TabelaComponent,MenuLateralComponent]
})
export class LayoutModule { }
