package es.ujaen.librosApp.DTO;

import es.ujaen.librosApp.model.Libro;
import java.util.List;

public class DTOLibro {
    private int id;
    private String portada;
    private String titulo;
    private String autor;
    private String sinopis;
    private int paginas;
    private String fechaPublicacion;
    private double mediaResenas;
    private List<String> generos;
    private List<String> tags;

    public DTOLibro(Libro libro, double media) {
        this.id = libro.getId();
        this.portada = libro.getPortada();
        this.titulo = libro.getTitulo();
        this.autor = libro.getAutor();
        this.sinopis = libro.getSinopis();
        this.paginas = libro.getPaginas();
        this.fechaPublicacion = libro.getFechaPublicacion().toString();
        this.mediaResenas = media;
        this.generos = libro.getGeneros().stream()
                .map(g -> g.getNombre()).toList();
        this.tags = libro.getTags().stream()
                .map(t -> t.getNombre()).toList();
    }

    public int getId() { return id; }
    public String getPortada() { return portada; }
    public String getTitulo() { return titulo; }
    public String getAutor() { return autor; }
    public String getSinopis() { return sinopis; }
    public int getPaginas() { return paginas; }
    public String getFechaPublicacion() { return fechaPublicacion; }
    public double getMediaResenas() { return mediaResenas; }
    public List<String> getGeneros() { return generos; }
    public List<String> getTags() { return tags; }
}
