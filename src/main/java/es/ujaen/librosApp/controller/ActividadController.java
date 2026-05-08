package es.ujaen.librosApp.controller;

import es.ujaen.librosApp.DTO.DTOActividad;
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

    @GetMapping("/feed")
    public ResponseEntity<?> obtenerFeedSiguiendo(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) return ResponseEntity.status(401).body("No autenticado");

        // Sacar los ids de los usuarios que sigo
        List<Integer> ids = usuario.getSiguiendo().stream()
                .map(relacion -> relacion.getSeguidos().getId())
                .collect(java.util.stream.Collectors.toList());

        if (ids.isEmpty()) return ResponseEntity.ok(List.of());

        return ResponseEntity.ok(actividadService.obtenerFeed(ids));
    }

    @GetMapping("/usuario/{id}")
    public ResponseEntity<?> obtenerPorUsuario(@PathVariable int id) {
        return ResponseEntity.ok(
                actividadService.obtenerPorUsuario(id).stream()
                        .map(DTOActividad::new)
                        .toList()
        );
    }
}
