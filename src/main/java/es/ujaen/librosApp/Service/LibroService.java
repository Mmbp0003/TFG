package es.ujaen.librosApp.Service;

import es.ujaen.librosApp.DTO.DTOLibro;
import es.ujaen.librosApp.model.*;
import es.ujaen.librosApp.repository.ActividadRepository;
import es.ujaen.librosApp.repository.GeneroRepository;
import es.ujaen.librosApp.repository.LibroRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LibroService {

    @Autowired
    private LibroRepository libroRepository;

    @Autowired
    private GeneroRepository generoRepository;

    @Autowired
    private ActividadRepository actividadRepository;

    @Cacheable("libros")
    public List<Libro> obtenerTodos() {
        List<Libro> libros = libroRepository.findAllConGeneros();
        return libroRepository.findAllConTags(libros);
    }


    public Libro obtenerPorId(int id) {
        return libroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Libro no encontrado"));
    }

    // Asegurar que esto es para admin
    @CacheEvict(value = "libros", allEntries = true)
    public Libro crear(Libro libro) {
        if (libro.getGeneros() != null && !libro.getGeneros().isEmpty()) {
            List<Genero> generosReales = libro.getGeneros().stream()
                    .map(g -> generoRepository.findById(g.getid())
                            .orElseThrow(() -> new RuntimeException("Género no encontrado: " + g.getid())))
                    .collect(Collectors.toList());
            libro.setGeneros(generosReales);
        }
        return libroRepository.save(libro);
    }

    // Solo Admin
    @CacheEvict(value = "libros", allEntries = true)
    @Transactional
    public void borrar(int id) {
        Libro libro = libroRepository.findById(id).orElseThrow(() -> new RuntimeException("Libro no encontrado"));

        for (Carpeta carpeta : libro.getCarpetas()) {
            carpeta.getLibros().remove(libro);
        }
        libro.getCarpetas().clear();

        for (Usuario usuario : libro.getUsuarios()) {
            usuario.getLibrosGuardados().remove(libro);
        }
        libro.getUsuarios().clear();

        actividadRepository.deleteByReferenciaId(id);
        libroRepository.delete(libro);
    }

    @Transactional
    @CacheEvict(value = "libros", allEntries = true)
    public Libro modificar(int id, Libro datos) {
        Libro libro = obtenerPorId(id);
        libro.setTitulo(datos.getTitulo());
        libro.setAutor(datos.getAutor());
        libro.setSinopis(datos.getSinopis());
        libro.setPaginas(datos.getPaginas());
        libro.setFechaPublicacion(datos.getFechaPublicacion());
        if (datos.getPortada() != null && !datos.getPortada().isBlank()) {
            libro.setPortada(datos.getPortada());
        }

        // Actualizar géneros
        if (datos.getGeneros() != null) {
            List<Genero> generosReales = datos.getGeneros().stream()
                    .map(g -> generoRepository.findById(g.getid())
                            .orElseThrow(() -> new RuntimeException("Género no encontrado: " + g.getid())))
                    .collect(Collectors.toList());
            libro.setGeneros(generosReales);
        }

        return libroRepository.save(libro);
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

    public List<String> obtenerTodosLosGeneros() {
        return generoRepository.findAll().stream().map(Genero::getNombre).sorted().toList();
    }


    public double calcularNotaMedia(int libroId) {
        return obtenerPorId(libroId).getMediaValoracion();
    }

    private String normalizar(String s) {
        return java.text.Normalizer.normalize(s.toLowerCase().replace(" ", "_"),
                        java.text.Normalizer.Form.NFD).replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
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
                .map(libro -> new DTOLibro(libro, libro.getMediaValoracion()))
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
