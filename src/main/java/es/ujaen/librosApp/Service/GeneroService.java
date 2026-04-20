package es.ujaen.librosApp.Service;

import es.ujaen.librosApp.model.Genero;
import es.ujaen.librosApp.repository.GeneroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GeneroService {

    @Autowired
    private GeneroRepository generoRepository;

    public List<Genero> obtenerTodos() {
        return generoRepository.findAll();
    }

    //Solo para admin
    public Genero crear(Genero genero) {
        return generoRepository.save(genero);
    }

    //Solo para admn
    public void borrar(int id) {
        generoRepository.deleteById(id);
    }
}