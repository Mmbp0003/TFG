package es.ujaen.librosApp.controller;

import es.ujaen.librosApp.DTO.DTOLogin;
import es.ujaen.librosApp.model.Usuario;
import es.ujaen.librosApp.Service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import org.springframework.validation.BindingResult;

import java.util.List;


@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public List<Usuario> obtenerTodos() {
        return usuarioService.obtenerTodos();
    }

    @GetMapping("/{id}")
    public Usuario obtenerPerfil(@PathVariable int id) {
        return usuarioService.obtenerPorId(id);
    }

    // GET: /api/usuarios/buscar?nombre=juan (Buscador de personas)
    @GetMapping("/buscar")
    public List<Usuario> buscarAmigos(@RequestParam String nombre) {
        return usuarioService.buscarPorNombre(nombre);
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@Valid @RequestBody Usuario usuario, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            String mensajeError = bindingResult.getAllErrors().get(0).getDefaultMessage();
            return ResponseEntity.status(400).body(mensajeError);
        }

        try {
            Usuario nuevoUsuario = usuarioService.registrar(usuario);
            return ResponseEntity.ok(nuevoUsuario);
        } catch (RuntimeException e) {

            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public void borrarCuenta(@PathVariable int id) {
        usuarioService.borrarCuenta(id);
    }

    @PostMapping("/login")
    public ResponseEntity<?> inicioSesion (@RequestBody DTOLogin dtoLogin){
        try{
            Usuario usuLogin = usuarioService.login(dtoLogin.getEmail(), dtoLogin.getClave());
            return  ResponseEntity.ok(usuLogin);
        } catch (RuntimeException e){
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}