package es.ujaen.librosApp.controller;

import es.ujaen.librosApp.DTO.DTOLibro;
import es.ujaen.librosApp.model.Libro;
import es.ujaen.librosApp.Service.LibroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/libros")
public class LibroController {

    @Autowired
    private LibroService libroService;

    @GetMapping
    public List<DTOLibro> obtenerTodos() {
        return libroService.obtenerTodos().stream()
                .map(l -> new DTOLibro(l, libroService.calcularNotaMedia(l.getId())))
                .toList();
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
    public List<DTOLibro> buscarPorTitulo(@RequestParam String titulo) {
        return libroService.buscarPorTitulo(titulo).stream()
                .map(l -> new DTOLibro(l, libroService.calcularNotaMedia(l.getId())))
                .toList();
    }

    @GetMapping("/buscarInteligente")
    public List<DTOLibro> buscarPorTituloAutor(@RequestParam String titulo) {
        return libroService.buscarPorTituloOAutor(titulo).stream()
                .map(l -> new DTOLibro(l, libroService.calcularNotaMedia(l.getId())))
                .toList();
    }

    @GetMapping("/genero/{genero}")
    public List<Libro> buscarPorGenero(@PathVariable String genero) {
        return libroService.buscarPorGenero(genero);
    }

   @GetMapping("/{id}/media")
    public double obtenerNotaMedia(@PathVariable int id) {
        return libroService.calcularNotaMedia(id);
    }

    @GetMapping("/filtrar")
    public List<DTOLibro> filtrar(
            @RequestParam(required = false) List<String> generos,
            @RequestParam(required = false) List<String> tags,
            @RequestParam(required = false) Double ratingMin,
            @RequestParam(required = false) Integer paginasMin,
            @RequestParam(required = false) Integer paginasMax,
            @RequestParam(required = false) String orden) {
        return libroService.obtenerConFiltros(generos, tags, ratingMin, paginasMin, paginasMax, orden);
    }

    @GetMapping("/generos")
    public ResponseEntity<List<String>> obtenerGeneros() {
        return ResponseEntity.ok(libroService.obtenerTodosLosGeneros());
    }

}
