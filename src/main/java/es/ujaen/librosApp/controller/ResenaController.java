package es.ujaen.librosApp.controller;

import es.ujaen.librosApp.model.Resena;
import es.ujaen.librosApp.Service.ResenaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resenas")
public class ResenaController {

    @Autowired
    private ResenaService resenaService;

    @GetMapping("/libro/{libroId}")
    public List<Resena> obtenerDeLibro(@PathVariable int libroId) {
        return resenaService.obtenerPorLibro(libroId);
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<Resena> obtenerDeUsuario(@PathVariable int usuarioId) {
        return resenaService.obtenerPorUsuario(usuarioId);
    }

    @PostMapping
    public Resena crear(@RequestBody Resena resena) {
        return resenaService.crear(resena);
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
}
