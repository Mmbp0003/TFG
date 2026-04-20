package es.ujaen.librosApp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Objects;

@Entity
public class Comentario {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    int id;

    @NotBlank
    @Size(max=1000)
    String contenido;

    //--------------------------------------RELACIONES----------------------------------------------------
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "resena_id")
    Resena resena;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    Usuario usuario;

    //-----------------------------------CONSTRUCTORES----------------------------------------------

    public Comentario() {}

    public Comentario(int id, String contenido){
        this.id = id;
        this.contenido = Objects.requireNonNull(contenido);
    }

    public Comentario(String contenido){
        this(0,contenido);
    }

    //------------------------------------GETTERS Y SETTERS-------------------------------------------

    public int getId (){return id;}

    public void setContenido (String contenido ){ this.contenido = contenido; }
    public String getContenido (){return  contenido;}

    public void setResena(Resena resena) {this.resena = resena;}
    public Resena getResena() {return  resena;}

    public void setUsuario (Usuario usuario){ this.usuario = usuario; }
    public Usuario getUsuario () {return usuario;}
}
