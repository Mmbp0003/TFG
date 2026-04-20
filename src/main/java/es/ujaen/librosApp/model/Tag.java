package es.ujaen.librosApp.model;

import jakarta.persistence.*;
import org.aspectj.apache.bcel.generic.TABLESWITCH;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String nombre;

    //----------------------------------RELACIONES-------------------------------------------------------

    @ManyToMany(mappedBy = "tags", fetch = FetchType.LAZY)
    private List<Libro> libros = new ArrayList<>();

    //---------------------------------------CONSTRUCTORES------------------------------------------------------

    public Tag(){ }

    public Tag (int id, String nombre ){
        this.id = id;
        this.nombre = Objects.requireNonNull(nombre);
    }

    public Tag (String nombre){
        this(0,nombre);
    }

    // --------------------------------------GETTERS Y SETTERS----------------------------------------------

    public int getid() { return  id; }

    public void setNombre(String nombre){this.nombre = nombre;}
    public String getNombre() { return  nombre;}

    public void setLibros (List<Libro> libros) {this.libros = libros;}
    public List<Libro> getLibros () {return  libros;}
}
