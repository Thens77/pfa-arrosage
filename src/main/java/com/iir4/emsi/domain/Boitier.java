package com.iir4.emsi.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Boitier.
 */
@Entity
@Table(name = "boitier")
public class Boitier implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "refrence")
    private String refrence;

    @Column(name = "nbr_branche")
    private Integer nbrBranche;

    @OneToMany(mappedBy = "boitier")
    @JsonIgnoreProperties(value = { "arrosages", "plantations", "grandeurs", "typesol", "espaceVert", "boitier" }, allowSetters = true)
    private Set<Zone> zones = new HashSet<>();

    @OneToMany(mappedBy = "boitier")
    @JsonIgnoreProperties(value = { "capteur", "boitier" }, allowSetters = true)
    private Set<Connecte> connectes = new HashSet<>();

    @ManyToOne
    private Installation installation;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Boitier id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRefrence() {
        return this.refrence;
    }

    public Boitier refrence(String refrence) {
        this.setRefrence(refrence);
        return this;
    }

    public void setRefrence(String refrence) {
        this.refrence = refrence;
    }

    public Integer getNbrBranche() {
        return this.nbrBranche;
    }

    public Boitier nbrBranche(Integer nbrBranche) {
        this.setNbrBranche(nbrBranche);
        return this;
    }

    public void setNbrBranche(Integer nbrBranche) {
        this.nbrBranche = nbrBranche;
    }

    public Set<Zone> getZones() {
        return this.zones;
    }

    public void setZones(Set<Zone> zones) {
        if (this.zones != null) {
            this.zones.forEach(i -> i.setBoitier(null));
        }
        if (zones != null) {
            zones.forEach(i -> i.setBoitier(this));
        }
        this.zones = zones;
    }

    public Boitier zones(Set<Zone> zones) {
        this.setZones(zones);
        return this;
    }

    public Boitier addZone(Zone zone) {
        this.zones.add(zone);
        zone.setBoitier(this);
        return this;
    }

    public Boitier removeZone(Zone zone) {
        this.zones.remove(zone);
        zone.setBoitier(null);
        return this;
    }

    public Set<Connecte> getConnectes() {
        return this.connectes;
    }

    public void setConnectes(Set<Connecte> connectes) {
        if (this.connectes != null) {
            this.connectes.forEach(i -> i.setBoitier(null));
        }
        if (connectes != null) {
            connectes.forEach(i -> i.setBoitier(this));
        }
        this.connectes = connectes;
    }

    public Boitier connectes(Set<Connecte> connectes) {
        this.setConnectes(connectes);
        return this;
    }

    public Boitier addConnecte(Connecte connecte) {
        this.connectes.add(connecte);
        connecte.setBoitier(this);
        return this;
    }

    public Boitier removeConnecte(Connecte connecte) {
        this.connectes.remove(connecte);
        connecte.setBoitier(null);
        return this;
    }

    public Installation getInstallation() {
        return this.installation;
    }

    public void setInstallation(Installation installation) {
        this.installation = installation;
    }

    public Boitier installation(Installation installation) {
        this.setInstallation(installation);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Boitier)) {
            return false;
        }
        return id != null && id.equals(((Boitier) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Boitier{" +
            "id=" + getId() +
            ", refrence='" + getRefrence() + "'" +
            ", nbrBranche=" + getNbrBranche() +
            "}";
    }
}
