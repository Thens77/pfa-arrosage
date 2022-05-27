package com.iir4.emsi.domain;

import java.io.Serializable;
import javax.persistence.*;

/**
 * A TypePlante.
 */
@Entity
@Table(name = "type_plante")
public class TypePlante implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "humidite_min")
    private Float humiditeMin;

    @Column(name = "humidite_max")
    private Float humiditeMax;

    @Column(name = "temperature_min")
    private Float temperatureMin;

    @Column(name = "temperature_max")
    private Float temperatureMax;

    @Column(name = "limunosite")
    private Float limunosite;

    @Column(name = "libelle")
    private String libelle;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TypePlante id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getHumiditeMin() {
        return this.humiditeMin;
    }

    public TypePlante humiditeMin(Float humiditeMin) {
        this.setHumiditeMin(humiditeMin);
        return this;
    }

    public void setHumiditeMin(Float humiditeMin) {
        this.humiditeMin = humiditeMin;
    }

    public Float getHumiditeMax() {
        return this.humiditeMax;
    }

    public TypePlante humiditeMax(Float humiditeMax) {
        this.setHumiditeMax(humiditeMax);
        return this;
    }

    public void setHumiditeMax(Float humiditeMax) {
        this.humiditeMax = humiditeMax;
    }

    public Float getTemperatureMin() {
        return this.temperatureMin;
    }

    public TypePlante temperatureMin(Float temperatureMin) {
        this.setTemperatureMin(temperatureMin);
        return this;
    }

    public void setTemperatureMin(Float temperatureMin) {
        this.temperatureMin = temperatureMin;
    }

    public Float getTemperatureMax() {
        return this.temperatureMax;
    }

    public TypePlante temperatureMax(Float temperatureMax) {
        this.setTemperatureMax(temperatureMax);
        return this;
    }

    public void setTemperatureMax(Float temperatureMax) {
        this.temperatureMax = temperatureMax;
    }

    public Float getLimunosite() {
        return this.limunosite;
    }

    public TypePlante limunosite(Float limunosite) {
        this.setLimunosite(limunosite);
        return this;
    }

    public void setLimunosite(Float limunosite) {
        this.limunosite = limunosite;
    }

    public String getLibelle() {
        return this.libelle;
    }

    public TypePlante libelle(String libelle) {
        this.setLibelle(libelle);
        return this;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TypePlante)) {
            return false;
        }
        return id != null && id.equals(((TypePlante) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TypePlante{" +
            "id=" + getId() +
            ", humiditeMin=" + getHumiditeMin() +
            ", humiditeMax=" + getHumiditeMax() +
            ", temperatureMin=" + getTemperatureMin() +
            ", temperatureMax=" + getTemperatureMax() +
            ", limunosite=" + getLimunosite() +
            ", libelle='" + getLibelle() + "'" +
            "}";
    }
}
