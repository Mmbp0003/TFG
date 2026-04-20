package es.ujaen.librosApp.Service;

import es.ujaen.librosApp.model.Libro;
import es.ujaen.librosApp.model.Resena;
import es.ujaen.librosApp.repository.LibroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LibroService {

    @Autowired
    private LibroRepository libroRepository;


    public List<Libro> obtenerTodos() {
        return libroRepository.findAll();
    }

    public Libro obtenerPorId(int id) {
        return libroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Libro no encontrado"));
    }

    // Asegurar que esto es para admin
    public Libro crear(Libro libro) {
        return libroRepository.save(libro);
    }

    // Solo Admin
    public void borrar(int id) {
        libroRepository.deleteById(id);
    }

    // --- FILTROS ---

    public List<Libro> buscarPorTitulo(String titulo) {
        return libroRepository.findByTituloContainingIgnoreCase(titulo);
    }

    public List<Libro> buscarPorGenero(String genero) {
        return libroRepository.findByGenerosNombreIgnoreCase(genero);
    }


    public double calcularNotaMedia(int libroId) {
        Libro libro = obtenerPorId(libroId);
        List<Resena> resenas = libro.getResenasLibro();


        if (resenas == null || resenas.isEmpty()) {
            return 0.0;
        }

        double suma = 0;
        for (Resena r : resenas) {
            suma += r.getPuntuacion(); // Asegúrate de tener getPuntuacion() en Resena
        }

        return Math.round((suma / resenas.size()) * 100.0) / 100.0;
    }
}
