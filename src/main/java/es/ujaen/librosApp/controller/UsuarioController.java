package es.ujaen.librosApp.controller;

import es.ujaen.librosApp.DTO.DTOLogin;
import es.ujaen.librosApp.DTO.DTOPerfil;
import es.ujaen.librosApp.DTO.DTOUsuario;
import es.ujaen.librosApp.model.Usuario;
import es.ujaen.librosApp.Service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import org.springframework.validation.BindingResult;

import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.Collections;


@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<DTOUsuario>> obtenerTodos() {
        List<DTOUsuario> dtos = usuarioService.obtenerTodos().stream()
                .map(DTOUsuario::new)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DTOPerfil> obtenerPerfil(@PathVariable int id) {
        DTOPerfil perfilDTO = usuarioService.obtenerPerfilDTO(id); // El método que creamos antes
        return ResponseEntity.ok(perfilDTO);
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

    @PostMapping
    public ResponseEntity<?> crearUsuarioPorAdmin(@Valid @RequestBody Usuario usuario,
                                                  BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            String mensajeError = bindingResult.getAllErrors().get(0).getDefaultMessage();
            return ResponseEntity.status(400).body(mensajeError);
        }
        try {
            Usuario creado = usuarioService.registrar(usuario);
            return ResponseEntity.status(201).body(new DTOUsuario(creado));
        } catch (RuntimeException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public void borrarCuenta(@PathVariable int id) {
        usuarioService.borrarCuenta(id);
    }


    @PostMapping("/login")
    public ResponseEntity<?> inicioSesion(@RequestBody DTOLogin dtoLogin,
                                          HttpServletRequest request,
                                          HttpServletResponse response) {
        try {
            Usuario usuLogin = usuarioService.login(dtoLogin.getEmail(), dtoLogin.getClave());

            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    usuLogin.getEmail(),
                    null,
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + usuLogin.getRol()))
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            new HttpSessionSecurityContextRepository()
                    .saveContext(SecurityContextHolder.getContext(), request, response);


            request.getSession().setAttribute("usuario", usuLogin);

            return ResponseEntity.ok(new DTOUsuario(usuLogin));

        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> usuarioActual(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (usuario == null) {
            return ResponseEntity.status(401).body("No autenticado");
        }

        return ResponseEntity.ok(new DTOUsuario(usuario));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> cerrarSesion(HttpSession session) {
        session.invalidate(); // Destruye la sesión del servidor
        return ResponseEntity.ok("Sesión cerrada");
    }

}