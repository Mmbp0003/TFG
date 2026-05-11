package es.ujaen.librosApp.Service;

import es.ujaen.librosApp.DTO.DTOCarpeta;
import es.ujaen.librosApp.model.Carpeta;
import es.ujaen.librosApp.model.Libro;
import es.ujaen.librosApp.model.Usuario;
import es.ujaen.librosApp.repository.CarpetaRepository;
import es.ujaen.librosApp.repository.LibroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CarpetaService {

    @Autowired
    private CarpetaRepository carpetaRepository;

    @Autowired
    private LibroRepository libroRepository;

    @Autowired
    private ActividadService actividadService;

    public List<Carpeta> listarPorUsuario(int usuarioId) {
        return carpetaRepository.findByUsuarioId(usuarioId);
    }

    public DTOCarpeta crear(String nombre, Usuario usuario) {
        // Comprobar nombre duplicado para este usuario
        boolean existe = carpetaRepository.findByUsuarioId(usuario.getId())
                .stream()
                .anyMatch(c -> c.getNombre().equalsIgnoreCase(nombre));

        if (existe) {
            throw new IllegalArgumentException("Ya tienes una lista con ese nombre");
        }

        Carpeta carpeta = new Carpeta();
        carpeta.setNombre(nombre);
        carpeta.setUsuario(usuario);
        carpeta.setFechaCreacion(java.time.LocalDateTime.now());
        carpeta.setTipo("CUSTOM");

        Carpeta guardada = carpetaRepository.save(carpeta);
        return new DTOCarpeta(guardada, List.of());
    }

    public void eliminarSiEsPropietario(int carpetaId, int usuarioId) {
        Carpeta carpeta = carpetaRepository.findById(carpetaId)
                .orElseThrow(() -> new RuntimeException("Carpeta no encontrada"));

        if (carpeta.getUsuario().getId() != usuarioId) {
            throw new SecurityException("No tienes permiso para eliminar esta carpeta");
        }

        if (carpeta.getFijas()) {
            throw new SecurityException("Las carpetas predeterminadas no se pueden eliminar");
        }

        carpeta.getLibros().clear();
        carpetaRepository.save(carpeta);
        carpetaRepository.deleteById(carpetaId);
    }

    // Lógica para añadir un libro a una carpeta
    public Carpeta anadirLibro(int carpetaId, int libroId) {
        Carpeta carpeta = carpetaRepository.findById(carpetaId).orElseThrow();
        Libro libro = libroRepository.findById(libroId).orElseThrow();

        carpeta.getLibros().add(libro);
        Carpeta guardada = carpetaRepository.save(carpeta);

        actividadService.registrarCarpeta(carpeta.getUsuario(), libro.getTitulo(), carpeta.getNombre());

        return guardada;
    }

    public Carpeta quitarLibro(int carpetaId, int libroId) {
        Carpeta carpeta = carpetaRepository.findById(carpetaId).orElseThrow();
        Libro libro = libroRepository.findById(libroId).orElseThrow();

        carpeta.getLibros().remove(libro);
        return carpetaRepository.save(carpeta);
    }


}