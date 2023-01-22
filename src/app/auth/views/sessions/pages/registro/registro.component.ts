import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Usuario } from '../../model/usuario';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit, OnDestroy {

  formularioRegister: FormGroup;

  usuarios!: Usuario[];
  usuarios$!: Observable<Usuario[]>;
  subscription!: Subscription;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ) {
    this.formularioRegister = new FormGroup({
      usuario: new FormControl('', [Validators.email, Validators.required]),
      contrasena: new FormControl('', [Validators.minLength(6), Validators.required,]),
      admin: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.usuarios$ = this.usuarioService.obtenerUsuarios();
    this.subscription = this.usuarios$.subscribe(
      (usuarios) => (this.usuarios = usuarios)
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  agregarUsuario() {
    let id: number = Math.max.apply(null,this.usuarios.map((o) => o.id));

    const usuario: Usuario = {
      id: id + 1,
      usuario: this.formularioRegister.value.usuario,
      contrasena: this.formularioRegister.value.contrasena,
      admin: this.formularioRegister.value.admin,
    };

    this.usuarioService.agregarUsuario(usuario);
    this.router.navigate(['/sessions/login'])
  }

  validacionRegistro() {
    const formUsuario = this.formularioRegister.value.usuario;
    const formPass = this.formularioRegister.value.contrasena;
    const encontrarUsuario = this.usuarios.find(
      (el) => el.usuario === formUsuario
    );
    if (encontrarUsuario === undefined) {
      this.agregarUsuario();
    } else {
      alert('el usuario ya existe');
    }
  }
}
