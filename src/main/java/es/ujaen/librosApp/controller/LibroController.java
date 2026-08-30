package es.ujaen.librosApp.controller;

import es.ujaen.librosApp.DTO.DTOLibro;
import es.ujaen.librosApp.model.Libro;
import es.ujaen.librosApp.Service.LibroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;


@RestController
@RequestMapping("/api/libros")
public class LibroController {

    @Value("${app.upload.dir}")
    private String uploadDir;


    @Autowired
    private LibroService libroService;

    @GetMapping
    public List<DTOLibro> obtenerTodos() {
        return libroService.obtenerTodos().stream()
                .map(l -> new DTOLibro(l, libroService.calcularNotaMedia(l.getId())))
                .toList();
    }


    @GetMapping("/{id}")
    public DTOLibro obtenerPorId(@PathVariable int id) {
        Libro libro = libroService.obtenerPorId(id);
        return new DTOLibro(libro, libroService.calcularNotaMedia(id));
    }

    @PostMapping
    public Libro crear(@RequestBody Libro libro) {
        return libroService.crear(libro);
    }

    @DeleteMapping("/{id}")
    public void borrar(@PathVariable int id) {
        libroService.borrar(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> modificar(@PathVariable int id, @RequestBody Libro libro) {
        try {
            Libro actualizado = libroService.modificar(id, libro);
            return ResponseEntity.ok(new DTOLibro(actualizado, libroService.calcularNotaMedia(id)));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
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

    @PostMapping("/upload-portada")
    public ResponseEntity<String> subirPortada(@RequestParam("file") MultipartFile file, @RequestParam("titulo") String titulo) {
        try {
            String extension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
            String nombreArchivo = "portada_" + titulo.replaceAll("[^a-zA-Z0-9]", "_") + extension;
            Path ruta = Paths.get(uploadDir).resolve(nombreArchivo);
            Files.copy(file.getInputStream(), ruta, StandardCopyOption.REPLACE_EXISTING);
            return ResponseEntity.ok(nombreArchivo);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al subir la imagen");
        }
    }

}
