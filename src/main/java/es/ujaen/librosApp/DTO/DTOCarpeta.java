package es.ujaen.librosApp.DTO;

import es.ujaen.librosApp.model.Carpeta;
import java.util.List;

public class DTOCarpeta {
    private int id;
    private String nombre;
    private String tipo;
    private boolean fijas;
    private List<DTOLibro> libros;

    public DTOCarpeta(Carpeta carpeta, List<DTOLibro> libros) {
        this.id = carpeta.getId();
        this.nombre = carpeta.getNombre();
        this.tipo = carpeta.getTipo();
        this.fijas = carpeta.getFijas();
        this.libros = libros;
    }

    public int getId() { return id; }
    public String getNombre() { return nombre; }
    public String getTipo() { return tipo; }
    public boolean isFijas() { return fijas; }
    public List<DTOLibro> getLibros() { return libros; }
}