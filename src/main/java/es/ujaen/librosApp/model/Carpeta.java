package es.ujaen.librosApp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;

import java.time.LocalDateTime;
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

    @NotNull
    private LocalDateTime fechaCreacion;

    @Column(nullable = false)
    private boolean Fijas = false;

    @Column(nullable = false)
    private String tipo = "CUSTOM";

    //-----------------------------RELACIONES--------------------------------------------
    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "carpeta_libro",
            joinColumns = @JoinColumn(name = "carpeta_id"),
            inverseJoinColumns = @JoinColumn(name = "libro_id")
    )
    private List<Libro> libros = new ArrayList<>();

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    //------------------------------CONSTRUCTORES--------------------------------------------

    public Carpeta(){ }

    public Carpeta(int id, String nombre, LocalDateTime fechaCreacion) {
        this.id = id;
        this.nombre = Objects.requireNonNull(nombre);
        this.fechaCreacion = LocalDateTime.now();
    }

    public Carpeta(String nombre,LocalDateTime fechaCreacion) {
        this(0,nombre,fechaCreacion);
    }

    //------------------------------GETTERS Y SETTERS--------------------------------------

    public int getId () { return  id; }

    public String getNombre () {return  nombre;}
    public void setNombre (String nombre) { this.nombre = nombre; }

    public void setLibros (List<Libro> libros) { this.libros = libros; }
    public List<Libro> getLibros () { return  libros; }

    public void setUsuario (Usuario usuario) { this.usuario = usuario; }
    public Usuario getUsuario () {return usuario;}

    public void setFechaCreacion (LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    public LocalDateTime getFechaCreacion () { return fechaCreacion; }

    public boolean getFijas() { return Fijas; }
    public void setFijas(boolean fijas) { Fijas = fijas; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
}
