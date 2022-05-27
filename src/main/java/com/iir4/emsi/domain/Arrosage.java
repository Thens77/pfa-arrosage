package com.iir4.emsi.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;

/**
 * A Arrosage.
 */
@Entity
@Table(name = "arrosage")
public class Arrosage implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "duree")
    private Double duree;

    @Column(name = "quantite_eau")
    private Double quantiteEau;

    @ManyToOne
    @JsonIgnoreProperties(value = { "arrosages", "plantations", "grandeurs", "typesol", "espaceVert", "boitier" }, allowSetters = true)
    private Zone zone;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Arrosage id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public Arrosage date(LocalDate date) {
        this.setDate(date);
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Double getDuree() {
        return this.duree;
    }

    public Arrosage duree(Double duree) {
        this.setDuree(duree);
        return this;
    }

    public void setDuree(Double duree) {
        this.duree = duree;
    }

    public Double getQuantiteEau() {
        return this.quantiteEau;
    }

    public Arrosage quantiteEau(Double quantiteEau) {
        this.setQuantiteEau(quantiteEau);
        return this;
    }

    public void setQuantiteEau(Double quantiteEau) {
        this.quantiteEau = quantiteEau;
    }

    public Zone getZone() {
        return this.zone;
    }

    public void setZone(Zone zone) {
        this.zone = zone;
    }

    public Arrosage zone(Zone zone) {
        this.setZone(zone);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Arrosage)) {
            return false;
        }
        return id != null && id.equals(((Arrosage) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Arrosage{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", duree=" + getDuree() +
            ", quantiteEau=" + getQuantiteEau() +
            "}";
    }
}
