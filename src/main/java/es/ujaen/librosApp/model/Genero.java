package es.ujaen.librosApp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
public class Genero {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String nombre;

    //--------------------------------RELACIONES--------------------------------------------------

    @JsonIgnore
    @ManyToMany(mappedBy = "generos", fetch = FetchType.LAZY)
    private List<Libro> libros = new ArrayList<>();

    //------------------------------------CONSTRUCTORES--------------------------------------------

    public Genero(){}

    public Genero(int id, String nombre){
        this.id = id;
        this.nombre = Objects.requireNonNull(nombre);
    }

    public Genero (String nombre){
        this(0,nombre);
    }

    //----------------------------------------GETTERS Y SETTERS---------------------------------------------

    @JsonProperty("id")
    public int getid() { return  id; }
    public void setId(int id) { this.id = id; }

    public void setNombre(String nombre){this.nombre = nombre;}
    public String getNombre() { return  nombre;}

    public void setLibros(List<Libro> libros) { this.libros = libros; }
    public List<Libro> getLibros() { return libros; }
}
