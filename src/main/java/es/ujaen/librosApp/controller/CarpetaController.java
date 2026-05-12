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
import java.util.Map;

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
    public ResponseEntity<?> crear(@RequestBody Map<String, String> body, HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) {
            return ResponseEntity.status(401).body("No autenticado");
        }

        String nombre = body.get("nombre");
        if (nombre == null || nombre.isBlank()) {
            return ResponseEntity.badRequest().body("El nombre no puede estar vacío");
        }

        try {
            DTOCarpeta nueva = carpetaService.crear(nombre.trim(), usuario);
            return ResponseEntity.ok(nueva);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> borrar(@PathVariable int id, HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) {
            return ResponseEntity.status(401).body("No autenticado");
        }
        try {
            carpetaService.eliminarSiEsPropietario(id, usuario.getId());
            return ResponseEntity.ok().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Carpeta no encontrada");
        }
    }

    @PostMapping("/{carpetaId}/libros/{libroId}")
    public ResponseEntity<?> anadirLibro(@PathVariable int carpetaId, @PathVariable int libroId) {
        try {
            carpetaService.anadirLibro(carpetaId, libroId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(409).body(e.getMessage());
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