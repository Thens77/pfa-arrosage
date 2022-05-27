package com.iir4.emsi.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;

/**
 * A Plantation.
 */
@Entity
@Table(name = "plantation")
public class Plantation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "nbr_plante")
    private Integer nbrPlante;

    @ManyToOne
    @JsonIgnoreProperties(value = { "typeplante" }, allowSetters = true)
    private Plante plante;

    @ManyToOne
    @JsonIgnoreProperties(value = { "arrosages", "plantations", "grandeurs", "typesol", "espaceVert", "boitier" }, allowSetters = true)
    private Zone zone;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Plantation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public Plantation date(LocalDate date) {
        this.setDate(date);
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Integer getNbrPlante() {
        return this.nbrPlante;
    }

    public Plantation nbrPlante(Integer nbrPlante) {
        this.setNbrPlante(nbrPlante);
        return this;
    }

    public void setNbrPlante(Integer nbrPlante) {
        this.nbrPlante = nbrPlante;
    }

    public Plante getPlante() {
        return this.plante;
    }

    public void setPlante(Plante plante) {
        this.plante = plante;
    }

    public Plantation plante(Plante plante) {
        this.setPlante(plante);
        return this;
    }

    public Zone getZone() {
        return this.zone;
    }

    public void setZone(Zone zone) {
        this.zone = zone;
    }

    public Plantation zone(Zone zone) {
        this.setZone(zone);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Plantation)) {
            return false;
        }
        return id != null && id.equals(((Plantation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Plantation{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", nbrPlante=" + getNbrPlante() +
            "}";
    }
}
