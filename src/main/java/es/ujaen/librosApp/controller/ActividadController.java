package es.ujaen.librosApp.controller;

import es.ujaen.librosApp.DTO.DTOActividad;
import es.ujaen.librosApp.Service.UsuarioService;
import es.ujaen.librosApp.model.Actividad;
import es.ujaen.librosApp.Service.ActividadService;
import es.ujaen.librosApp.model.Usuario;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/actividades")
@CrossOrigin(origins = "*")
public class ActividadController {

    @Autowired
    private ActividadService actividadService;

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/feed")
    public ResponseEntity<?> obtenerFeedSiguiendo(HttpSession session) {
        Usuario usuarioSesion = (Usuario) session.getAttribute("usuario");
        if (usuarioSesion == null) return ResponseEntity.status(401).body("No autenticado");

        Usuario usuario = usuarioService.obtenerPorId(usuarioSesion.getId());

        List<Integer> ids = usuario.getSiguiendo().stream()
                .map(relacion -> relacion.getSeguidos().getId())
                .collect(java.util.stream.Collectors.toList());

        if (ids.isEmpty()) return ResponseEntity.ok(List.of());

        return ResponseEntity.ok(
                actividadService.obtenerFeed(ids).stream()
                        .map(DTOActividad::new)
                        .toList()
        );
    }

    @GetMapping("/usuario/{id}")
    public ResponseEntity<?> obtenerPorUsuario(@PathVariable int id) {
        return ResponseEntity.ok(
                actividadService.obtenerPorUsuario(id).stream()
                        .map(DTOActividad::new)
                        .toList()
        );
    }

    @GetMapping("/progreso/{libroId}")
    public ResponseEntity<?> obtenerProgreso(@PathVariable int libroId, HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) return ResponseEntity.status(401).body("No autenticado");

        return ResponseEntity.ok(
                actividadService.obtenerUltimoProgreso(usuario.getId(), libroId)
        );
    }

    @PostMapping("/progreso")
    public ResponseEntity<?> guardarProgreso(@RequestBody ProgresoRequest request, HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) return ResponseEntity.status(401).body("No autenticado");

        actividadService.registrarProgreso(usuario, request.libroId(), request.titulo(), request.progreso());

        if (request.progreso() >= 100) {
            actividadService.registrarLibroAcabado(usuario, request.libroId(), request.titulo());
        }

        return ResponseEntity.ok().build();
    }

    record ProgresoRequest(int libroId, String titulo, double progreso) {}

}
