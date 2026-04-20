package es.ujaen.librosApp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
public class Carpeta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @NotBlank
    String nombre;

    //-----------------------------RELACIONES--------------------------------------------

    @ManyToMany
    @JoinTable(
            name = "carpeta_libro",
            joinColumns = @JoinColumn(name = "carpeta_id"),
            inverseJoinColumns = @JoinColumn(name = "libro_id")
    )
    private List<Libro> libros = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    //------------------------------CONSTRUCTORES--------------------------------------------

    public Carpeta(){ }

    public Carpeta(int id, String nombre){
        this.id = id;
        this.nombre = Objects.requireNonNull(nombre);
    }

    public Carpeta(String nombre){
        this(0,nombre);
    }

    //------------------------------GETTERS Y SETTERS--------------------------------------

    public int getId () { return  id; }

    public String getNombre () {return  nombre;}
    public void setNombre (String nombre) { this.nombre = nombre; }

    public void setLibros (List<Libro> libros) { this.libros = libros; }
    public List<Libro> getLibros () { return  libros; }

    public void setUsuario (Usuario usuario) { this.usuario = usuario; }
    public Usuario getUsuario () {return usuario;}
}
