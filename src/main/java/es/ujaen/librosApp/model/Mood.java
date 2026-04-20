package es.ujaen.librosApp.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
public class Mood {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String nombre;

    //---------------------------------------RELACION---------------------------------
    @ManyToMany(mappedBy = "moods", fetch = FetchType.LAZY)
    private List<Libro> libros = new ArrayList<>();

    //Hago una tabla de libro mood? o solo funciona con una relacion many to many

    //------------------------------------CONSTRUCTORES----------------------------------

    public Mood () {}

    public Mood (int id, String nombre){
        this.id = id;
        this.nombre = Objects.requireNonNull(nombre);
    }

    public Mood (String nombre){
        this(0,nombre);
    }

    //----------------------------------------GETTERS Y SETTERS----------------------------------------

    public int getid() { return  id; }

    public void setNombre(String nombre){this.nombre = nombre;}
    public String getNombre() { return  nombre;}

    public void setLibros (List<Libro> libros) {this.libros = libros;}
    public List<Libro> getLibros () {return libros;}
}
