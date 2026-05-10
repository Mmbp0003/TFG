package es.ujaen.librosApp.controller;

import es.ujaen.librosApp.Service.ActividadService;
import es.ujaen.librosApp.Service.RelacionService;
import es.ujaen.librosApp.Service.UsuarioService;
import es.ujaen.librosApp.model.Usuario;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/relaciones")
public class RelacionController {

    @Autowired private RelacionService relacionService;
    @Autowired private ActividadService actividadService;
    @Autowired private UsuarioService usuarioService;

    record SeguidoRequest(int seguidoId) {}

    @PostMapping("/seguir")
    public ResponseEntity<?> seguir(@RequestBody SeguidoRequest req, HttpSession session) {
        Usuario yo = (Usuario) session.getAttribute("usuario");
        if (yo == null) return ResponseEntity.status(401).body("No autenticado");

        try {
            Usuario seguido = usuarioService.obtenerPorId(req.seguidoId());
            relacionService.seguir(yo.getId(), req.seguidoId());
            // Registrar actividad: "Raul empezó a seguir a Ana"
            actividadService.registrarSeguimiento(yo, seguido);
            return ResponseEntity.ok("Ahora sigues a este usuario.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/dejar")
    public ResponseEntity<?> dejar(@RequestBody SeguidoRequest req, HttpSession session) {
        Usuario yo = (Usuario) session.getAttribute("usuario");
        if (yo == null) return ResponseEntity.status(401).body("No autenticado");

        try {
            relacionService.dejarDeSeguir(yo.getId(), req.seguidoId());
            return ResponseEntity.ok("Has dejado de seguir a este usuario.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al dejar de seguir.");
        }
    }

    @GetMapping("/comprobar/{idSeguido}")
    public ResponseEntity<Boolean> comprobar(@PathVariable int idSeguido, HttpSession session) {
        Usuario yo = (Usuario) session.getAttribute("usuario");
        if (yo == null) return ResponseEntity.status(401).body(false);
        return ResponseEntity.ok(relacionService.esSeguidor(yo.getId(), idSeguido));
    }
}