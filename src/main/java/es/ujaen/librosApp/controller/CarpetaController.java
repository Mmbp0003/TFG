package es.ujaen.librosApp.controller;

import es.ujaen.librosApp.DTO.DTOCarpeta;
import es.ujaen.librosApp.DTO.DTOLibro;
import es.ujaen.librosApp.Service.LibroService;
import es.ujaen.librosApp.model.Carpeta;
import es.ujaen.librosApp.Service.CarpetaService;
import es.ujaen.librosApp.model.Usuario;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/carpetas")
public class CarpetaController {

    @Autowired
    private CarpetaService carpetaService;

    @Autowired
    private LibroService libroService;

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
    public ResponseEntity<?> anadirLibro(@PathVariable int carpetaId, @PathVariable int libroId) {
        try {
            carpetaService.anadirLibro(carpetaId, libroId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al añadir libro: " + e.getMessage());
        }
    }

    @DeleteMapping("/{carpetaId}/libros/{libroId}")
    public ResponseEntity<?> quitarLibro(@PathVariable int carpetaId, @PathVariable int libroId) {
        try {
            carpetaService.quitarLibro(carpetaId, libroId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al quitar libro: " + e.getMessage());
        }
    }

    @GetMapping("/mias")
    public List<DTOCarpeta> getMisCarpetas(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) {
            throw new RuntimeException("No autenticado");
        }

        return carpetaService.listarPorUsuario(usuario.getId()).stream()
                .map(carpeta -> {
                    List<DTOLibro> libros = carpeta.getLibros().stream()
                            .map(l -> new DTOLibro(l, libroService.calcularNotaMedia(l.getId())))
                            .toList();
                    return new DTOCarpeta(carpeta, libros);
                })
                .toList();
    }
}