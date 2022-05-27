package com.iir4.emsi.repository;

import com.iir4.emsi.domain.Capteur;
import com.iir4.emsi.domain.Connecte;

import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Connecte entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ConnecteRepository extends JpaRepository<Connecte, Long> {
	
	@Query("Select capteurs  from Capteur capteurs where capteurs.id not in ( Select connectes.capteur  from Connecte connectes)")
    List<Capteur> availableCap();
}
