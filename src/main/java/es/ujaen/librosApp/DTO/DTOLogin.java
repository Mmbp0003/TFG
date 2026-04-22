package es.ujaen.librosApp.DTO;

public class DTOLogin {

    private String email;
    private String clave;

    public DTOLogin(){}

    public String getEmail() {
        return  email;
    }

    public void setEmail(String email){
        this.email = email;
    }

    public String getClave() {
        return clave;
    }

    public void setClave (String clave){
        this.clave = clave;
    }

}
