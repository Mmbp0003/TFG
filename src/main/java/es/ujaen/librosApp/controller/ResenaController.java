package es.ujaen.librosApp.controller;

import es.ujaen.librosApp.DTO.DTOResena;
import es.ujaen.librosApp.model.Libro;
import es.ujaen.librosApp.model.Resena;
import es.ujaen.librosApp.Service.ResenaService;
import es.ujaen.librosApp.model.Usuario;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resenas")
public class ResenaController {

    @Autowired
    private ResenaService resenaService;

    @GetMapping("/libro/{libroId}")
    public List<DTOResena> obtenerDeLibro(@PathVariable int libroId) {
        return resenaService.obtenerPorLibro(libroId).stream()
                .map(DTOResena::new)
                .toList();
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<Resena> obtenerDeUsuario(@PathVariable int usuarioId) {
        return resenaService.obtenerPorUsuario(usuarioId);
    }

    @DeleteMapping("/{id}")
    public void borrar(@PathVariable int id) {
        resenaService.borrar(id);
    }

    @PutMapping("/{id}")
    public Resena modificar(@PathVariable int id,
                            @RequestParam Double puntuacion,
                            @RequestParam String contenido) {
        return resenaService.modificar(id, puntuacion, contenido);
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody ResenaRequest request, HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) return ResponseEntity.status(401).body("No autenticado");

        Libro libro = new Libro();
        libro.setId(request.libroId()); // solo necesitamos el id para la FK

        Resena resena = new Resena();
        resena.setUsuario(usuario);
        resena.setLibro(libro);
        resena.setPuntuacion(request.puntuacion());
        resena.setContenido(request.contenido());
        resena.setFechaCreacion(java.time.LocalDateTime.now());

        return ResponseEntity.ok(resenaService.crear(resena));
    }

    record ResenaRequest(int libroId, double puntuacion, String contenido) {}
}
