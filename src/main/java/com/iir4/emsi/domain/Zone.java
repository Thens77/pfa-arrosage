package com.iir4.emsi.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Zone.
 */
@Entity
@Table(name = "zone")
public class Zone implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "libelle")
    private String libelle;

    @Column(name = "superficie")
    private Double superficie;

    @Column(name = "nbr_max_plante")
    private Integer nbrMaxPlante;

    @Lob
    @Column(name = "photo")
    private byte[] photo;

    @Column(name = "photo_content_type")
    private String photoContentType;

    @OneToMany(mappedBy = "zone")
    @JsonIgnoreProperties(value = { "zone" }, allowSetters = true)
    private Set<Arrosage> arrosages = new HashSet<>();

    @OneToMany(mappedBy = "zone")
    @JsonIgnoreProperties(value = { "plante", "zone" }, allowSetters = true)
    private Set<Plantation> plantations = new HashSet<>();

    @OneToMany(mappedBy = "zone")
    @JsonIgnoreProperties(value = { "zone" }, allowSetters = true)
    private Set<Grandeur> grandeurs = new HashSet<>();

    @ManyToOne
    private TypeSol typesol;

    @ManyToOne
    @JsonIgnoreProperties(value = { "zones", "user" }, allowSetters = true)
    private EspaceVert espaceVert;

    @ManyToOne
    @JsonIgnoreProperties(value = { "zones", "connectes", "installation" }, allowSetters = true)
    private Boitier boitier;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Zone id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLibelle() {
        return this.libelle;
    }

    public Zone libelle(String libelle) {
        this.setLibelle(libelle);
        return this;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public Double getSuperficie() {
        return this.superficie;
    }

    public Zone superficie(Double superficie) {
        this.setSuperficie(superficie);
        return this;
    }

    public void setSuperficie(Double superficie) {
        this.superficie = superficie;
    }

    public Integer getNbrMaxPlante() {
        return this.nbrMaxPlante;
    }

    public Zone nbrMaxPlante(Integer nbrMaxPlante) {
        this.setNbrMaxPlante(nbrMaxPlante);
        return this;
    }

    public void setNbrMaxPlante(Integer nbrMaxPlante) {
        this.nbrMaxPlante = nbrMaxPlante;
    }

    public byte[] getPhoto() {
        return this.photo;
    }

    public Zone photo(byte[] photo) {
        this.setPhoto(photo);
        return this;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    public String getPhotoContentType() {
        return this.photoContentType;
    }

    public Zone photoContentType(String photoContentType) {
        this.photoContentType = photoContentType;
        return this;
    }

    public void setPhotoContentType(String photoContentType) {
        this.photoContentType = photoContentType;
    }

    public Set<Arrosage> getArrosages() {
        return this.arrosages;
    }

    public void setArrosages(Set<Arrosage> arrosages) {
        if (this.arrosages != null) {
            this.arrosages.forEach(i -> i.setZone(null));
        }
        if (arrosages != null) {
            arrosages.forEach(i -> i.setZone(this));
        }
        this.arrosages = arrosages;
    }

    public Zone arrosages(Set<Arrosage> arrosages) {
        this.setArrosages(arrosages);
        return this;
    }

    public Zone addArrosage(Arrosage arrosage) {
        this.arrosages.add(arrosage);
        arrosage.setZone(this);
        return this;
    }

    public Zone removeArrosage(Arrosage arrosage) {
        this.arrosages.remove(arrosage);
        arrosage.setZone(null);
        return this;
    }

    public Set<Plantation> getPlantations() {
        return this.plantations;
    }

    public void setPlantations(Set<Plantation> plantations) {
        if (this.plantations != null) {
            this.plantations.forEach(i -> i.setZone(null));
        }
        if (plantations != null) {
            plantations.forEach(i -> i.setZone(this));
        }
        this.plantations = plantations;
    }

    public Zone plantations(Set<Plantation> plantations) {
        this.setPlantations(plantations);
        return this;
    }

    public Zone addPlantation(Plantation plantation) {
        this.plantations.add(plantation);
        plantation.setZone(this);
        return this;
    }

    public Zone removePlantation(Plantation plantation) {
        this.plantations.remove(plantation);
        plantation.setZone(null);
        return this;
    }

    public Set<Grandeur> getGrandeurs() {
        return this.grandeurs;
    }

    public void setGrandeurs(Set<Grandeur> grandeurs) {
        if (this.grandeurs != null) {
            this.grandeurs.forEach(i -> i.setZone(null));
        }
        if (grandeurs != null) {
            grandeurs.forEach(i -> i.setZone(this));
        }
        this.grandeurs = grandeurs;
    }

    public Zone grandeurs(Set<Grandeur> grandeurs) {
        this.setGrandeurs(grandeurs);
        return this;
    }

    public Zone addGrandeur(Grandeur grandeur) {
        this.grandeurs.add(grandeur);
        grandeur.setZone(this);
        return this;
    }

    public Zone removeGrandeur(Grandeur grandeur) {
        this.grandeurs.remove(grandeur);
        grandeur.setZone(null);
        return this;
    }

    public TypeSol getTypesol() {
        return this.typesol;
    }

    public void setTypesol(TypeSol typeSol) {
        this.typesol = typeSol;
    }

    public Zone typesol(TypeSol typeSol) {
        this.setTypesol(typeSol);
        return this;
    }

    public EspaceVert getEspaceVert() {
        return this.espaceVert;
    }

    public void setEspaceVert(EspaceVert espaceVert) {
        this.espaceVert = espaceVert;
    }

    public Zone espaceVert(EspaceVert espaceVert) {
        this.setEspaceVert(espaceVert);
        return this;
    }

    public Boitier getBoitier() {
        return this.boitier;
    }

    public void setBoitier(Boitier boitier) {
        this.boitier = boitier;
    }

    public Zone boitier(Boitier boitier) {
        this.setBoitier(boitier);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Zone)) {
            return false;
        }
        return id != null && id.equals(((Zone) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Zone{" +
            "id=" + getId() +
            ", libelle='" + getLibelle() + "'" +
            ", superficie=" + getSuperficie() +
            ", nbrMaxPlante=" + getNbrMaxPlante() +
            ", photo='" + getPhoto() + "'" +
            ", photoContentType='" + getPhotoContentType() + "'" +
            "}";
    }
}
