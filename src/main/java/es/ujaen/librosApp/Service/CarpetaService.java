package es.ujaen.librosApp.Service;

import es.ujaen.librosApp.model.Carpeta;
import es.ujaen.librosApp.model.Libro;
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

    public Carpeta crear(Carpeta carpeta) {
        return carpetaRepository.save(carpeta);
    }

    public void eliminar(int id) {
        carpetaRepository.deleteById(id);
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