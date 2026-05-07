package es.ujaen.librosApp.controller;

import es.ujaen.librosApp.Service.RelacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/relaciones")
public class RelacionController {
    @Autowired
    private RelacionService relacionService;

    @PostMapping("/seguir/{idSeguidor}/{idSeguido}")
    public ResponseEntity<?> seguir(@PathVariable int idSeguidor, @PathVariable int idSeguido) {
        try {
            relacionService.seguir(idSeguidor, idSeguido);
            return ResponseEntity.ok("Ahora sigues a este usuario.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/unfollow/{idSeguidor}/{idSeguido}")
    public ResponseEntity<?> unfollow(@PathVariable int idSeguidor, @PathVariable int idSeguido) {
        try {
            relacionService.dejarDeSeguir(idSeguidor, idSeguido);
            return ResponseEntity.ok("Has dejado de seguir a este usuario.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al dejar de seguir.");
        }
    }

    @GetMapping("/comprobar/{idSeguidor}/{idSeguido}")
    public ResponseEntity<Boolean> comprobar(@PathVariable int idSeguidor, @PathVariable int idSeguido) {
        return ResponseEntity.ok(relacionService.esSeguidor(idSeguidor, idSeguido));
    }
}
