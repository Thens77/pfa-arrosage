package com.iir4.emsi.repository;

import com.iir4.emsi.domain.Boitier;
import com.iir4.emsi.domain.Capteur;

import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Capteur entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CapteurRepository extends JpaRepository<Capteur, Long> {
	@Query("select c from Capteur c where c.id in (select c.capteur.id from Connecte c where c.boitier.id=?1)")
	List<Capteur> getByBoitier(Long id);
	
	
}
