package es.ujaen.librosApp.DTO;

import es.ujaen.librosApp.model.Actividad;

public class DTOActividad {
    private int id;
    private String tipo;
    private Integer referenciaId;
    private String textoReferencia;
    private Double valor;
    private String fecha;
    private String nombreUsuario;
    private int usuarioId;

    public DTOActividad(Actividad a) {
        this.id = a.getId();
        this.tipo = a.getTipo().name();
        this.referenciaId = a.getReferenciaId();
        this.textoReferencia = a.getTextoReferencia();
        this.valor = a.getValor();
        this.fecha = a.getFecha().toString();
        this.nombreUsuario = a.getUsuario().getNombre() + " " + a.getUsuario().getApellidos();
        this.usuarioId = a.getUsuario().getId();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Integer getReferenciaId() {
        return referenciaId;
    }

    public void setReferenciaId(Integer referenciaId) {
        this.referenciaId = referenciaId;
    }

    public String getTextoReferencia() {
        return textoReferencia;
    }

    public void setTextoReferencia(String textoReferencia) {
        this.textoReferencia = textoReferencia;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public int getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(int usuarioId) {
        this.usuarioId = usuarioId;
    }
}