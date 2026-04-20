package es.ujaen.librosApp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Entity
public class Relacion {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    int id;

    @Past
    @NotNull
    LocalDate fechaSeguimiento;

    //---------------------------------------------RELACIONES---------------------------------------------

    @ManyToOne
    @JoinColumn(name = "seguidor_id")
    private Usuario  seguidor;

    @ManyToOne
    @JoinColumn(name = "seguido_id")
    private Usuario  seguido;


    //------------------------------------------CONSTRUCTORES-------------------------------------------

    public Relacion(){

    }

    public Relacion (int id, LocalDate fechaSeguimiento){
        this.id = id;
        this.fechaSeguimiento = Objects.requireNonNull(fechaSeguimiento);
    }

    public Relacion (LocalDate fechaSeguimiento){
        this(0,fechaSeguimiento);
    }

    //------------------------------------GETTERS Y SETTERS---------------------------------------------

    public int getId () {return  id;}

    public void setFechaSeguimiento (LocalDate fechaSeguimiento){ this.fechaSeguimiento = fechaSeguimiento;}
    public LocalDate getFechaSeguimiento () {return  fechaSeguimiento;}

    public void setSeguidor( Usuario seguidor){this.seguidor = seguidor;}
    public Usuario seguidor () {return  seguidor;}

    public void setSeguidos (Usuario seguidos) {this.seguido = seguidos;}
    public Usuario getSeguidos () {return  seguido;}

}
