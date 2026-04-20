package es.ujaen.librosApp.controller;

import es.ujaen.librosApp.model.Carpeta;
import es.ujaen.librosApp.Service.CarpetaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/carpetas")
public class CarpetaController {

    @Autowired
    private CarpetaService carpetaService;

    @GetMapping("/usuario/{usuarioId}")
    public List<Carpeta> getCarpetas(@PathVariable int usuarioId) {
        return carpetaService.listarPorUsuario(usuarioId);
    }

    @PostMapping
    public Carpeta crear(@RequestBody Carpeta carpeta) {
        return carpetaService.crear(carpeta);
    }

    @DeleteMapping("/{id}")
    public void borrar(@PathVariable int id) {
        carpetaService.eliminar(id);
    }

    @PostMapping("/{carpetaId}/libros/{libroId}")
    public Carpeta anadirLibro(@PathVariable int carpetaId, @PathVariable int libroId) {
        return carpetaService.anadirLibro(carpetaId, libroId);
    }

    @DeleteMapping("/{carpetaId}/libros/{libroId}")
    public Carpeta quitarLibro(@PathVariable int carpetaId, @PathVariable int libroId) {
        return carpetaService.quitarLibro(carpetaId, libroId);
    }
}