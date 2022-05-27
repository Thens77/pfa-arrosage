package com.iir4.emsi.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;

/**
 * A Connecte.
 */
@Entity
@Table(name = "connecte")
public class Connecte implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "fonctionnel")
    private Boolean fonctionnel;

    @Column(name = "branche")
    private String branche;

    @ManyToOne
    private Capteur capteur;

    @ManyToOne
    @JsonIgnoreProperties(value = { "zones", "connectes", "installation" }, allowSetters = true)
    private Boitier boitier;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Connecte id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getFonctionnel() {
        return this.fonctionnel;
    }

    public Connecte fonctionnel(Boolean fonctionnel) {
        this.setFonctionnel(fonctionnel);
        return this;
    }

    public void setFonctionnel(Boolean fonctionnel) {
        this.fonctionnel = fonctionnel;
    }

    public String getBranche() {
        return this.branche;
    }

    public Connecte branche(String branche) {
        this.setBranche(branche);
        return this;
    }

    public void setBranche(String branche) {
        this.branche = branche;
    }

    public Capteur getCapteur() {
        return this.capteur;
    }

    public void setCapteur(Capteur capteur) {
        this.capteur = capteur;
    }

    public Connecte capteur(Capteur capteur) {
        this.setCapteur(capteur);
        return this;
    }

    public Boitier getBoitier() {
        return this.boitier;
    }

    public void setBoitier(Boitier boitier) {
        this.boitier = boitier;
    }

    public Connecte boitier(Boitier boitier) {
        this.setBoitier(boitier);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Connecte)) {
            return false;
        }
        return id != null && id.equals(((Connecte) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Connecte{" +
            "id=" + getId() +
            ", fonctionnel='" + getFonctionnel() + "'" +
            ", branche='" + getBranche() + "'" +
            "}";
    }
}
