package es.ujaen.librosApp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Actividad {

    public enum TipoActividad {
        SEGUIMIENTO,
        LIBRO_ACABADO,
        RESENA,
        PROGRESO,
        COMENTARIO,
        CARPETA
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Enumerated(EnumType.STRING)
    private TipoActividad tipo;

    private Integer referenciaId; // libro, usuario, comentario

    private String textoReferencia; // título libro, nombre usuario

    private Double valor; // puntuación o progreso

    private LocalDateTime fecha;

    public Actividad() {
        this.fecha = LocalDateTime.now();
    }

    //--------------------------------RELACIONES--------------------------------------------------

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    //------------------------------------CONSTRUCTORES--------------------------------------------


    public Actividad(Usuario usuario, TipoActividad tipo, Integer referenciaId, String textoReferencia, Double valor) {
        this.usuario = usuario;
        this.tipo = tipo;
        this.referenciaId = referenciaId;
        this.textoReferencia = textoReferencia;
        this.valor = valor;
        this.fecha = LocalDateTime.now();
    }

    //----------------------------------------GETTERS Y SETTERS---------------------------------------------

    public int getId() { return id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public TipoActividad getTipo() { return tipo; }
    public void setTipo(TipoActividad tipo) { this.tipo = tipo; }

    public Integer getReferenciaId() { return referenciaId; }
    public void setReferenciaId(Integer referenciaId) { this.referenciaId = referenciaId; }

    public String getTextoReferencia() { return textoReferencia; }
    public void setTextoReferencia(String textoReferencia) { this.textoReferencia = textoReferencia; }

    public Double getValor() { return valor; }
    public void setValor(Double valor) { this.valor = valor; }

    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
}