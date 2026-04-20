package es.ujaen.librosApp.controller;

import es.ujaen.librosApp.model.Comentario;
import es.ujaen.librosApp.Service.ComentarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comentarios")
public class ComentarioController {

    @Autowired
    private ComentarioService comentarioService;

    @GetMapping("/resena/{resenaId}")
    public List<Comentario> obtenerDeResena(@PathVariable int resenaId) {
        return comentarioService.obtenerPorResena(resenaId);
    }

    @PostMapping
    public Comentario crear(@RequestBody Comentario comentario) {
        return comentarioService.crear(comentario);
    }

    @DeleteMapping("/{id}")
    public void borrar(@PathVariable int id) {
        comentarioService.borrar(id);
    }

    @PutMapping("/{id}")
    public Comentario modificar(@PathVariable int id, @RequestParam String contenido) {
        return comentarioService.modificar(id, contenido);
    }
}