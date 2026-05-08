package es.ujaen.librosApp.Service;

import es.ujaen.librosApp.DTO.DTOLibro;
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

    public List<Libro> buscarPorTituloOAutor(String query) {
        return libroRepository.findByTituloContainingIgnoreCaseOrAutorContainingIgnoreCase(query, query);
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

    private String normalizar(String s) {
        return java.text.Normalizer.normalize(s.toLowerCase().replace(" ", "_"),
                        java.text.Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
    }

    public List<DTOLibro> obtenerConFiltros(List<String> generos, List<String> tags,
                                            Double ratingMin, Integer paginasMin,
                                            Integer paginasMax, String orden) {
        List<Libro> todos = libroRepository.findAll();

        return todos.stream()
                // Filtro por géneros
                .filter(libro -> generos == null || generos.isEmpty() ||
                        libro.getGeneros().stream()
                                .anyMatch(g -> generos.contains(normalizar(g.getNombre()))))
                // Filtro por tags
                .filter(libro -> tags == null || tags.isEmpty() ||
                        libro.getTags().stream()
                                .anyMatch(t -> tags.contains(normalizar(t.getNombre()))))
                // Convertir a DTO con media
                .map(libro -> {
                    double media = libro.getResenasLibro().isEmpty() ? 0.0 :
                            Math.round(libro.getResenasLibro().stream()
                                    .mapToDouble(r -> r.getPuntuacion())
                                    .average().orElse(0.0) * 10.0) / 10.0;
                    return new DTOLibro(libro, media);
                })
                // Filtro por rating mínimo
                .filter(dto -> ratingMin == null || dto.getMediaResenas() >= ratingMin)
                // Filtro por páginas
                .filter(dto -> paginasMin == null || dto.getPaginas() >= paginasMin)
                .filter(dto -> paginasMax == null || dto.getPaginas() <= paginasMax)
                // Ordenar
                .sorted((a, b) -> switch (orden != null ? orden : "") {
                    case "rating_desc" -> Double.compare(b.getMediaResenas(), a.getMediaResenas());
                    case "rating_asc"  -> Double.compare(a.getMediaResenas(), b.getMediaResenas());
                    case "date_desc"   -> b.getFechaPublicacion().compareTo(a.getFechaPublicacion());
                    case "date_asc"    -> a.getFechaPublicacion().compareTo(b.getFechaPublicacion());
                    case "title_asc"   -> a.getTitulo().compareToIgnoreCase(b.getTitulo());
                    case "title_desc"  -> b.getTitulo().compareToIgnoreCase(a.getTitulo());
                    default            -> 0;
                })
                .toList();
    }
}
