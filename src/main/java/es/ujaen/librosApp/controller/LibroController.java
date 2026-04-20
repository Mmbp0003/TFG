package es.ujaen.librosApp.controller;

import es.ujaen.librosApp.model.Libro;
import es.ujaen.librosApp.Service.LibroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/libros")
public class LibroController {

    @Autowired
    private LibroService libroService;

    @GetMapping
    public List<Libro> obtenerTodos() {
        return libroService.obtenerTodos();
    }


    @GetMapping("/{id}")
    public Libro obtenerPorId(@PathVariable int id) {
        return libroService.obtenerPorId(id);
    }

    @PostMapping
    public Libro crear(@RequestBody Libro libro) {
        return libroService.crear(libro);
    }

    @DeleteMapping("/{id}")
    public void borrar(@PathVariable int id) {
        libroService.borrar(id);
    }

    @GetMapping("/buscar")
    public List<Libro> buscarPorTitulo(@RequestParam String titulo) {
        return libroService.buscarPorTitulo(titulo);
    }

    @GetMapping("/genero/{genero}")
    public List<Libro> buscarPorGenero(@PathVariable String genero) {
        return libroService.buscarPorGenero(genero);
    }

   @GetMapping("/{id}/media")
    public double obtenerNotaMedia(@PathVariable int id) {
        return libroService.calcularNotaMedia(id);
    }
}
